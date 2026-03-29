import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { remedialExitCheckByConcept } from "../data/remedialExitChecks";
import { useLearner } from "../context/LearnerContext";
import { QuizRunner } from "../components/QuizRunner";
import { PrimeBot } from "../components/PrimeBot";
import type { LessonSection } from "../types";

function SectionContent({
  section,
  useRemedial,
}: {
  section: LessonSection;
  useRemedial: boolean;
}) {
  const remedial = section.remedialBody;
  const showRemedial = useRemedial && remedial != null;
  const [showPracticeHint, setShowPracticeHint] = useState(false);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  useEffect(() => {
    setShowPracticeHint(false);
    setShowPracticeSolution(false);
  }, [section.id, showRemedial]);

  if (showRemedial) {
    const { alternativeExplanation, erroneousExample, practice } = remedial!;
    return (
      <div className="reading">
        {alternativeExplanation.map((p, i) => (
          <p key={`a-${i}`}>{p}</p>
        ))}
        {erroneousExample != null && erroneousExample.length > 0 && (
          <div className="erroneous-example-block" role="note">
            <h3 className="erroneous-example-heading">Erroneous Example</h3>
            <p className="erroneous-example-prompt">
              Someone worked this out below, but their reasoning has a mistake. Read it like a detective—can you
              spot what went wrong?
            </p>
            {erroneousExample.map((p, i) => (
              <p key={`e-${i}`} style={{ margin: i === 0 ? "0 0 0.5rem" : "0.65rem 0 0" }}>
                {p}
              </p>
            ))}
          </div>
        )}
        {practice != null && (
          <div style={{ marginTop: "1.15rem" }}>
            <p>
              <strong>Quick try.</strong> {practice.prompt}
            </p>
            <div className="scaffold-actions btn-row" style={{ marginTop: "0.5rem" }}>
              <button
                type="button"
                className="btn quiz-hint-btn"
                disabled={showPracticeHint}
                onClick={() => setShowPracticeHint(true)}
              >
                Show hint
              </button>
              <button
                type="button"
                className="btn quiz-hint-btn"
                disabled={showPracticeSolution}
                onClick={() => setShowPracticeSolution(true)}
              >
                Show solution
              </button>
            </div>
            {showPracticeHint && (
              <div className="scaffold-block scaffold-hint">
                <span className="scaffold-label">Hint</span>
                {practice.hint}
              </div>
            )}
            {showPracticeSolution && (
              <div className="scaffold-block scaffold-solution">
                <span className="scaffold-label">Solution</span>
                {practice.solution}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="reading">
      {section.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function GuidedPracticeItem({
  prompt,
  hint,
  solution,
}: {
  prompt: string;
  hint: string;
  solution: string;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="guided-practice-item">
      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Try this.</strong> {prompt}
      </p>
      <div className="scaffold-actions btn-row">
        <button type="button" className="btn quiz-hint-btn" disabled={showHint} onClick={() => setShowHint(true)}>
          Show hint
        </button>
        <button
          type="button"
          className="btn quiz-hint-btn"
          disabled={showSolution}
          onClick={() => setShowSolution(true)}
        >
          Show solution
        </button>
      </div>
      {showHint && (
        <div className="scaffold-block scaffold-hint">
          <span className="scaffold-label">Hint</span>
          {hint}
        </div>
      )}
      {showSolution && (
        <div className="scaffold-block scaffold-solution">
          <span className="scaffold-label">Solution</span>
          {solution}
        </div>
      )}
    </div>
  );
}

export function LessonPage() {
  const { slug } = useParams();
  const { completeLesson, submitLessonQuiz, clearStuckForConcept, state } = useLearner();

  const lesson = useMemo(() => primeTimeChapter.lessons.find((l) => l.slug === slug), [slug]);

  if (!lesson) {
    return (
      <p>
        Lesson not found. <Link to="/">Home</Link>
      </p>
    );
  }

  const done = state.completedLessons.includes(lesson.slug);
  const topicProgress = state.mastery[lesson.conceptId];
  const isStuck = state.conceptStuck[lesson.conceptId]?.isStuck ?? false;
  const [preferExtraHelpReading, setPreferExtraHelpReading] = useState(isStuck);
  const [exitCheckWrong, setExitCheckWrong] = useState(false);

  useEffect(() => {
    setPreferExtraHelpReading(isStuck);
  }, [lesson.slug, isStuck]);

  useEffect(() => {
    setExitCheckWrong(false);
  }, [lesson.slug, preferExtraHelpReading]);

  const useRemedialReading = isStuck && preferExtraHelpReading;
  const exitCheck = remedialExitCheckByConcept[lesson.conceptId];

  return (
    <>
      <p className="pill">
        Lesson {lesson.order} of {primeTimeChapter.lessons.length} · <Link to="/">Chapter home</Link>
      </p>
      <h1 className="page-title">{lesson.title}</h1>
      <p className="lead">
        Big idea for this lesson: <strong>{lesson.conceptId.replace(/_/g, " ")}</strong> · How you’re doing here:{" "}
        <strong>{topicProgress}%</strong>
      </p>

      <div className="objectives">
        <strong>Learning objectives</strong>
        <ul>
          {lesson.learningObjectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      {lesson.vocabulary.length > 0 && (
        <div className="card">
          <h2>Key vocabulary</h2>
          <dl className="vocab">
            {lesson.vocabulary.map((v) => (
              <div key={v.term}>
                <dt>{v.term}</dt>
                <dd>{v.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {isStuck && (
        <PrimeBot>
          <p>
            Hi! I’m PrimeBot. This topic felt extra tricky for you—and that happens to everyone.{" "}
            <strong>Extra Help Mode</strong> below uses a different explanation and a tiny check at the end. You can
            switch back to the regular lesson anytime.
          </p>
        </PrimeBot>
      )}

      {isStuck && (
        <div className="btn-row" style={{ flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
          <span className="extra-help-banner">Extra Help Mode</span>
          <button
            type="button"
            className="btn btn-primary"
            disabled={preferExtraHelpReading}
            onClick={() => setPreferExtraHelpReading(true)}
          >
            Turn on Extra Help
          </button>
          <button
            type="button"
            className="btn"
            disabled={!preferExtraHelpReading}
            onClick={() => setPreferExtraHelpReading(false)}
          >
            Back to regular lesson
          </button>
        </div>
      )}

      {lesson.sections.map((s) => (
        <div key={s.id} className="card">
          <h2>{s.title}</h2>
          <SectionContent section={s} useRemedial={useRemedialReading && s.remedialBody != null} />
        </div>
      ))}

      {isStuck && useRemedialReading && (
        <div className="card">
          <h2>Quick check</h2>
          <p className="lead" style={{ fontSize: "1rem", marginTop: 0 }}>
            {exitCheck.prompt}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.5rem",
            }}
          >
            {exitCheck.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="btn"
                onClick={() => {
                  if (opt.id === exitCheck.correctOptionId) {
                    clearStuckForConcept(lesson.conceptId);
                    setPreferExtraHelpReading(false);
                    setExitCheckWrong(false);
                  } else {
                    setExitCheckWrong(true);
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {exitCheckWrong && (
            <p style={{ color: "var(--warn)", marginTop: "0.75rem", marginBottom: 0 }}>
              Not quite—try another answer, or reread a section above. You’ve got this.
            </p>
          )}
        </div>
      )}

      <div className="card">
        <h2>Guided practice</h2>
        {lesson.guidedPractice.map((g, i) => (
          <GuidedPracticeItem key={i} prompt={g.prompt} hint={g.hint} solution={g.solution} />
        ))}
      </div>

      <PrimeBot>
        <p>
          Ready for the checkpoint? Answer from what you know first—then use hints if you need a nudge. Each hint
          is a little more of a spoiler, so try your own idea first when you can.
        </p>
      </PrimeBot>

      <QuizRunner
        title="Checkpoint quiz"
        submitLabel="Submit checkpoint"
        questions={lesson.quiz}
        onSubmit={(payload) => {
          submitLessonQuiz(lesson.id, payload);
          completeLesson(lesson.slug);
        }}
      />

      <div className="btn-row">
        {done && <span className="pill">Lesson marked complete after your last quiz submit</span>}
        {primeTimeChapter.lessons.some((l) => l.order === lesson.order + 1) ? (
          <Link
            className="btn btn-primary"
            to={`/lesson/${primeTimeChapter.lessons.find((l) => l.order === lesson.order + 1)!.slug}`}
          >
            Next lesson
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/assessment">
            Unit assessment
          </Link>
        )}
        <Link className="btn" to="/progress">
          Progress
        </Link>
      </div>
    </>
  );
}
