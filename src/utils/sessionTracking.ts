export type SessionStatus = "completed" | "exited_midway" | (string & {});

export type SessionMetrics = {
  correct_answers: number;
  wrong_answers: number;
  questions_attempted: number;
  total_questions: number;
  retry_count: number;
  hints_used: number;
  total_hints_embedded: number;
  start_time: string;
};

export type SessionPayload = SessionMetrics & {
  chapter_id: "grade6_prime_time";
  student_id: string | null;
  session_id: string | null;
  status: SessionStatus;
  time_spent_seconds: number;
  topic_completion_ratio: number;
  submitted_at: string;
};

const CHAPTER_ID = "grade6_prime_time" as const;
const DASHBOARD_URL = "https://kaushik-dev.online/dashboard";
const MERGE_API_URL = String(import.meta.env.VITE_MERGE_API_URL ?? "").trim();

const STORAGE_KEYS = {
  token: "token",
  studentId: "student_id",
  sessionId: "session_id",
  metrics: "et_session_metrics_v1",
  submitted: "et_session_submitted_v1",
};

let activeSubmission: Promise<boolean> | null = null;
let exitHandlersAttached = false;

function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function toNonNegativeInt(value: unknown, fallback = 0): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.floor(num));
}

function normalizeMetrics(input: Partial<SessionMetrics> | null | undefined): SessionMetrics {
  const start =
    typeof input?.start_time === "string" && input.start_time.trim().length > 0
      ? input.start_time
      : new Date().toISOString();

  return {
    correct_answers: toNonNegativeInt(input?.correct_answers),
    wrong_answers: toNonNegativeInt(input?.wrong_answers),
    questions_attempted: toNonNegativeInt(input?.questions_attempted),
    total_questions: toNonNegativeInt(input?.total_questions),
    retry_count: toNonNegativeInt(input?.retry_count),
    hints_used: toNonNegativeInt(input?.hints_used),
    total_hints_embedded: toNonNegativeInt(input?.total_hints_embedded),
    start_time: start,
  };
}

function readStoredMetrics(): SessionMetrics {
  const storage = safeSessionStorage();
  if (!storage) return normalizeMetrics(null);

  const raw = storage.getItem(STORAGE_KEYS.metrics);
  if (!raw) {
    const initial = normalizeMetrics(null);
    storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(initial));
    return initial;
  }

  try {
    return normalizeMetrics(JSON.parse(raw) as Partial<SessionMetrics>);
  } catch {
    const reset = normalizeMetrics(null);
    storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(reset));
    return reset;
  }
}

function writeStoredMetrics(next: SessionMetrics): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.metrics, JSON.stringify(next));
}

function wasSubmitted(): boolean {
  const storage = safeSessionStorage();
  return storage?.getItem(STORAGE_KEYS.submitted) === "1";
}

function markSubmitted(): void {
  const storage = safeSessionStorage();
  storage?.setItem(STORAGE_KEYS.submitted, "1");
}

function getStoredValue(key: string): string | null {
  const storage = safeSessionStorage();
  const value = storage?.getItem(key) ?? null;
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function persistUrlParam(params: URLSearchParams, paramName: string): string | null {
  const raw = params.get(paramName);
  if (typeof raw !== "string") return getStoredValue(paramName);

  const trimmed = raw.trim();
  if (!trimmed) return getStoredValue(paramName);

  const storage = safeSessionStorage();
  storage?.setItem(paramName, trimmed);
  return trimmed;
}

function sendExitBeacon(payload: SessionPayload): boolean {
  if (!MERGE_API_URL || typeof navigator.sendBeacon !== "function") {
    return false;
  }

  const body = new Blob([JSON.stringify(payload)], { type: "application/json" });
  return navigator.sendBeacon(MERGE_API_URL, body);
}

export function extractSessionParams(): {
  token: string | null;
  student_id: string | null;
  session_id: string | null;
} {
  const params = new URLSearchParams(window.location.search);

  const token = persistUrlParam(params, STORAGE_KEYS.token);
  const student_id = persistUrlParam(params, STORAGE_KEYS.studentId);
  const session_id = persistUrlParam(params, STORAGE_KEYS.sessionId);

  readStoredMetrics();

  return { token, student_id, session_id };
}

export function updateSessionMetrics(patch: Partial<SessionMetrics>): SessionMetrics {
  const current = readStoredMetrics();
  const merged = normalizeMetrics({ ...current, ...patch });
  writeStoredMetrics(merged);
  return merged;
}

export function buildPayload(status: SessionStatus): SessionPayload {
  const metrics = readStoredMetrics();
  const nowMs = Date.now();
  const startMs = Date.parse(metrics.start_time);
  const start = Number.isFinite(startMs) ? startMs : nowMs;

  const time_spent_seconds = Math.max(0, Math.floor((nowMs - start) / 1000));
  const topic_completion_ratio =
    metrics.total_questions > 0
      ? Number((metrics.questions_attempted / metrics.total_questions).toFixed(4))
      : 0;

  return {
    chapter_id: CHAPTER_ID,
    student_id: getStoredValue(STORAGE_KEYS.studentId),
    session_id: getStoredValue(STORAGE_KEYS.sessionId),
    status,
    ...metrics,
    time_spent_seconds,
    topic_completion_ratio,
    submitted_at: new Date(nowMs).toISOString(),
  };
}

export async function submitSession(status: SessionStatus): Promise<boolean> {
  if (wasSubmitted()) return true;
  if (activeSubmission) return activeSubmission;

  const payload = buildPayload(status);
  markSubmitted();

  if (status === "exited_midway") {
    return sendExitBeacon(payload);
  }

  const token = getStoredValue(STORAGE_KEYS.token);
  if (!MERGE_API_URL || !token) {
    activeSubmission = Promise.resolve(false);
    const result = await activeSubmission;
    activeSubmission = null;
    return result;
  }

  activeSubmission = fetch(MERGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      activeSubmission = null;
    });

  return activeSubmission;
}

export function setupExitHandlers(): () => void {
  if (exitHandlersAttached) return () => undefined;
  exitHandlersAttached = true;

  const onExit = () => {
    if (wasSubmitted()) return;
    const payload = buildPayload("exited_midway");
    markSubmitted();
    sendExitBeacon(payload);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      onExit();
    }
  };

  window.addEventListener("beforeunload", onExit);
  window.addEventListener("pagehide", onExit);
  window.addEventListener("popstate", onExit);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    if (!exitHandlersAttached) return;
    exitHandlersAttached = false;
    window.removeEventListener("beforeunload", onExit);
    window.removeEventListener("pagehide", onExit);
    window.removeEventListener("popstate", onExit);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

export async function confirmReturnToDashboard(): Promise<void> {
  const shouldLeave = window.confirm(
    "Return to dashboard now? Your current session will be submitted once before leaving."
  );

  if (!shouldLeave) return;

  try {
    await submitSession("exited_midway");
  } finally {
    window.location.href = DASHBOARD_URL;
  }
}
