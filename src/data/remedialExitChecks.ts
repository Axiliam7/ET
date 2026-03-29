import type { ConceptId } from "../types";

/** One low-stakes MC item to exit remedial reading mode for a concept. */
export interface RemedialExitCheck {
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
}

export const remedialExitCheckByConcept: Record<ConceptId, RemedialExitCheck> = {
  intro: {
    prompt: "Which idea best fits the word factor in this chapter?",
    options: [
      { id: "a", label: "A whole number that divides another evenly, with no remainder" },
      { id: "b", label: "A number you always get by adding two others" },
      { id: "c", label: "Any number that shows up first in a word problem" },
    ],
    correctOptionId: "a",
  },
  factor_pairs: {
    prompt: "Which pair is a factor pair of 20?",
    options: [
      { id: "a", label: "4 and 5 (because 4 × 5 = 20)" },
      { id: "b", label: "4 and 6 (because they are close to 20)" },
      { id: "c", label: "10 and 10 (because 10 + 10 = 20)" },
    ],
    correctOptionId: "a",
  },
  prime_composite: {
    prompt: "Which number is prime?",
    options: [
      { id: "a", label: "9" },
      { id: "b", label: "11" },
      { id: "c", label: "1" },
    ],
    correctOptionId: "b",
  },
  prime_factorization: {
    prompt: "Which expression uses only prime numbers multiplied together for 30?",
    options: [
      { id: "a", label: "6 × 5" },
      { id: "b", label: "2 × 3 × 5" },
      { id: "c", label: "10 × 3" },
    ],
    correctOptionId: "b",
  },
  gcf_lcm: {
    prompt: "You want the biggest whole number that divides both 12 and 18 evenly. What are you finding?",
    options: [
      { id: "a", label: "The GCF" },
      { id: "b", label: "The LCM" },
      { id: "c", label: "The sum 12 + 18" },
    ],
    correctOptionId: "a",
  },
  applications: {
    prompt: "Bus A comes every 12 minutes and Bus B every 18 minutes. They just left together. What do you need for the next together time?",
    options: [
      { id: "a", label: "The GCF of 12 and 18" },
      { id: "b", label: "The LCM of 12 and 18" },
      { id: "c", label: "12 + 18 minutes" },
    ],
    correctOptionId: "b",
  },
};
