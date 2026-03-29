export type ConceptId =
  | "intro"
  | "factor_pairs"
  | "prime_composite"
  | "prime_factorization"
  | "gcf_lcm"
  | "applications";

export interface QuizOption {
  id: string;
  label: string;
}

/** Three-level hints: nudge → method → near-answer (quiz questions only). */
export interface QuizHints {
  /** Where to look in the lesson or what idea to grab */
  pointing: string;
  /** Name the method or step pattern */
  teaching: string;
  /** Strong spoiler; stops just short of stating the letter */
  bottomOut: string;
}

export interface QuizQuestion {
  id: string;
  conceptId: ConceptId;
  prompt: string;
  options: QuizOption[];
  hints: QuizHints;
  /** Correct option id */
  correctOptionId: string;
  /** Short rationale shown after answer */
  rationale: string;
}

/** Optional pool wrapper for quizzes/assessments (pick N from a pool). */
export interface QuizQuestionPool {
  /** Full pool of authored questions. */
  pool: QuizQuestion[];
  /** Number of questions to take from the pool (defaults to pool.length). */
  pick?: number;
  /** If true, pick is a stable shuffled subset per quiz instance. Defaults to true when pick < pool.length. */
  shuffle?: boolean;
}

/** Backward-compatible question source: old fixed list OR pooled questions. */
export type QuizQuestionSource = QuizQuestion[] | QuizQuestionPool;

/** Per-concept hint totals for one quiz submit (sum = penalty input; max = “used all hints” on any question). */
export type HintsAggregate = { sum: number; max: number };

/** Time on task: total quiz duration and ms attributed per question (via activity boundaries). */
export interface QuizTimeTaken {
  /** Wall time from quiz mount through submit (ms). */
  totalMs: number;
  /** Ms attributed to each question id (rounded; sums ≈ total when learner interacted). */
  perQuestionMs: Record<string, number>;
}

/** Payload from QuizRunner after submit; drives mastery (with hint penalty) and remedial flags. */
export interface QuizSubmitPayload {
  overallPercent: number;
  byConcept: Map<ConceptId, number>;
  /** Whether each question was answered correctly (by question id). */
  correctByQuestion: Record<string, boolean>;
  /** Hints revealed per question id (0 = none … 3 = all levels). */
  hintsUsed: Record<string, number>;
  hintsByConcept: Map<ConceptId, HintsAggregate>;
  timeTaken: QuizTimeTaken;
  /** Maps each question’s time/hints to concepts in the learner model. */
  questionsMeta: { id: string; conceptId: ConceptId }[];
}

/** Subset passed through to applyQuizResults (learner model telemetry). */
export type QuizTelemetryMeta = Pick<
  QuizSubmitPayload,
  "hintsUsed" | "timeTaken" | "questionsMeta"
>;

/** Optional remedial layer for a lesson section (alternate framing, misconception, micro-practice). */
export interface SectionRemedialBody {
  /** Alternative explanation as plain-text lines (same conventions as section body). */
  alternativeExplanation: string[];
  /** Optional walkthrough of a common wrong approach or pitfall. */
  erroneousExample?: string[];
  /** Optional low-stakes practice (same shape as guided practice items). */
  practice?: { prompt: string; hint: string; solution: string };
}

export interface LessonSection {
  id: string;
  title: string;
  /** Curated HTML-safe content: we use plain text + line breaks in paragraphs */
  body: string[];
  /** Alternate content for remediation; omit when not authored. */
  remedialBody?: SectionRemedialBody;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  conceptId: ConceptId;
  learningObjectives: string[];
  vocabulary: { term: string; definition: string }[];
  sections: LessonSection[];
  /** Inline practice (no scoring) */
  guidedPractice: { prompt: string; hint: string; solution: string }[];
  quiz: QuizQuestionSource;
}

export interface ChapterMeta {
  id: string;
  title: string;
  grade: string;
  unit: string;
  description: string;
}

export interface UnitAssessment {
  id: string;
  title: string;
  questions: QuizQuestionSource;
}

export interface Chapter {
  meta: ChapterMeta;
  lessons: Lesson[];
  unitAssessment: UnitAssessment;
}
