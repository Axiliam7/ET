import { Link } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { useLearner } from "../context/LearnerContext";
import { QuizRunner } from "../components/QuizRunner";

export function AssessmentPage() {
  const { submitUnitAssessment, state } = useLearner();
  const { unitAssessment } = primeTimeChapter;

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
        onSubmit={(payload) => {
          submitUnitAssessment(payload);
        }}
      />

      <div className="btn-row">
        <Link className="btn btn-primary" to="/progress">
          Review recommendations
        </Link>
        <Link className="btn" to="/">
          Home
        </Link>
      </div>
    </>
  );
}
