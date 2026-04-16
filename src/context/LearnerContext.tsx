import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConceptId, QuizQuestionSource, QuizSubmitPayload, QuizTelemetryMeta } from "../types";
import {
  applyQuizResults,
  buildQuizSubmissionRecord,
  clearConceptStuck,
  emptyLearnerState,
  loadLearnerState,
  markLessonComplete,
  recordQuizSubmission,
  recordUnitAssessment,
  saveLearnerState,
  type LearnerState,
} from "../lib/learnerModel";
import { sendToAPI } from "../lib/learningApi";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { recordSessionAttempt, updateSessionMetrics } from "../utils/sessionTracking";

function countQuestions(source: QuizQuestionSource): number {
  if (Array.isArray(source)) return source.length;
  const pick = source.pick ?? source.pool.length;
  return Math.max(0, Math.min(source.pool.length, pick));
}

const TOTAL_CHAPTER_QUESTIONS =
  primeTimeChapter.lessons.reduce((sum, lesson) => sum + countQuestions(lesson.quiz), 0) +
  countQuestions(primeTimeChapter.unitAssessment.questions);

const TOTAL_CHAPTER_UNITS = primeTimeChapter.lessons.length + 1;

interface Ctx {
  state: LearnerState;
  reset: () => void;
  completeLesson: (slug: string) => void;
  submitLessonQuiz: (lessonKey: string, payload: QuizSubmitPayload) => void;
  submitUnitAssessment: (payload: QuizSubmitPayload) => void;
  clearStuckForConcept: (conceptId: ConceptId) => void;
}

const LearnerContext = createContext<Ctx | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearnerState>(() => loadLearnerState());

  useEffect(() => {
    saveLearnerState(state);
  }, [state]);

  useEffect(() => {
    updateSessionMetrics({
      total_questions: TOTAL_CHAPTER_QUESTIONS,
      total_units: TOTAL_CHAPTER_UNITS,
      completed_units:
        state.completedLessons.length + (state.unitAssessmentBest != null ? 1 : 0),
    });
  }, [state.completedLessons.length, state.unitAssessmentBest]);

  const reset = useCallback(() => {
    setState(emptyLearnerState());
  }, []);

  const completeLesson = useCallback((slug: string) => {
    setState((s) => markLessonComplete(s, slug));
  }, []);

  const submitLessonQuiz = useCallback(
    (lessonKey: string, payload: QuizSubmitPayload) => {
      const attempted = Object.keys(payload.correctByQuestion).length;
      const correct = Object.values(payload.correctByQuestion).filter(Boolean).length;
      const wrong = Math.max(0, attempted - correct);
      const hintsUsed = Object.values(payload.hintsUsed).reduce(
        (sum, count) => sum + Math.max(0, count),
        0
      );
      const totalHintsEmbedded = attempted * 3;
      recordSessionAttempt({
        questions_attempted: attempted,
        correct_answers: correct,
        wrong_answers: wrong,
        hints_used: hintsUsed,
        total_hints_embedded: totalHintsEmbedded,
        retry_count: wrong,
      });

      const quizId = `lesson:${lessonKey}`;
      const submission = buildQuizSubmissionRecord(quizId, payload);
      const telemetry: QuizTelemetryMeta = {
        hintsUsed: payload.hintsUsed,
        timeTaken: payload.timeTaken,
        questionsMeta: payload.questionsMeta,
      };
      setState((s) => {
        let next = applyQuizResults(
          s,
          quizId,
          payload.byConcept,
          payload.hintsByConcept,
          telemetry
        );
        next = recordQuizSubmission(next, submission);
        return next;
      });
      void sendToAPI(submission).catch((err) =>
        console.warn("[learning] sendToAPI", err)
      );
    },
    []
  );

  const clearStuckForConcept = useCallback((conceptId: ConceptId) => {
    setState((s) => clearConceptStuck(s, conceptId));
  }, []);

  const submitUnitAssessment = useCallback((payload: QuizSubmitPayload) => {
    const attempted = Object.keys(payload.correctByQuestion).length;
    const correct = Object.values(payload.correctByQuestion).filter(Boolean).length;
    const wrong = Math.max(0, attempted - correct);
    const hintsUsed = Object.values(payload.hintsUsed).reduce(
      (sum, count) => sum + Math.max(0, count),
      0
    );
    const totalHintsEmbedded = attempted * 3;
    recordSessionAttempt({
      questions_attempted: attempted,
      correct_answers: correct,
      wrong_answers: wrong,
      hints_used: hintsUsed,
      total_hints_embedded: totalHintsEmbedded,
      retry_count: wrong,
    });

    const quizId = "unit-assessment";
    const submission = buildQuizSubmissionRecord(quizId, payload);
    const telemetry: QuizTelemetryMeta = {
      hintsUsed: payload.hintsUsed,
      timeTaken: payload.timeTaken,
      questionsMeta: payload.questionsMeta,
    };
    setState((s) => {
      let next = applyQuizResults(
        s,
        quizId,
        payload.byConcept,
        payload.hintsByConcept,
        telemetry
      );
      next = recordUnitAssessment(next, payload.overallPercent);
      next = recordQuizSubmission(next, submission);
      return next;
    });
    void sendToAPI(submission).catch((err) =>
      console.warn("[learning] sendToAPI", err)
    );
  }, []);

  const value = useMemo(
    () => ({
      state,
      reset,
      completeLesson,
      submitLessonQuiz,
      submitUnitAssessment,
      clearStuckForConcept,
    }),
    [
      state,
      reset,
      completeLesson,
      submitLessonQuiz,
      submitUnitAssessment,
      clearStuckForConcept,
    ]
  );

  return (
    <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>
  );
}

export function useLearner() {
  const v = useContext(LearnerContext);
  if (!v) throw new Error("useLearner requires LearnerProvider");
  return v;
}
