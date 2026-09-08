import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  Award,
  AlertCircle,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';
import { QUIZ_QUESTIONS } from '../data/curriculumData';

interface KnowledgeCheckViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onRecordScore: (score: number, total: number) => void;
}

export const KnowledgeCheckView: React.FC<KnowledgeCheckViewProps> = ({
  onNavigate,
  progress,
  onRecordScore,
}) => {
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({ q2: 6 });
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted[questionId]) return;
    setSelectedOptionIds((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const isQuestionCorrect = (qId: string): boolean => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === qId);
    if (!q) return false;

    if (q.type === 'slider_reasoning') {
      const val = sliderValues[q.id] ?? 6;
      const target = q.correctSliderValue ?? 12;
      const tol = q.tolerance ?? 3;
      return Math.abs(val - target) <= tol;
    }

    const chosenId = selectedOptionIds[q.id];
    const chosenOpt = q.options?.find((o) => o.id === chosenId);
    return !!chosenOpt?.isCorrect;
  };

  const handleSubmitQuestion = (questionId: string) => {
    setSubmitted((prev) => {
      const updated = { ...prev, [questionId]: true };

      // If all submitted, record total score
      if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
        let correct = 0;
        QUIZ_QUESTIONS.forEach((q) => {
          if (q.type === 'slider_reasoning') {
            const val = sliderValues[q.id] ?? 6;
            const target = q.correctSliderValue ?? 12;
            const tol = q.tolerance ?? 3;
            if (Math.abs(val - target) <= tol) correct += 1;
          } else {
            const chosen = q.options?.find((o) => o.id === selectedOptionIds[q.id]);
            if (chosen?.isCorrect) correct += 1;
          }
        });
        onRecordScore(correct, QUIZ_QUESTIONS.length);

        if (correct >= 4) {
          try {
            confetti({
              particleCount: 75,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // Ignore in iframe
          }
        }
      }

      return updated;
    });
  };

  const handleResetQuiz = () => {
    setSelectedOptionIds({});
    setSliderValues({ q2: 6 });
    setSubmitted({});
  };

  const allSubmitted = Object.keys(submitted).length === QUIZ_QUESTIONS.length;
  const correctCount = allSubmitted
    ? QUIZ_QUESTIONS.filter((q) => isQuestionCorrect(q.id)).length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-9">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Understanding Check</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Explore Your Mental Model
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Test your intuition with friendly prediction puzzles, parameter adjustments, and mechanistic reasoning.
          </p>
        </div>

        {allSubmitted && (
          <button
            type="button"
            onClick={handleResetQuiz}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-medium hover:bg-white text-stone-700 border border-white/90 text-xs font-semibold cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {/* Completion Banner */}
      {allSubmitted && (
        <div className="p-7 rounded-3xl glass-strong border border-amber-300/80 shadow-xl space-y-3 animate-fadeIn glass-specular">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/60 flex items-center justify-center text-amber-950 shadow-xs">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">Curiosity Rewarded!</h3>
                <p className="text-xs text-stone-600 font-normal">You've explored all challenges in this module.</p>
              </div>
            </div>
            <div className="text-xl font-extrabold text-amber-950 bg-amber-500/15 px-4 py-1.5 rounded-2xl border border-amber-300/60 font-mono shadow-xs backdrop-blur-xs">
              {correctCount} / {QUIZ_QUESTIONS.length} Correct
            </div>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed pt-2 border-t border-amber-300/40 font-normal">
            {correctCount >= 4
              ? 'Intuition verified! You have a crystal-clear conceptual grasp of biological non-negative projections, recurrent latent convergence, and energy landscapes.'
              : 'Great exploration! Reading through the intuition breakdowns below will cement how biological plasticity and latent deliberation cooperate.'}
          </p>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-7">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const isQuestionSubmitted = !!submitted[q.id];
          const isCorrect = isQuestionSubmitted ? isQuestionCorrect(q.id) : false;
          const chosenOptionId = selectedOptionIds[q.id];

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 space-y-5 glass-strong shadow-xl glass-specular ${
                isQuestionSubmitted
                  ? isCorrect
                    ? 'border-emerald-400/90 ring-4 ring-emerald-500/15'
                    : 'border-rose-400/90 ring-4 ring-rose-500/15'
                  : 'border-white/90'
              }`}
            >
              {/* Question Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 tracking-wider font-mono">
                    EXPLORATION {idx + 1} &bull; {q.type.replace('_', ' ').toUpperCase()}
                  </span>
                  {isQuestionSubmitted && (
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs ${
                        isCorrect
                          ? 'bg-emerald-500/15 text-emerald-950 border border-emerald-300/70 shadow-2xs'
                          : 'bg-rose-500/15 text-rose-950 border border-rose-300/70 shadow-2xs'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Spot on!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-700" /> Close inquiry
                        </>
                      )}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-stone-900 leading-snug font-display">{q.question}</h3>
                {q.scenario && (
                  <p className="text-xs text-stone-600 glass-light p-3.5 rounded-2xl border border-white/80 leading-relaxed font-normal shadow-2xs">
                    {q.scenario}
                  </p>
                )}
              </div>

              {/* Slider reasoning question */}
              {q.type === 'slider_reasoning' ? (
                <div className="space-y-4 p-5 glass-light rounded-2xl border border-white/80 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Reasoning Effort T:</span>
                    <strong className="text-amber-950 font-bold text-sm bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-300/60 font-mono">
                      {sliderValues[q.id] ?? 6} {q.sliderUnit || 'steps'}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={q.minSlider || 1}
                    max={q.maxSlider || 24}
                    step={1}
                    disabled={isQuestionSubmitted}
                    value={sliderValues[q.id] ?? 6}
                    onChange={(e) =>
                      setSliderValues((prev) => ({
                        ...prev,
                        [q.id]: parseInt(e.target.value),
                      }))
                    }
                    className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-300/60 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                    <span>{q.minSlider || 1} step (Too quick)</span>
                    <span className="font-semibold text-amber-900">10-14 steps (Attractor Basin)</span>
                    <span>{q.maxSlider || 24} steps (Max Effort)</span>
                  </div>
                </div>
              ) : (
                /* Multiple Choice / Options */
                <div className="space-y-2.5">
                  {q.options?.map((opt, oIdx) => {
                    const isSelected = chosenOptionId === opt.id;
                    let optionStyle = 'glass-light hover:bg-white border-white/80 text-stone-800';

                    if (isQuestionSubmitted) {
                      if (opt.isCorrect) {
                        optionStyle = 'bg-emerald-500/15 border-emerald-400 text-emerald-950 font-semibold shadow-xs';
                      } else if (isSelected && !opt.isCorrect) {
                        optionStyle = 'bg-rose-500/15 border-rose-400 text-rose-950 shadow-xs';
                      } else {
                        optionStyle = 'glass-light/50 border-white/60 text-stone-400';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-amber-500/15 border-amber-400 text-amber-950 font-semibold shadow-xs';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isQuestionSubmitted}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-amber-600 text-white shadow-2xs' : 'bg-stone-200/80 text-stone-600'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-relaxed font-normal">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Submit Button per question */}
              {!isQuestionSubmitted && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={q.type !== 'slider_reasoning' && !chosenOptionId}
                    onClick={() => handleSubmitQuestion(q.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer border border-amber-400/40"
                  >
                    Check Understanding
                  </button>
                </div>
              )}

              {/* Feedback and Explanation */}
              {isQuestionSubmitted && (
                <div className="pt-3 border-t border-stone-200/50 space-y-3 text-xs animate-fadeIn">
                  <div className="p-4 glass-light rounded-2xl border border-amber-300/50 space-y-1.5 shadow-2xs">
                    <span className="font-bold text-amber-950 font-display">
                      Why this happens:
                    </span>
                    <p className="text-stone-700 leading-relaxed font-normal">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-stone-200/60">
        <button
          type="button"
          onClick={() => onNavigate('/playground')}
          className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer transition-colors"
        >
          &larr; Back to Playground
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/progress')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer border border-amber-400/40"
        >
          <span>View Learning Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
