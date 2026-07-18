import { useState } from 'react';
import { QUIZ_QUESTIONS, QUIZ_RESULTS, type ProductId } from './data';

type Scores = Record<ProductId, number>;

const emptyScores = (): Scores => ({
  original: 0,
  cherry: 0,
  'cream-soda': 0,
  'zero-sugar': 0,
});

function winnerFrom(scores: Scores): ProductId {
  let best: ProductId = 'original';
  let bestScore = -1;
  (Object.keys(scores) as ProductId[]).forEach((id) => {
    if (scores[id] > bestScore) {
      bestScore = scores[id];
      best = id;
    }
  });
  return best;
}

/**
 * Short 3-question quiz. Each answer adds points to flavors; highest total wins.
 */
export default function FlavorQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [done, setDone] = useState(false);

  const question = QUIZ_QUESTIONS[step];
  const result = QUIZ_RESULTS[winnerFrom(scores)];

  function pickOption(optionIndex: number) {
    const option = question.options[optionIndex];
    const next = { ...scores };
    (Object.keys(option.scores) as ProductId[]).forEach((id) => {
      next[id] += option.scores[id];
    });
    setScores(next);

    if (step + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setScores(emptyScores());
    setDone(false);
  }

  return (
    <section id="quiz" className="py-24 bg-[#711F25] text-[#F5F2ED]">
      <div className="max-w-3xl mx-auto px-6">
        <span className="text-[#F5F2ED]/70 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
          Flavor Match
        </span>
        <h2 className="text-5xl md:text-6xl font-black italic uppercase leading-none mb-4 text-white">
          Find Your <span className="text-[#F5F2ED]/40">Pepper.</span>
        </h2>
        <p className="text-[#F5F2ED]/70 font-medium mb-12 max-w-xl">
          Three quick questions. We add points to each flavor and recommend the highest score —
          a tiny scoring model you can explain in an interview.
        </p>

        {!done ? (
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#F5F2ED]/50 mb-4">
              Question {step + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white mb-8">
              {question.prompt}
            </h3>
            <div className="flex flex-col gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => pickOption(i)}
                  className="text-left w-full px-6 py-4 border-2 border-[#F5F2ED]/25 text-white font-bold uppercase tracking-wide text-sm hover:bg-[#F5F2ED] hover:text-[#711F25] transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-2 border-[#F5F2ED]/30 p-8 md:p-12">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5F2ED]/50 mb-3">
              Your match
            </p>
            <h3 className="text-3xl md:text-5xl font-black italic uppercase mb-4 text-white">
              {result.name}
            </h3>
            <p className="text-[#F5F2ED]/80 font-medium mb-8 max-w-md">{result.blurb}</p>
            <p className="text-xs text-[#F5F2ED]/45 font-medium mb-8">
              Score totals — Original {scores.original} · Cherry {scores.cherry} · Cream{' '}
              {scores['cream-soda']} · Zero {scores['zero-sugar']}
            </p>
            <button
              type="button"
              onClick={restart}
              className="bg-[#F5F2ED] text-[#711F25] px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
