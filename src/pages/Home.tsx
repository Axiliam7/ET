import { Link } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { useLearner } from "../context/LearnerContext";

export function Home() {
  const { state, reset } = useLearner();
  const { meta, lessons } = primeTimeChapter;
  const firstLesson = lessons[0];

  const nextLesson =
    lessons.find((l) => !state.completedLessons.includes(l.slug)) ?? null;
  const continueLesson = nextLesson ?? (state.completedLessons.length > 0 ? lessons[lessons.length - 1] : null);
  const canContinue = continueLesson != null && state.completedLessons.length > 0;

  return (
    <>
      <h1 className="page-title">{meta.title}</h1>
      <p className="lead">Short lessons. Quick practice. Friendly help.</p>

      <div className="card">
        <h2>Start</h2>
        <p className="reading" style={{ marginTop: "-0.25rem" }}>
          Ready to learn? Tap the big button.
        </p>
        <div className="btn-row">
          <Link
            className="btn btn-primary"
            style={{ fontSize: "1.1rem", padding: "0.85rem 1.25rem" }}
            to={`/lesson/${firstLesson.slug}`}
          >
            Start Learning
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Continue where you left off</h2>
        {canContinue ? (
          <>
            <p className="reading" style={{ marginTop: "-0.25rem" }}>
              Jump back in with your next lesson.
            </p>
            <div className="btn-row">
              <Link
                className="btn"
                style={{ fontSize: "1.05rem", padding: "0.75rem 1.1rem" }}
                to={`/lesson/${continueLesson!.slug}`}
              >
                Continue: {continueLesson!.shortTitle}
              </Link>
            </div>
          </>
        ) : (
          <p className="reading" style={{ marginTop: "-0.25rem" }}>
            No saved spot yet. Start learning and I’ll remember your place on this device.
          </p>
        )}
      </div>

      <div className="card">
        <h2>Progress</h2>
        <p className="reading" style={{ marginTop: "-0.25rem" }}>
          See what you’ve finished and what to try next.
        </p>
        <div className="btn-row">
          <Link className="btn" style={{ fontSize: "1.05rem", padding: "0.75rem 1.1rem" }} to="/progress">
            View Progress
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Final challenge</h2>
        <p className="reading" style={{ marginTop: "-0.25rem" }}>
          Ready for a bigger challenge? Try the chapter check.
        </p>
        <div className="btn-row">
          <Link
            className="btn btn-primary"
            style={{ fontSize: "1.05rem", padding: "0.75rem 1.1rem" }}
            to="/assessment"
          >
            Take Final Challenge
          </Link>
          <button type="button" className="btn" onClick={reset}>
            Reset saved progress
          </button>
        </div>
      </div>
    </>
  );
}
