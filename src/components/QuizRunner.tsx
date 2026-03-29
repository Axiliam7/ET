import { useMemo, useRef, useState } from "react";
import type {
  ConceptId,
  HintsAggregate,
  QuizQuestion,
  QuizQuestionPool,
  QuizQuestionSource,
  QuizSubmitPayload,
} from "../types";

function scoresByConceptFromQuestions(
  questions: QuizQuestion[],
  correctIds: Set<string>
): Map<ConceptId, number> {
  const map = new Map<ConceptId, { ok: number; total: number }>();
  for (const q of questions) {
    const cur = map.get(q.conceptId) ?? { ok: 0, total: 0 };
    cur.total += 1;
    if (correctIds.has(q.id)) cur.ok += 1;
    map.set(q.conceptId, cur);
  }
  const out = new Map<ConceptId, number>();
  for (const [c, v] of map) {
    out.set(c, v.total === 0 ? 0 : Math.round((100 * v.ok) / v.total));
  }
  return out;
}

function correctByQuestionFromSelections(
  questions: QuizQuestion[],
  selections: Record<string, string>
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const q of questions) {
    out[q.id] = selections[q.id] === q.correctOptionId;
  }
  return out;
}

function hintsUsedByQuestion(
  questions: QuizQuestion[],
  hintTier: Record<string, number>
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const q of questions) {
    out[q.id] = hintTier[q.id] ?? 0;
  }
  return out;
}

function hintsAggregateByConcept(
  questions: QuizQuestion[],
  hintTier: Record<string, number>
): Map<ConceptId, HintsAggregate> {
  const map = new Map<ConceptId, HintsAggregate>();
  for (const q of questions) {
    const h = hintTier[q.id] ?? 0;
    const cur = map.get(q.conceptId) ?? { sum: 0, max: 0 };
    cur.sum += h;
    cur.max = Math.max(cur.max, h);
    map.set(q.conceptId, cur);
  }
  return map;
}

function isPool(src: QuizQuestionSource): src is QuizQuestionPool {
  return !Array.isArray(src) && Array.isArray(src.pool);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function materializeQuestions(src: QuizQuestionSource, seed: number): QuizQuestion[] {
  if (Array.isArray(src)) return src;
  if (!isPool(src)) return [];
  const pool = src.pool;
  const pick = Math.max(0, Math.min(src.pick ?? pool.length, pool.length));
  if (pick === pool.length) return pool;
  const shuffle = src.shuffle ?? true;
  if (!shuffle) return pool.slice(0, pick);

  const rng = mulberry32(seed);
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, pick).map((i) => pool[i]);
}

function finalizeQuizTiming(
  quizStartedAt: number,
  lastSlice: { t: number; q: string | null },
  perQuestionMs: Record<string, number>,
  questions: QuizQuestion[]
): { totalMs: number; perQuestionMs: Record<string, number> } {
  const perAcc = { ...perQuestionMs };
  const now = performance.now();
  const prevQ = lastSlice.q;
  const dt = now - lastSlice.t;
  if (prevQ != null && dt > 0) {
    perAcc[prevQ] = (perAcc[prevQ] ?? 0) + dt;
  }

  const perQuestion: Record<string, number> = {};
  let sum = 0;
  for (const q of questions) {
    const v = Math.round(perAcc[q.id] ?? 0);
    perQuestion[q.id] = v;
    sum += v;
  }

  const totalMs = Math.round(now - quizStartedAt);
  const diff = totalMs - sum;
  if (diff !== 0 && questions.length > 0) {
    const target = prevQ ?? questions[0].id;
    perQuestion[target] = (perQuestion[target] ?? 0) + diff;
  }

  return { totalMs, perQuestionMs: perQuestion };
}

export function QuizRunner({
  questions,
  title,
  submitLabel,
  onSubmit,
  disabled,
}: {
  questions: QuizQuestionSource;
  title: string;
  submitLabel: string;
  onSubmit: (payload: QuizSubmitPayload) => void;
  disabled?: boolean;
}) {
  const seedRef = useRef<number>(
    (() => {
      try {
        const a = new Uint32Array(1);
        crypto.getRandomValues(a);
        return a[0]!;
      } catch {
        return Math.floor(Math.random() * 2 ** 32);
      }
    })()
  );

  const activeQuestions = useMemo(
    () => materializeQuestions(questions, seedRef.current),
    [questions]
  );

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  /** Per-question hint tier revealed: 0 = none, 1–3 = show that many levels */
  const [hintTier, setHintTier] = useState<Record<string, number>>({});
  /** Per-question correctness once the learner checks/locks it in. */
  const [correctness, setCorrectness] = useState<Record<string, boolean>>({});
  /** Which question is currently shown (one-at-a-time). */
  const [currentIdx, setCurrentIdx] = useState(0);

  /** Wall-clock start when this quiz instance is shown (mount). */
  const [quizStartedAt] = useState(() => performance.now());
  const lastSliceRef = useRef<{ t: number; q: string | null }>({
    t: quizStartedAt,
    q: null,
  });
  const perQuestionMsRef = useRef<Record<string, number>>({});

  const registerQuestionActivity = (questionId: string) => {
    const now = performance.now();
    const prevQ = lastSliceRef.current.q;
    const dt = now - lastSliceRef.current.t;
    if (prevQ != null && dt > 0) {
      const acc = perQuestionMsRef.current;
      acc[prevQ] = (acc[prevQ] ?? 0) + dt;
    } else if (prevQ == null && dt > 0) {
      const acc = perQuestionMsRef.current;
      acc[questionId] = (acc[questionId] ?? 0) + dt;
    }
    lastSliceRef.current = { t: now, q: questionId };
  };

  const correctIds = useMemo(() => {
    const s = new Set<string>();
    for (const q of activeQuestions) {
      if (selections[q.id] === q.correctOptionId) s.add(q.id);
    }
    return s;
  }, [activeQuestions, selections]);

  const overallPercent = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return Math.round((100 * correctIds.size) / activeQuestions.length);
  }, [activeQuestions.length, correctIds]);

  const currentQuestion = activeQuestions[currentIdx] ?? null;
  const currentId = currentQuestion?.id ?? null;
  const currentSel = currentId ? selections[currentId] : undefined;
  const currentChecked = currentId ? correctness[currentId] != null : false;
  const currentIsCorrect = currentId ? correctness[currentId] === true : false;
  const currentIsWrong = currentId ? correctness[currentId] === false : false;
  const currentHintTier = currentId ? (hintTier[currentId] ?? 0) : 0;

  const allAnswered = useMemo(() => {
    if (activeQuestions.length === 0) return false;
    return activeQuestions.every((q) => selections[q.id] != null);
  }, [activeQuestions, selections]);

  const allChecked = useMemo(() => {
    if (activeQuestions.length === 0) return false;
    return activeQuestions.every((q) => correctness[q.id] != null);
  }, [activeQuestions, correctness]);

  const lockInCurrentIfPossible = () => {
    if (!currentQuestion) return;
    if (disabled || submitted) return;
    const qid = currentQuestion.id;
    if (correctness[qid] != null) return;
    const sel = selections[qid];
    if (sel == null) return;
    setCorrectness((prev) => ({ ...prev, [qid]: sel === currentQuestion.correctOptionId }));
    registerQuestionActivity(qid);
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;
    setSubmitted(true);
    const timing = finalizeQuizTiming(
      quizStartedAt,
      lastSliceRef.current,
      perQuestionMsRef.current,
      activeQuestions
    );
    onSubmit({
      overallPercent,
      byConcept: scoresByConceptFromQuestions(activeQuestions, correctIds),
      correctByQuestion: correctByQuestionFromSelections(activeQuestions, selections),
      hintsUsed: hintsUsedByQuestion(activeQuestions, hintTier),
      hintsByConcept: hintsAggregateByConcept(activeQuestions, hintTier),
      timeTaken: timing,
      questionsMeta: activeQuestions.map((q) => ({ id: q.id, conceptId: q.conceptId })),
    });
  };

  return (
    <section className="card" aria-labelledby="quiz-title">
      <h2 id="quiz-title">{title}</h2>
      {currentQuestion ? (
        <div className="quiz-q">
          <p className="pill" style={{ marginTop: 0 }}>
            Question {currentIdx + 1} of {activeQuestions.length}
          </p>
          <p style={{ marginTop: "0.5rem" }}>{currentQuestion.prompt}</p>

          {!submitted && (
            <div className="quiz-hints" aria-live="polite">
              {currentHintTier >= 1 && (
                <p className="quiz-hint quiz-hint-1">
                  <span className="quiz-hint-label">Where to look:</span>{" "}
                  {currentQuestion.hints.pointing}
                </p>
              )}
              {currentHintTier >= 2 && (
                <p className="quiz-hint quiz-hint-2">
                  <span className="quiz-hint-label">How to think:</span>{" "}
                  {currentQuestion.hints.teaching}
                </p>
              )}
              {currentHintTier >= 3 && (
                <p className="quiz-hint quiz-hint-3">
                  <span className="quiz-hint-label">Big spoiler:</span>{" "}
                  {currentQuestion.hints.bottomOut}
                </p>
              )}

              {/* Hint requests are most useful after a wrong try. Keep it available
                 until the question is correct, and never show the rationale here. */}
              {currentHintTier < 3 && (!currentChecked || currentIsWrong) && (
                <button
                  type="button"
                  className="btn quiz-hint-btn"
                  disabled={disabled}
                  onClick={() => {
                    if (!currentId) return;
                    registerQuestionActivity(currentId);
                    setHintTier((prev) => ({
                      ...prev,
                      [currentId]: Math.min(3, (prev[currentId] ?? 0) + 1),
                    }));
                  }}
                >
                  {currentHintTier === 0 ? "Need a hint?" : "Need another hint?"}
                </button>
              )}
            </div>
          )}

          <div className="options" role="group" aria-label={`Question ${currentIdx + 1}`}>
            {currentQuestion.options.map((o) => {
              const isSel = currentSel === o.id;
              let cls = "option";
              if (isSel) cls += " selected";

              // Only mark right/wrong after the learner checks (or after final submit).
              // Only reveal correct answer AFTER full submission
              if (submitted) {
                if (o.id === currentQuestion.correctOptionId) cls += " correct";
                else if (isSel) cls += " incorrect";
              }
              // During attempt: only show user's wrong selection
              else if (currentChecked) {
                if (isSel && !currentIsCorrect) cls += " incorrect";
              }

              return (
                <button
                  key={o.id}
                  type="button"
                  className={cls}
                  disabled={submitted || disabled}
                  onClick={() => {
                    if (!currentId) return;
                    registerQuestionActivity(currentId);
                    setSelections((prev) => ({ ...prev, [currentId]: o.id }));
                    // Changing the answer re-opens the question for checking.
                    setCorrectness((prev) => {
                      if (prev[currentId] == null) return prev;
                      const { [currentId]: _, ...rest } = prev;
                      return rest;
                    });
                  }}
                >
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>

          {!submitted && (
            <div className="btn-row" style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={disabled || currentSel == null || currentChecked}
                onClick={lockInCurrentIfPossible}
              >
                Check answer
              </button>
              {currentChecked && (
                <span className="pill" style={{ color: currentIsCorrect ? "var(--success)" : "var(--warn)" }}>
                  {currentIsCorrect ? "Nice! That’s correct." : "Not quite—try a hint and try again."}
                </span>
              )}
            </div>
          )}

          {submitted && (
            <div className="feedback ok" style={{ marginTop: "0.75rem" }}>
              {currentQuestion.rationale}
            </div>
          )}
        </div>
      ) : (
        <p className="reading">No questions.</p>
      )}

      <div className="btn-row">
        {!submitted ? (
          <>
            <button
              type="button"
              className="btn"
              disabled={disabled || currentIdx === 0}
              onClick={() => {
                // Auto-check before leaving if an answer was picked.
                lockInCurrentIfPossible();
                const next = Math.max(0, currentIdx - 1);
                const nextQ = activeQuestions[next];
                if (nextQ) registerQuestionActivity(nextQ.id);
                setCurrentIdx(next);
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn"
              disabled={
                disabled || currentIdx >= activeQuestions.length - 1 || currentSel == null
              }
              onClick={() => {
                lockInCurrentIfPossible();
                const next = Math.min(activeQuestions.length - 1, currentIdx + 1);
                const nextQ = activeQuestions[next];
                if (nextQ) registerQuestionActivity(nextQ.id);
                setCurrentIdx(next);
              }}
            >
              Next
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={disabled || !allAnswered || !allChecked}
              onClick={handleSubmit}
            >
              {submitLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn"
              disabled={currentIdx >= activeQuestions.length - 1}
              onClick={() =>
                setCurrentIdx((i) => Math.min(activeQuestions.length - 1, i + 1))
              }
            >
              Next
            </button>
            <p className="pill">
              Score: {overallPercent}% ({correctIds.size}/{activeQuestions.length}{" "}
              correct)
            </p>
          </>
        )}
      </div>
    </section>
  );
}
