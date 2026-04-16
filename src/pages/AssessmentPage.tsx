import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { useLearner } from "../context/LearnerContext";
import { QuizRunner } from "../components/QuizRunner";
import {
  confirmReturnToDashboard,
  submitSession,
  type SubmitSessionResult,
} from "../utils/sessionTracking";

export function AssessmentPage() {
  const { submitUnitAssessment, state } = useLearner();
  const { unitAssessment } = primeTimeChapter;
  const [sessionSubmit, setSessionSubmit] = useState<SubmitSessionResult | null>(null);
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);

  const recommendationText = useMemo(() => {
    const data = sessionSubmit?.responseData;
    if (typeof data === "string" && data.trim()) return data.trim();
    if (data && typeof data === "object") {
      const rec = (data as { recommendation?: unknown }).recommendation;
      if (typeof rec === "string" && rec.trim()) return rec.trim();
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) return msg.trim();
      return JSON.stringify(data, null, 2);
    }
    return null;
  }, [sessionSubmit]);

  return (
    <>
      <h1 className="page-title">{unitAssessment.title}</h1>
      <p className="lead">
        Six questions sample the full chapter. Your answers update each concept’s
        mastery and record a best unit score.
        {state.unitAssessmentBest != null && (
          <>
            {" "}
            Your best so far: <strong>{state.unitAssessmentBest}%</strong>.
          </>
        )}
      </p>

      <QuizRunner
        title="Questions"
        submitLabel="Submit unit check"
        questions={unitAssessment.questions}
        onSubmit={async (payload) => {
          submitUnitAssessment(payload);
          setIsSubmittingSession(true);
          try {
            const result = await submitSession("completed");
            setSessionSubmit(result);
          } finally {
            setIsSubmittingSession(false);
          }
        }}
      />

      {isSubmittingSession && (
        <div className="card">
          <p className="lead" style={{ marginBottom: 0 }}>
            Submitting your chapter session...
          </p>
        </div>
      )}

      {!isSubmittingSession && sessionSubmit?.ok && recommendationText && (
        <div className="card">
          <h2>Recommendation</h2>
          {recommendationText.startsWith("{") ? (
            <pre className="reading" style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
              {recommendationText}
            </pre>
          ) : (
            <p className="reading" style={{ marginBottom: 0 }}>
              {recommendationText}
            </p>
          )}
        </div>
      )}

      {!isSubmittingSession && sessionSubmit && !sessionSubmit.ok && (
        <div className="card" style={{ borderColor: "var(--warn)" }}>
          <p className="lead" style={{ marginBottom: 0 }}>
            We could not confirm the final submission right now. You can still return to the
            dashboard.
          </p>
        </div>
      )}

      <div className="btn-row">
        <Link className="btn btn-primary" to="/progress">
          Review recommendations
        </Link>
        <Link className="btn" to="/">
          Home
        </Link>
        <button type="button" className="btn" onClick={() => void confirmReturnToDashboard()}>
          Return to Dashboard
        </button>
      </div>
    </>
  );
}
