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
  chapter_id: typeof CHAPTER_ID;
  student_id: string | null;
  session_id: string | null;
  status: SessionStatus;
  time_spent_seconds: number;
  topic_completion_ratio: number;
  submitted_at: string;
};

const CHAPTER_ID = "grade6_prime_time" as const;
const COMPLETION_RATIO_PRECISION = 4;
const DASHBOARD_URL = String(import.meta.env.VITE_DASHBOARD_URL ?? "").trim()
  || "https://kaushik-dev.online/dashboard";
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
let detachExitHandlers: (() => void) | null = null;

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
  if (!MERGE_API_URL) {
    console.warn("[sessionTracking] VITE_MERGE_API_URL is not configured for beacon submit");
    return false;
  }

  if (typeof navigator.sendBeacon !== "function") {
    console.warn("[sessionTracking] navigator.sendBeacon is not available in this browser");
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
  if (typeof window === "undefined") {
    return { token: null, student_id: null, session_id: null };
  }

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
  const startMs = new Date(metrics.start_time).getTime();
  if (!Number.isFinite(startMs)) {
    console.warn(
      "[sessionTracking] Invalid start_time:",
      metrics.start_time,
      "Falling back to current timestamp for time calculation."
    );
  }
  const start = Number.isFinite(startMs) ? startMs : nowMs;

  const time_spent_seconds = Math.max(0, Math.floor((nowMs - start) / 1000));
  const topic_completion_ratio =
    metrics.total_questions > 0
      ? Number(
          (metrics.questions_attempted / metrics.total_questions).toFixed(
            COMPLETION_RATIO_PRECISION
          )
        )
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
    if (!MERGE_API_URL) {
      console.warn("[sessionTracking] VITE_MERGE_API_URL is not configured for submitSession");
    }
    if (!token) {
      console.warn("[sessionTracking] token is missing; cannot set Authorization header");
    }
    return false;
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
  if (exitHandlersAttached) {
    if (detachExitHandlers) return detachExitHandlers;
    return () => undefined;
  }
  exitHandlersAttached = true;
  let cleaned = false;
  let exiting = false;

  const onExit = () => {
    if (exiting) return;
    exiting = true;
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
  document.addEventListener("visibilitychange", onVisibilityChange);

  detachExitHandlers = () => {
    if (cleaned) return;
    cleaned = true;
    exitHandlersAttached = false;
    detachExitHandlers = null;
    window.removeEventListener("beforeunload", onExit);
    window.removeEventListener("pagehide", onExit);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  return detachExitHandlers;
}

export async function confirmReturnToDashboard(): Promise<void> {
  const shouldLeave = window.confirm(
    "Return to dashboard now? We will attempt to submit your current session before leaving."
  );

  if (!shouldLeave) return;

  try {
    const submitted = await submitSession("exited_midway");
    if (!submitted) {
      console.warn("[sessionTracking] Unable to confirm exit submission before redirect");
    }
  } finally {
    window.location.href = DASHBOARD_URL;
  }
}
