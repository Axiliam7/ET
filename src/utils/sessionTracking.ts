export type SessionStatus = "completed" | "exited_midway";

type StoredSessionMetrics = {
  correct_answers: number;
  wrong_answers: number;
  questions_attempted: number;
  total_questions: number;
  retry_count: number;
  hints_used: number;
  total_hints_embedded: number;
  start_time_ms: number;
  completed_units: number;
  total_units: number;
};

export type SessionPayload = {
  student_id: string;
  session_id: string;
  chapter_id: typeof CHAPTER_ID;
  timestamp: string;
  session_status: SessionStatus;
  correct_answers: number;
  wrong_answers: number;
  questions_attempted: number;
  total_questions: number;
  retry_count: number;
  hints_used: number;
  total_hints_embedded: number;
  time_spent_seconds: number;
  topic_completion_ratio: number;
};

export type SubmitSessionResult = {
  ok: boolean;
  status: "submitted" | "already_submitted" | "queued_pending" | "invalid";
  responseData?: unknown;
};

const CHAPTER_ID = "grade6_prime_time" as const;
const DASHBOARD_URL = "https://kaushik-dev.online/dashboard";
const MERGE_API_URL =
  String(import.meta.env.VITE_MERGE_API_URL ?? "").trim() ||
  "https://kaushik-dev.online/api/recommend/";
const MAX_RETRY_ATTEMPTS = 3;
const PENDING_PAYLOAD_KEY = "pendingPayload";

const STORAGE_KEYS = {
  token: "token",
  studentId: "student_id",
  sessionId: "session_id",
  metrics: "et_session_metrics_v2",
  submitted: "submitted",
};

let activeSubmission: Promise<SubmitSessionResult> | null = null;
let activePendingReplay: Promise<boolean> | null = null;
let exitHandlersAttached = false;
let detachExitHandlers: (() => void) | null = null;

function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function toNonNegativeInt(value: unknown, fallback = 0): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.floor(num));
}

function toRatio(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num <= 0) return 0;
  if (num >= 1) return 1;
  return Number(num.toFixed(4));
}

function defaultMetrics(): StoredSessionMetrics {
  return {
    correct_answers: 0,
    wrong_answers: 0,
    questions_attempted: 0,
    total_questions: 0,
    retry_count: 0,
    hints_used: 0,
    total_hints_embedded: 0,
    start_time_ms: Date.now(),
    completed_units: 0,
    total_units: 0,
  };
}

function normalizeMetrics(
  input: Partial<StoredSessionMetrics> | null | undefined
): StoredSessionMetrics {
  const defaults = defaultMetrics();
  return {
    correct_answers: toNonNegativeInt(input?.correct_answers),
    wrong_answers: toNonNegativeInt(input?.wrong_answers),
    questions_attempted: toNonNegativeInt(input?.questions_attempted),
    total_questions: toNonNegativeInt(input?.total_questions),
    retry_count: toNonNegativeInt(input?.retry_count),
    hints_used: toNonNegativeInt(input?.hints_used),
    total_hints_embedded: toNonNegativeInt(input?.total_hints_embedded),
    start_time_ms: toNonNegativeInt(input?.start_time_ms, defaults.start_time_ms),
    completed_units: toNonNegativeInt(input?.completed_units),
    total_units: toNonNegativeInt(input?.total_units),
  };
}

function readStoredMetrics(): StoredSessionMetrics {
  const storage = safeSessionStorage();
  if (!storage) return defaultMetrics();

  const raw = storage.getItem(STORAGE_KEYS.metrics);
  if (!raw) {
    const initial = defaultMetrics();
    storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(initial));
    return initial;
  }

  try {
    return normalizeMetrics(JSON.parse(raw) as Partial<StoredSessionMetrics>);
  } catch {
    const reset = defaultMetrics();
    storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(reset));
    return reset;
  }
}

function writeStoredMetrics(next: StoredSessionMetrics): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(normalizeMetrics(next)));
}

function getStoredValue(key: string): string | null {
  const storage = safeSessionStorage();
  const value = storage?.getItem(key) ?? null;
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function wasSubmitted(): boolean {
  const storage = safeSessionStorage();
  return storage?.getItem(STORAGE_KEYS.submitted) === "true";
}

function markSubmitted(): void {
  const storage = safeSessionStorage();
  storage?.setItem(STORAGE_KEYS.submitted, "true");
}

function clearSubmittedFlag(): void {
  const storage = safeSessionStorage();
  storage?.removeItem(STORAGE_KEYS.submitted);
}

function parseTokenFromStorage(): string | null {
  return getStoredValue(STORAGE_KEYS.token);
}

function parseStoredIds(): { student_id: string; session_id: string } | null {
  const student_id = getStoredValue(STORAGE_KEYS.studentId);
  const session_id = getStoredValue(STORAGE_KEYS.sessionId);
  if (!student_id || !session_id) return null;
  return { student_id, session_id };
}

function setStoredString(key: string, value: string): void {
  const storage = safeSessionStorage();
  storage?.setItem(key, value);
}

function persistUrlParam(params: URLSearchParams, paramName: string): string | null {
  const raw = params.get(paramName);
  if (typeof raw !== "string") return getStoredValue(paramName);

  const trimmed = raw.trim();
  if (!trimmed) return getStoredValue(paramName);

  setStoredString(paramName, trimmed);
  return trimmed;
}

function isValidTimestamp(value: string): boolean {
  const t = Date.parse(value);
  return Number.isFinite(t);
}

function validatePayloadShape(payload: SessionPayload): SessionPayload {
  const keys = Object.keys(payload).sort();
  const expectedKeys = [
    "chapter_id",
    "correct_answers",
    "hints_used",
    "questions_attempted",
    "retry_count",
    "session_id",
    "session_status",
    "student_id",
    "time_spent_seconds",
    "timestamp",
    "topic_completion_ratio",
    "total_hints_embedded",
    "total_questions",
    "wrong_answers",
  ].sort();

  if (keys.length !== expectedKeys.length || keys.some((k, i) => k !== expectedKeys[i])) {
    throw new Error(
      `Invalid payload shape. expected=[${expectedKeys.join(",")}], received=[${keys.join(",")}]`
    );
  }

  if (!payload.student_id.trim() || !payload.session_id.trim()) {
    throw new Error("Missing student_id or session_id");
  }
  if (payload.chapter_id !== CHAPTER_ID) {
    throw new Error("Invalid chapter_id");
  }
  if (payload.session_status !== "completed" && payload.session_status !== "exited_midway") {
    throw new Error("Invalid session_status");
  }
  if (!isValidTimestamp(payload.timestamp)) {
    throw new Error("Invalid timestamp");
  }

  const integerFields: Array<keyof SessionPayload> = [
    "correct_answers",
    "wrong_answers",
    "questions_attempted",
    "total_questions",
    "retry_count",
    "hints_used",
    "total_hints_embedded",
    "time_spent_seconds",
  ];

  for (const field of integerFields) {
    const value = payload[field];
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new Error(`Invalid ${String(field)}`);
    }
  }

  if (payload.questions_attempted > payload.total_questions) {
    throw new Error("questions_attempted cannot exceed total_questions");
  }
  if (payload.correct_answers + payload.wrong_answers > payload.questions_attempted) {
    throw new Error("correct_answers + wrong_answers cannot exceed questions_attempted");
  }
  if (payload.hints_used > payload.total_hints_embedded) {
    throw new Error("hints_used cannot exceed total_hints_embedded");
  }
  if (
    typeof payload.topic_completion_ratio !== "number" ||
    Number.isNaN(payload.topic_completion_ratio) ||
    payload.topic_completion_ratio < 0 ||
    payload.topic_completion_ratio > 1
  ) {
    throw new Error("Invalid topic_completion_ratio");
  }

  return payload;
}

function readPendingPayload(): SessionPayload | null {
  const storage = safeLocalStorage();
  const raw = storage?.getItem(PENDING_PAYLOAD_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    return validatePayloadShape(parsed);
  } catch {
    storage?.removeItem(PENDING_PAYLOAD_KEY);
    return null;
  }
}

function queuePendingPayload(payload: SessionPayload): void {
  const storage = safeLocalStorage();
  storage?.setItem(PENDING_PAYLOAD_KEY, JSON.stringify(payload));
}

function clearPendingPayload(): void {
  const storage = safeLocalStorage();
  storage?.removeItem(PENDING_PAYLOAD_KEY);
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function postSessionPayload(
  payload: SessionPayload,
  token: string,
  attempts = MAX_RETRY_ATTEMPTS
): Promise<{ ok: boolean; responseData?: unknown }> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(MERGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (response.ok) {
        let responseData: unknown = null;
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }
        return { ok: true, responseData };
      }
    } catch {
      // Continue to retry.
    }

    if (attempt < attempts) {
      await delay(2 ** (attempt - 1) * 300);
    }
  }

  return { ok: false };
}

function sendExitBeacon(payload: SessionPayload): boolean {
  if (typeof navigator.sendBeacon !== "function") {
    return false;
  }

  const body = new Blob([JSON.stringify(payload)], { type: "application/json" });
  return navigator.sendBeacon(MERGE_API_URL, body);
}

function resetForNewSession(): void {
  clearSubmittedFlag();
  writeStoredMetrics(defaultMetrics());
}

export function extractSessionParams(): {
  token: string | null;
  student_id: string | null;
  session_id: string | null;
} {
  if (typeof window === "undefined") {
    return { token: null, student_id: null, session_id: null };
  }

  const params = new URLSearchParams(window.location.search);
  const previousSessionId = getStoredValue(STORAGE_KEYS.sessionId);

  const token = persistUrlParam(params, STORAGE_KEYS.token);
  const student_id = persistUrlParam(params, STORAGE_KEYS.studentId);
  const session_id = persistUrlParam(params, STORAGE_KEYS.sessionId);

  if (session_id && previousSessionId && session_id !== previousSessionId) {
    resetForNewSession();
  }

  readStoredMetrics();
  void retryPendingSubmission();

  return { token, student_id, session_id };
}

export function updateSessionMetrics(
  patch: Partial<
    StoredSessionMetrics & {
      topic_completion_ratio: number;
    }
  >
): StoredSessionMetrics {
  const current = readStoredMetrics();
  const merged = normalizeMetrics({
    ...current,
    ...patch,
    completed_units: patch.completed_units ?? current.completed_units,
    total_units: patch.total_units ?? current.total_units,
  });

  if (typeof patch.topic_completion_ratio === "number") {
    merged.completed_units = Math.round(
      toRatio(patch.topic_completion_ratio) * Math.max(merged.total_units, 0)
    );
  }

  writeStoredMetrics(merged);
  return merged;
}

export function recordSessionAttempt(input: {
  questions_attempted: number;
  correct_answers: number;
  wrong_answers: number;
  hints_used: number;
  total_hints_embedded: number;
  retry_count?: number;
}): StoredSessionMetrics {
  const current = readStoredMetrics();

  const questions_attempted = toNonNegativeInt(input.questions_attempted);
  const correct_answers = toNonNegativeInt(input.correct_answers);
  const wrong_answers = toNonNegativeInt(input.wrong_answers);
  const hints_used = toNonNegativeInt(input.hints_used);
  const total_hints_embedded = toNonNegativeInt(input.total_hints_embedded);
  const retry_count = toNonNegativeInt(input.retry_count ?? wrong_answers);

  const next = normalizeMetrics({
    ...current,
    questions_attempted: current.questions_attempted + questions_attempted,
    correct_answers: current.correct_answers + correct_answers,
    wrong_answers: current.wrong_answers + wrong_answers,
    hints_used: current.hints_used + hints_used,
    total_hints_embedded: current.total_hints_embedded + total_hints_embedded,
    retry_count: current.retry_count + retry_count,
  });

  writeStoredMetrics(next);
  return next;
}

export function buildPayload(status: SessionStatus): SessionPayload {
  const ids = parseStoredIds();
  if (!ids) {
    throw new Error("Missing student_id or session_id in sessionStorage");
  }

  const metrics = readStoredMetrics();
  const nowMs = Date.now();
  const time_spent_seconds = Math.max(
    0,
    Math.floor((nowMs - Math.max(0, metrics.start_time_ms)) / 1000)
  );

  const topic_completion_ratio =
    metrics.total_units > 0
      ? toRatio(metrics.completed_units / metrics.total_units)
      : 0;

  const payload: SessionPayload = {
    student_id: ids.student_id,
    session_id: ids.session_id,
    chapter_id: CHAPTER_ID,
    timestamp: new Date(nowMs).toISOString(),
    session_status: status,
    correct_answers: metrics.correct_answers,
    wrong_answers: metrics.wrong_answers,
    questions_attempted: metrics.questions_attempted,
    total_questions: metrics.total_questions,
    retry_count: metrics.retry_count,
    hints_used: metrics.hints_used,
    total_hints_embedded: metrics.total_hints_embedded,
    time_spent_seconds,
    topic_completion_ratio,
  };

  return validatePayloadShape(payload);
}

export async function retryPendingSubmission(): Promise<boolean> {
  if (activePendingReplay) return activePendingReplay;

  activePendingReplay = (async () => {
    const pendingPayload = readPendingPayload();
    if (!pendingPayload) return true;

    const token = parseTokenFromStorage();
    if (!token) return false;

    const result = await postSessionPayload(pendingPayload, token);
    if (!result.ok) return false;

    clearPendingPayload();

    const currentSessionId = getStoredValue(STORAGE_KEYS.sessionId);
    if (currentSessionId && currentSessionId === pendingPayload.session_id) {
      markSubmitted();
    }

    return true;
  })().finally(() => {
    activePendingReplay = null;
  });

  return activePendingReplay;
}

export async function submitSession(status: SessionStatus): Promise<SubmitSessionResult> {
  if (wasSubmitted()) {
    return { ok: true, status: "already_submitted" };
  }

  if (activeSubmission) return activeSubmission;

  activeSubmission = (async () => {
    let payload: SessionPayload;
    try {
      payload = buildPayload(status);
    } catch {
      return { ok: false, status: "invalid" };
    }

    const token = parseTokenFromStorage();
    if (!token) {
      queuePendingPayload(payload);
      markSubmitted();
      return { ok: false, status: "queued_pending" };
    }

    const response = await postSessionPayload(payload, token);
    if (response.ok) {
      clearPendingPayload();
      markSubmitted();
      return {
        ok: true,
        status: "submitted",
        responseData: response.responseData,
      };
    }

    queuePendingPayload(payload);
    markSubmitted();
    return { ok: false, status: "queued_pending" };
  })().finally(() => {
    activeSubmission = null;
  });

  return activeSubmission;
}

export function setupExitHandlers(): () => void {
  if (exitHandlersAttached) {
    if (detachExitHandlers) return detachExitHandlers;
    return () => undefined;
  }

  exitHandlersAttached = true;

  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (wasSubmitted()) return;
    event.preventDefault();
    event.returnValue = "";
  };

  const onUnload = () => {
    if (wasSubmitted()) return;

    try {
      const payload = buildPayload("exited_midway");
      const sent = sendExitBeacon(payload);
      if (sent) markSubmitted();
    } catch {
      // No-op. Do not fabricate ids/session.
    }
  };

  window.addEventListener("beforeunload", onBeforeUnload);
  window.addEventListener("unload", onUnload);

  detachExitHandlers = () => {
    exitHandlersAttached = false;
    detachExitHandlers = null;
    window.removeEventListener("beforeunload", onBeforeUnload);
    window.removeEventListener("unload", onUnload);
  };

  return detachExitHandlers;
}

export async function confirmReturnToDashboard(): Promise<void> {
  const shouldLeave = window.confirm(
    "Are you sure you want to return to Dashboard? We will submit your session before leaving."
  );

  if (!shouldLeave) return;

  try {
    await submitSession("exited_midway");
  } finally {
    window.location.href = DASHBOARD_URL;
  }
}
