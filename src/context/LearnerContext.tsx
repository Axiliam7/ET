import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConceptId, QuizSubmitPayload, QuizTelemetryMeta } from "../types";
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

  const reset = useCallback(() => {
    setState(emptyLearnerState());
  }, []);

  const completeLesson = useCallback((slug: string) => {
    setState((s) => markLessonComplete(s, slug));
  }, []);

  const submitLessonQuiz = useCallback(
    (lessonKey: string, payload: QuizSubmitPayload) => {
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
