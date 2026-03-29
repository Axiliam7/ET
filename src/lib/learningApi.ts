import type { QuizSubmissionRecord } from "./learnerModel";

/** Placeholder backend for learning analytics (replace with your API). */
export const LEARNING_EVENTS_API_URL =
  "https://example.com/api/learning-events";

/** Flat row per question for JSON POST bodies. */
export type LearningEventQuestionRow = {
  question_id: string;
  concept_id: string;
  correct: boolean;
  hints_used: number;
  time_ms: number;
};

/** Normalized payload for POST (snake_case, no Maps). */
export type LearningEventPayload = {
  submitted_at: string;
  quiz_id: string;
  overall_percent: number;
  totals: {
    total_ms: number;
  };
  per_question: LearningEventQuestionRow[];
};

/**
 * Shape a submission record into a plain JSON-serializable object for the API.
 */
export function formatSubmissionForApi(
  record: QuizSubmissionRecord
): LearningEventPayload {
  const per_question: LearningEventQuestionRow[] = record.questionsMeta.map(
    (q) => ({
      question_id: q.id,
      concept_id: q.conceptId,
      correct: record.correctByQuestion[q.id] ?? false,
      hints_used: record.hintsUsed[q.id] ?? 0,
      time_ms: record.timeTaken.perQuestionMs[q.id] ?? 0,
    })
  );

  return {
    submitted_at: record.at,
    quiz_id: record.quizId,
    overall_percent: record.overallPercent,
    totals: {
      total_ms: record.timeTaken.totalMs,
    },
    per_question,
  };
}

/**
 * POST formatted submission data to the configured endpoint.
 * Network failures are logged only; local state is unaffected.
 */
export async function sendToAPI(record: QuizSubmissionRecord): Promise<Response> {
  const body = formatSubmissionForApi(record);
  const res = await fetch(LEARNING_EVENTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.warn(
      "[learningApi] sendToAPI non-OK response",
      res.status,
      res.statusText
    );
  }
  return res;
}
