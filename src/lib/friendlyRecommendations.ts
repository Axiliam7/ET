import type { ConceptId } from "../types";
import type { Recommendation } from "./learnerModel";

const TOPIC: Record<ConceptId, string> = {
  intro: "factors and what they mean",
  factor_pairs: "factor pairs",
  prime_composite: "prime and composite numbers",
  prime_factorization: "prime factorization",
  gcf_lcm: "GCF and LCM",
  applications: "using GCF and LCM in problems",
};

/**
 * Tutor-style copy for the PrimeBot agent. Avoids technical learner-model terms.
 */
export function friendlyRecommendationCoachNote(r: Recommendation): string {
  switch (r.kind) {
    case "review_prerequisite":
      return `Let’s go back to ${TOPIC[r.targetConcept]} for a bit. When that feels solid, the next lesson goes way smoother—you’re not behind, you’re building a strong base.`;
    case "remedial_practice":
      return `The topic that needs the most practice right now is ${TOPIC[r.targetConcept]}. A second, slower pass is normal—and it really works.`;
    case "stretch":
      return `You’re doing great on the big ideas! Want something extra? ${r.message}`;
    case "proceed":
      return r.nextConcept
        ? `When you’re ready, head into ${TOPIC[r.nextConcept]}—that’s the next big step that matches where you are.`
        : "Nice! You’ve got a good grip on this chapter. Take the unit check when you feel sharp, or peek back at any lesson for a warm-up.";
    default:
      return "";
  }
}

export function friendlyRecommendationHeadline(r: Recommendation): string {
  switch (r.kind) {
    case "review_prerequisite":
      return "Quick review first";
    case "remedial_practice":
      return "Let’s strengthen one area";
    case "stretch":
      return "Ready for a stretch?";
    case "proceed":
      return "What to do next";
    default:
      return "Tip";
  }
}
