import type {
  ConceptId,
  HintsAggregate,
  QuizSubmitPayload,
  QuizTelemetryMeta,
  QuizTimeTaken,
} from "../types";

const STORAGE_KEY = "prime-time-learner-v1";

/** Mastery score 0–100 per concept; updated with exponential moving average after each quiz. */
export type MasteryMap = Record<ConceptId, number>;

/** Per-concept stuck detection: failed quiz rounds on that concept and latched stuck flag. */
export type ConceptStuckMap = Record<
  ConceptId,
  { failedAttempts: number; isStuck: boolean }
>;

/** One full quiz submit: per-question correctness, hints, and timing (persisted + API). */
export interface QuizSubmissionRecord {
  at: string;
  quizId: string;
  overallPercent: number;
  correctByQuestion: Record<string, boolean>;
  hintsUsed: Record<string, number>;
  timeTaken: QuizTimeTaken;
  questionsMeta: { id: string; conceptId: ConceptId }[];
}

export interface AttemptRecord {
  at: string;
  quizId: string;
  scorePercent: number;
  conceptId: ConceptId;
  /** Sum of hint tiers used on questions for this concept in this quiz. */
  hintsUsedForConcept?: number;
  /** Ms attributed to this concept for this quiz (see timeTaken.perQuestionMs). */
  timeMsForConcept?: number;
  /** Whole-quiz wall time for this submit (same on each concept row for that batch). */
  quizTotalMs?: number;
  /** Full per-question hint counts for this quiz submit (duplicate on each concept row for that batch). */
  hintsUsedByQuestion?: Record<string, number>;
}

export interface LearnerState {
  version: 1;
  mastery: MasteryMap;
  attempts: AttemptRecord[];
  /** Lesson slugs marked complete by learner (navigation aid) */
  completedLessons: string[];
  unitAssessmentBest: number | null;
  remedialConcepts: ConceptId[];
  /** Weak concept performance per quiz round; isStuck after two failures. */
  conceptStuck: ConceptStuckMap;
  /** True while a remedial episode is active (set when any concept becomes stuck; cleared when none remain). */
  isRemediating: boolean;
  /** Full quiz submits: per-question correctness, hints, and time. */
  submissionHistory: QuizSubmissionRecord[];
}

const CONCEPT_ORDER: ConceptId[] = [
  "intro",
  "factor_pairs",
  "prime_composite",
  "prime_factorization",
  "gcf_lcm",
  "applications",
];

const PREREQ: Record<ConceptId, ConceptId | null> = {
  intro: null,
  factor_pairs: "intro",
  prime_composite: "factor_pairs",
  prime_factorization: "prime_composite",
  gcf_lcm: "prime_factorization",
  applications: "gcf_lcm",
};

/** Exported for UI copy aligned with remedial triggering and recommendations. */
export const THRESHOLD_WEAK = 55;
const THRESHOLD_STRONG = 88;

function defaultMastery(): MasteryMap {
  return {
    intro: 0,
    factor_pairs: 0,
    prime_composite: 0,
    prime_factorization: 0,
    gcf_lcm: 0,
    applications: 0,
  };
}

function defaultConceptStuck(): ConceptStuckMap {
  const z = { failedAttempts: 0, isStuck: false };
  return {
    intro: { ...z },
    factor_pairs: { ...z },
    prime_composite: { ...z },
    prime_factorization: { ...z },
    gcf_lcm: { ...z },
    applications: { ...z },
  };
}

function anyConceptStuck(map: ConceptStuckMap): boolean {
  return CONCEPT_ORDER.some((c) => map[c].isStuck);
}

export function emptyLearnerState(): LearnerState {
  return {
    version: 1,
    mastery: defaultMastery(),
    attempts: [],
    completedLessons: [],
    unitAssessmentBest: null,
    remedialConcepts: [],
    conceptStuck: defaultConceptStuck(),
    isRemediating: false,
    submissionHistory: [],
  };
}

export function loadLearnerState(): LearnerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLearnerState();
    const parsed = JSON.parse(raw) as LearnerState;
    if (parsed.version !== 1 || typeof parsed.mastery !== "object") {
      return emptyLearnerState();
    }
    const base = emptyLearnerState();
    const parsedStuck =
      parsed.conceptStuck && typeof parsed.conceptStuck === "object"
        ? (parsed.conceptStuck as Partial<ConceptStuckMap>)
        : {};
    const conceptStuck = { ...base.conceptStuck };
    for (const c of CONCEPT_ORDER) {
      const row = parsedStuck[c];
      if (row && typeof row.failedAttempts === "number") {
        const failedAttempts = Math.max(0, row.failedAttempts);
        conceptStuck[c] = {
          failedAttempts,
          isStuck: Boolean(row.isStuck) || failedAttempts >= 2,
        };
      }
    }
    const stuckNow = anyConceptStuck(conceptStuck);
    const isRemediating =
      typeof parsed.isRemediating === "boolean"
        ? stuckNow && parsed.isRemediating
        : stuckNow;
    return {
      ...base,
      ...parsed,
      mastery: { ...base.mastery, ...parsed.mastery },
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      remedialConcepts: Array.isArray(parsed.remedialConcepts)
        ? (parsed.remedialConcepts as ConceptId[])
        : [],
      conceptStuck,
      isRemediating,
      submissionHistory: Array.isArray(parsed.submissionHistory)
        ? (parsed.submissionHistory as QuizSubmissionRecord[])
        : [],
    };
  } catch {
    return emptyLearnerState();
  }
}

export function saveLearnerState(state: LearnerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const HINT_PENALTY_PER_STEP = 0.04;
const HINT_PENALTY_CAP_STEPS = 9;
const HINT_PENALTY_FLOOR_FACTOR = 0.72;

/** Raw quiz percent for a concept, reduced when hints were used (input to EMA only). */
export function scorePercentAfterHints(rawPercent: number, hintsSum: number): number {
  if (rawPercent <= 0) return 0;
  if (hintsSum <= 0) return Math.round(rawPercent);
  const steps = Math.min(hintsSum, HINT_PENALTY_CAP_STEPS);
  const factor = Math.max(HINT_PENALTY_FLOOR_FACTOR, 1 - HINT_PENALTY_PER_STEP * steps);
  return Math.max(0, Math.round(rawPercent * factor));
}

const REMEDIAL_ALL_HINTS_LEVEL = 3;

function aggregateTimeByConcept(
  perQuestionMs: QuizTimeTaken["perQuestionMs"],
  questionsMeta: QuizTelemetryMeta["questionsMeta"]
): Map<ConceptId, number> {
  const m = new Map<ConceptId, number>();
  for (const q of questionsMeta) {
    const ms = perQuestionMs[q.id] ?? 0;
    m.set(q.conceptId, (m.get(q.conceptId) ?? 0) + ms);
  }
  return m;
}

const SUBMISSION_HISTORY_CAP = 40;

/** Build a persisted / API-ready row from the quiz runner payload. */
export function buildQuizSubmissionRecord(
  quizId: string,
  payload: QuizSubmitPayload
): QuizSubmissionRecord {
  return {
    at: new Date().toISOString(),
    quizId,
    overallPercent: payload.overallPercent,
    correctByQuestion: payload.correctByQuestion,
    hintsUsed: payload.hintsUsed,
    timeTaken: payload.timeTaken,
    questionsMeta: payload.questionsMeta,
  };
}

/** Append a submission snapshot (newest first), capped for localStorage size. */
export function recordQuizSubmission(
  state: LearnerState,
  entry: QuizSubmissionRecord
): LearnerState {
  return {
    ...state,
    submissionHistory: [entry, ...state.submissionHistory].slice(
      0,
      SUBMISSION_HISTORY_CAP
    ),
  };
}

/** Weak on this quiz round for the concept (same bar as remedial score trigger). */
function recordConceptFailureForStuck(
  state: LearnerState,
  conceptId: ConceptId,
  adjustedPercent: number
): LearnerState {
  if (adjustedPercent >= THRESHOLD_WEAK) return state;
  const prev = state.conceptStuck[conceptId];
  const failedAttempts = prev.failedAttempts + 1;
  const isStuck = prev.isStuck || failedAttempts >= 2;
  return {
    ...state,
    conceptStuck: {
      ...state.conceptStuck,
      [conceptId]: {
        failedAttempts,
        isStuck,
      },
    },
    isRemediating: isStuck ? true : state.isRemediating,
  };
}

/** Clears stuck flag (and failure count) after a successful in-lesson remedial check. */
export function clearConceptStuck(
  state: LearnerState,
  conceptId: ConceptId
): LearnerState {
  const conceptStuck = {
    ...state.conceptStuck,
    [conceptId]: { failedAttempts: 0, isStuck: false },
  };
  return {
    ...state,
    conceptStuck,
    isRemediating: anyConceptStuck(conceptStuck),
  };
}

function mergeRemedialConcepts(
  state: LearnerState,
  concepts: ConceptId[]
): LearnerState {
  if (concepts.length === 0) return state;
  const set = new Set(state.remedialConcepts);
  for (const c of concepts) set.add(c);
  return { ...state, remedialConcepts: [...set] };
}

/**
 * Apply per-concept raw scores with hint penalty into mastery + attempts; flag remedial concepts.
 * Remedial if any question in that concept hit all hint levels, or adjusted score is below weak threshold.
 * When `telemetry` is provided, attempts store hints/time for that concept and full-quiz duration.
 */
export function applyQuizResults(
  state: LearnerState,
  quizId: string,
  rawByConcept: Map<ConceptId, number>,
  hintsByConcept: Map<ConceptId, HintsAggregate>,
  telemetry?: QuizTelemetryMeta
): LearnerState {
  const timeByConcept = telemetry
    ? aggregateTimeByConcept(telemetry.timeTaken.perQuestionMs, telemetry.questionsMeta)
    : null;

  let next = state;
  const newlyRemedial: ConceptId[] = [];
  for (const [conceptId, raw] of rawByConcept) {
    const agg = hintsByConcept.get(conceptId) ?? { sum: 0, max: 0 };
    const adjusted = scorePercentAfterHints(raw, agg.sum);
    const trace =
      telemetry != null
        ? {
            hintsUsedForConcept: agg.sum,
            timeMsForConcept: timeByConcept?.get(conceptId) ?? 0,
            quizTotalMs: telemetry.timeTaken.totalMs,
            hintsUsedByQuestion: telemetry.hintsUsed,
          }
        : undefined;
    next = recordConceptFailureForStuck(next, conceptId, adjusted);
    next = recordAttempt(next, quizId, conceptId, adjusted, trace);
    if (
      agg.max >= REMEDIAL_ALL_HINTS_LEVEL ||
      adjusted < THRESHOLD_WEAK
    ) {
      newlyRemedial.push(conceptId);
    }
  }
  return mergeRemedialConcepts(next, newlyRemedial);
}

/** Concepts currently marked for remedial practice (persisted). */
export function getRemedialConcepts(state: LearnerState): ConceptId[] {
  return state.remedialConcepts;
}

/**
 * After a scored activity, blend prior mastery with new score.
 * alpha higher => faster reaction to latest performance.
 */
export function updateMastery(
  prev: MasteryMap,
  conceptId: ConceptId,
  scorePercent: number,
  alpha = 0.35
): MasteryMap {
  const prior = prev[conceptId] ?? 0;
  const blended = prior * (1 - alpha) + scorePercent * alpha;
  return { ...prev, [conceptId]: Math.min(100, Math.round(blended)) };
}

export function recordAttempt(
  state: LearnerState,
  quizId: string,
  conceptId: ConceptId,
  scorePercent: number,
  trace?: Pick<
    AttemptRecord,
    | "hintsUsedForConcept"
    | "timeMsForConcept"
    | "quizTotalMs"
    | "hintsUsedByQuestion"
    >
): LearnerState {
  const attempt: AttemptRecord = {
    at: new Date().toISOString(),
    quizId,
    scorePercent,
    conceptId,
    ...(trace ?? {}),
  };
  return {
    ...state,
    mastery: updateMastery(state.mastery, conceptId, scorePercent),
    attempts: [attempt, ...state.attempts].slice(0, 80),
  };
}

export function markLessonComplete(state: LearnerState, slug: string): LearnerState {
  if (state.completedLessons.includes(slug)) return state;
  return { ...state, completedLessons: [...state.completedLessons, slug] };
}

export function recordUnitAssessment(
  state: LearnerState,
  scorePercent: number
): LearnerState {
  const best =
    state.unitAssessmentBest == null
      ? scorePercent
      : Math.max(state.unitAssessmentBest, scorePercent);
  return { ...state, unitAssessmentBest: best };
}

export type Recommendation =
  | {
      kind: "review_prerequisite";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "remedial_practice";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "stretch";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "proceed";
      message: string;
      nextConcept: ConceptId | null;
      reason: string;
    };

/**
 * Rule-based adaptation: uses prerequisite mastery and weakest concept.
 * Pedagogical intent: block rushing ahead when foundations are weak;
 * suggest enrichment when consistently strong.
 */
export function getRecommendations(state: LearnerState): Recommendation[] {
  const { mastery } = state;
  const out: Recommendation[] = [];

  for (const c of CONCEPT_ORDER) {
    const p = PREREQ[c];
    if (p != null && mastery[p] < THRESHOLD_WEAK && mastery[c] < 70) {
      out.push({
        kind: "review_prerequisite",
        message: `Strengthen ${label(p)} before pushing deep into ${label(c)}.`,
        targetConcept: p,
        reason: `${label(p)} mastery is ${mastery[p]}% (below ${THRESHOLD_WEAK}%).`,
      });
    }
  }

  let weakest: ConceptId = "intro";
  for (const c of CONCEPT_ORDER) {
    if (mastery[c] < mastery[weakest]) weakest = c;
  }
  if (mastery[weakest] < THRESHOLD_WEAK && mastery[weakest] > 0) {
    out.push({
      kind: "remedial_practice",
      message: `Focus extra practice on ${label(weakest)}.`,
      targetConcept: weakest,
      reason: `Lowest tracked mastery is ${mastery[weakest]}% in ${label(weakest)}.`,
    });
  }

  const last = CONCEPT_ORDER[CONCEPT_ORDER.length - 1];
  if (mastery[last] >= THRESHOLD_STRONG) {
    out.push({
      kind: "stretch",
      message:
        "Try extension problems: explain why GCF × LCM = product for two numbers, or explore prime gaps.",
      targetConcept: last,
      reason: "Strong performance on applications—time for generalization tasks.",
    });
  }

  const next = CONCEPT_ORDER.find((c) => mastery[c] < 75) ?? null;
  out.push({
    kind: "proceed",
    message: next
      ? `Suggested next emphasis: ${label(next)}.`
      : "Chapter objectives look secure—take the unit check or revisit any lesson.",
    nextConcept: next,
    reason: "Based on mastery profile and prerequisite chain.",
  });

  return out;
}

function label(c: ConceptId): string {
  switch (c) {
    case "intro":
      return "Factors & meaning";
    case "factor_pairs":
      return "Factor pairs";
    case "prime_composite":
      return "Prime & composite";
    case "prime_factorization":
      return "Prime factorization";
    case "gcf_lcm":
      return "GCF & LCM";
    case "applications":
      return "Applications";
    default:
      return c;
  }
}

export function conceptSlugMap(): Record<ConceptId, string> {
  return {
    intro: "ways-to-think-about-factors",
    factor_pairs: "factor-pairs-systematically",
    prime_composite: "prime-and-composite",
    prime_factorization: "prime-factorization",
    gcf_lcm: "gcf-and-lcm",
    applications: "using-structure-in-problems",
  };
}
