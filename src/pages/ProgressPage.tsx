import { Link } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import {
  conceptSlugMap,
  getRecommendations,
  getRemedialConcepts,
  type ConceptId,
} from "../lib/learnerModel";
import {
  friendlyRecommendationCoachNote,
  friendlyRecommendationHeadline,
} from "../lib/friendlyRecommendations";
import { PrimeBot } from "../components/PrimeBot";

function skillLevel(value: number): number {
  if (value >= 90) return 5;
  if (value >= 75) return 4;
  if (value >= 55) return 3;
  if (value >= 35) return 2;
  if (value > 0) return 1;
  return 0;
}

function MasteryBar({ label, value }: { label: string; value: number }) {
  const lvl = skillLevel(value);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>
          Skill Level: {lvl}/5
        </span>
      </div>
      <div className="meter" aria-hidden>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const LABELS: Record<ConceptId, string> = {
  intro: "Factors & meaning",
  factor_pairs: "Factor pairs",
  prime_composite: "Prime & composite",
  prime_factorization: "Prime factorization",
  gcf_lcm: "GCF & LCM",
  applications: "Applications",
};

export function ProgressPage() {
  const { state } = useLearner();
  const recs = getRecommendations(state);
  const slugFor = conceptSlugMap();
  const extraPractice = getRemedialConcepts(state);

  const primaryRec =
    recs.find((r) => r.kind === "review_prerequisite") ??
    recs.find((r) => r.kind === "remedial_practice") ??
    recs.find((r) => r.kind === "proceed") ??
    recs[0] ??
    null;

  const primaryAction =
    primaryRec && "targetConcept" in primaryRec && primaryRec.kind !== "stretch"
      ? { to: `/lesson/${slugFor[primaryRec.targetConcept]}`, label: "Continue Learning" }
      : primaryRec && primaryRec.kind === "proceed" && primaryRec.nextConcept
        ? { to: `/lesson/${slugFor[primaryRec.nextConcept]}`, label: "Continue Learning" }
        : { to: "/assessment", label: "Take Final Challenge" };

  const practiceAction =
    extraPractice.length > 0 ? `/lesson/${slugFor[extraPractice[0]]}` : primaryAction.to;

  return (
    <>
      <div className="card">
        <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>
          Progress
        </h1>
        <p className="lead" style={{ marginBottom: "0.75rem" }}>
          Your Skill Levels update after quizzes. Small steps count.
        </p>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <Link className="btn btn-primary" style={{ padding: "0.8rem 1.15rem", fontSize: "1.05rem" }} to={primaryAction.to}>
            {primaryAction.label}
          </Link>
          <Link className="btn" style={{ padding: "0.8rem 1.15rem", fontSize: "1.05rem" }} to={practiceAction}>
            Practice Weak Areas
          </Link>
          <Link className="btn" style={{ padding: "0.8rem 1.15rem", fontSize: "1.05rem" }} to="/assessment">
            Take Final Challenge
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Your Progress</h2>
        <PrimeBot>
          <p>
            These bars show how each topic is going. Level 5 means “I can do this!” Level 1 means “I’m still learning.”
          </p>
        </PrimeBot>
        <div style={{ display: "grid", gap: "1rem" }}>
          {(Object.keys(state.mastery) as ConceptId[]).map((id) => (
            <MasteryBar key={id} label={LABELS[id]} value={state.mastery[id]} />
          ))}
        </div>
      </div>

      <div className="card">
        <h2>What to do next</h2>
        {primaryRec ? (
          <>
            <PrimeBot>
              <p>
                <strong>{friendlyRecommendationHeadline(primaryRec)}</strong>
              </p>
              <p>{friendlyRecommendationCoachNote(primaryRec)}</p>
            </PrimeBot>
            <div className="btn-row">
              <Link
                className="btn btn-primary"
                style={{ padding: "0.85rem 1.2rem", fontSize: "1.05rem" }}
                to={primaryAction.to}
              >
                {primaryAction.label}
              </Link>
            </div>
          </>
        ) : (
          <p className="reading">Take a lesson quiz to get your next-step tip.</p>
        )}
      </div>

      {extraPractice.length > 0 && (
        <div className="card" style={{ borderColor: "var(--warn)" }}>
          <h2>Extra Practice</h2>
          <PrimeBot>
            <p>
              Let’s do a little extra practice here. This is a normal part of learning—practice makes the next lesson easier.
            </p>
          </PrimeBot>
          <ul className="reading" style={{ marginBottom: 0 }}>
            {extraPractice.map((c) => (
              <li key={c} style={{ marginBottom: "0.5rem" }}>
                <strong>{LABELS[c]}</strong>{" "}
                <Link className="btn" to={`/lesson/${slugFor[c]}`}>
                  Practice
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
