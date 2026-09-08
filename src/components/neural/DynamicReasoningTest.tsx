import React, { useState, useMemo, useEffect } from 'react';
import { HelpCircle, ArrowRight, CheckCircle2, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { SimulationParams, SimulationOutput } from '../../types';

interface DynamicReasoningTestProps {
  currentStep: number;
  maxSteps: number;
  currentDelta: number;
  stabilityPercent: number;
  isConverged: boolean;
  convergenceStep: number;
  params: SimulationParams;
  output: SimulationOutput;
  onAdvanceSteps: (count: number) => void;
  onReset: () => void;
}

interface TestScenario {
  id: string;
  prompt: string;
  context: string;
  stepsToRun: number;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: (startDelta: number, endDelta: number, userChoiceId: string) => {
    heading: string;
    body: string;
    isCorrect: boolean;
  };
}

export const DynamicReasoningTest: React.FC<DynamicReasoningTestProps> = ({
  currentStep,
  maxSteps,
  currentDelta,
  stabilityPercent,
  isConverged,
  convergenceStep,
  params,
  output,
  onAdvanceSteps,
  onReset,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    scenario: TestScenario;
    userChoice: string;
    startDelta: number;
    endDelta: number;
    startStep: number;
    endStep: number;
  } | null>(null);
  const [scenarioSeed, setScenarioSeed] = useState<number>(0);

  // Dynamically synthesize a prediction scenario based on CURRENT simulation state!
  const currentScenario = useMemo<TestScenario>(() => {
    // Scenario A: Early to mid reasoning steps (currentStep < convergenceStep - 1)
    if (currentStep < Math.max(2, convergenceStep - 1)) {
      const stepsToRun = Math.min(4, maxSteps - currentStep);
      return {
        id: `early-converge-${currentStep}-${scenarioSeed}`,
        prompt: `The network is currently at Step ${currentStep} with state difference Δ = ${currentDelta.toFixed(2)}. What do you think will happen if we let it run for ${stepsToRun} more steps?`,
        context: `Current stability is ${stabilityPercent}%. Recurrent loops are actively processing visual invariants.`,
        stepsToRun,
        options: [
          {
            id: 'opt-a',
            label: 'The state becomes more stable (difference Δ decreases toward zero).',
            isCorrect: true,
          },
          {
            id: 'opt-b',
            label: 'The state becomes less stable (difference Δ expands and diverges).',
            isCorrect: false,
          },
          {
            id: 'opt-c',
            label: 'Nothing changes (activations immediately freeze at their current values).',
            isCorrect: false,
          },
        ],
        explanation: (startDelta, endDelta, userChoiceId) => {
          const deltaDecreased = endDelta < startDelta;
          const isCorrect = userChoiceId === 'opt-a';
          return {
            isCorrect,
            heading: isCorrect ? 'Good intuition.' : 'Close — here’s what happened.',
            body: `You predicted that ${
              userChoiceId === 'opt-a'
                ? 'the state would become more stable'
                : userChoiceId === 'opt-b'
                ? 'the state would become less stable'
                : 'nothing would change'
            }. The simulation confirms that recurrent feedback damped perturbations: state difference decreased from ${startDelta.toFixed(2)} → ${endDelta.toFixed(2)}.`,
          };
        },
      };
    }

    // Scenario B: Converged or near-attractor basin (currentStep >= convergenceStep - 1)
    if (isConverged || currentStep >= convergenceStep - 1) {
      const stepsToRun = Math.min(3, maxSteps - currentStep || 1);
      return {
        id: `converged-attractor-${currentStep}-${scenarioSeed}`,
        prompt: `The network is at Step ${currentStep} and has entered the attractor basin (Δ = ${currentDelta.toFixed(3)} < 0.04). What will happen if the recurrent loop continues for another ${stepsToRun} step(s)?`,
        context: `The internal state is near fixed-point h*. Energy gradient descent is approaching zero.`,
        stepsToRun,
        options: [
          {
            id: 'opt-a',
            label: 'The state remains essentially unchanged near the fixed-point.',
            isCorrect: true,
          },
          {
            id: 'opt-b',
            label: 'The internal state resets back to the noisy input embeddings.',
            isCorrect: false,
          },
          {
            id: 'opt-c',
            label: 'The neuron activation values begin oscillating uncontrollably.',
            isCorrect: false,
          },
        ],
        explanation: (startDelta, endDelta, userChoiceId) => {
          const isCorrect = userChoiceId === 'opt-a';
          return {
            isCorrect,
            heading: isCorrect ? 'Good intuition.' : 'Interesting prediction. Let’s look at why.',
            body: `Once a recurrent system enters an attractor fixed-point h*, further iterations produce negligible shift (Δ = ${endDelta.toFixed(3)}). The thought has successfully crystallized without catastrophic drift.`,
          };
        },
      };
    }

    // Scenario C: Threshold / Sparsity dynamic scenario
    return {
      id: `sparsity-dyn-${currentStep}-${scenarioSeed}`,
      prompt: `The non-negative threshold is set to θ = ${params.sparsityThreshold.toFixed(2)}. If we advance recurrence by 2 steps, how will the hub and latent neurons respond?`,
      context: `Only activations exceeding θ pass forward through the non-negative threshold projection.`,
      stepsToRun: 2,
      options: [
        {
          id: 'opt-a',
          label: 'Relevant concept neurons will cross threshold θ and anchor the solution.',
          isCorrect: true,
        },
        {
          id: 'opt-b',
          label: 'All neurons will be suppressed down to exact zero.',
          isCorrect: false,
        },
        {
          id: 'opt-c',
          label: 'Sparsity will turn negative activations into random spikes.',
          isCorrect: false,
        },
      ],
      explanation: (startDelta, endDelta, userChoiceId) => {
        const isCorrect = userChoiceId === 'opt-a';
        return {
          isCorrect,
          heading: isCorrect ? 'Good intuition.' : 'Close — here’s what happened.',
          body: `With threshold θ = ${params.sparsityThreshold.toFixed(2)}, non-negative projection filters out background noise while allowing true concept invariants to strengthen.`,
        };
      },
    };
  }, [currentStep, maxSteps, currentDelta, stabilityPercent, isConverged, convergenceStep, params.sparsityThreshold, scenarioSeed]);

  // Reset local selection when scenario changes or test resets
  useEffect(() => {
    setSelectedOption(null);
  }, [currentScenario.id]);

  const handleRunPrediction = () => {
    if (!selectedOption) return;

    const startStep = currentStep;
    const startDelta = currentDelta;
    const stepsToRun = currentScenario.stepsToRun;

    // Run the simulation steps!
    onAdvanceSteps(stepsToRun);

    // After stepping, compute actual end delta from trajectory
    const targetStep = Math.min(maxSteps, startStep + stepsToRun);
    const endPoint = output.trajectory.find((t) => t.step === targetStep);
    const endDelta = endPoint ? endPoint.residualDelta : Math.max(0.012, startDelta * 0.4);

    setTestResult({
      scenario: currentScenario,
      userChoice: selectedOption,
      startDelta,
      endDelta,
      startStep,
      endStep: targetStep,
    });
  };

  const handleNextChallenge = () => {
    setTestResult(null);
    setSelectedOption(null);
    setScenarioSeed((s) => s + 1);
  };

  return (
    <div
      className="p-5 sm:p-7 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 glass-specular"
      id="dynamic-reasoning-test-section"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center shadow-2xs">
            <HelpCircle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
              Can you predict what happens?
            </h3>
            <p className="text-xs text-stone-600 font-normal">
              Test your intuition on the current simulation state.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
          Live State Evaluation
        </span>
      </div>

      {/* Main Question & Options OR Result Comparison */}
      {!testResult ? (
        <div className="space-y-4">
          {/* Dynamic Scenario Prompt */}
          <div className="p-4 rounded-2xl bg-white/70 border border-stone-200/70 space-y-1.5 shadow-2xs">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Simulation Scenario
            </div>
            <p className="text-sm font-bold text-stone-900 leading-snug">
              {currentScenario.prompt}
            </p>
            <p className="text-xs text-stone-500 font-normal">
              {currentScenario.context}
            </p>
          </div>

          {/* Options Selection */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
              Select your prediction:
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-300/30'
                        : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-medium text-stone-800 leading-relaxed">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* "Let's find out →" Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              id="btn-lets-find-out"
              onClick={handleRunPrediction}
              disabled={!selectedOption}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                selectedOption
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white ring-2 ring-amber-400/20'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Let's find out</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Comparison: YOUR PREDICTION vs WHAT HAPPENED */
        <div className="space-y-5 animate-in fade-in duration-300">
          {(() => {
            const exp = testResult.scenario.explanation(
              testResult.startDelta,
              testResult.endDelta,
              testResult.userChoice
            );
            const chosenOptionObj = testResult.scenario.options.find(
              (o) => o.id === testResult.userChoice
            );

            return (
              <div className="space-y-4">
                {/* Friendly Heading */}
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    exp.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-300/80 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-300/80 text-amber-950'
                  }`}
                >
                  {exp.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold font-display">{exp.heading}</h4>
                    <p className="text-xs leading-relaxed mt-0.5">{exp.body}</p>
                  </div>
                </div>

                {/* Direct Comparison Box: YOUR PREDICTION vs. WHAT HAPPENED */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Left: Your Prediction */}
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200/80 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Your Prediction
                    </div>
                    <p className="font-semibold text-stone-900 leading-snug">
                      "{chosenOptionObj?.label}"
                    </p>
                  </div>

                  {/* Right: What Happened */}
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200/80 space-y-1.5 font-mono">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-sans">
                      What Happened in Simulation
                    </div>
                    <div className="space-y-1 text-stone-800 text-[11px]">
                      <div className="flex justify-between">
                        <span className="font-sans text-stone-500">Step Range:</span>
                        <span className="font-bold">
                          Step {testResult.startStep} → {testResult.endStep}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans text-stone-500">State Δ:</span>
                        <span className="font-bold text-amber-900">
                          {testResult.startDelta.toFixed(2)} → {testResult.endDelta.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans text-stone-500">Convergence:</span>
                        <span className="font-bold text-emerald-700">
                          {testResult.endDelta < 0.04 ? 'Attractor Reached' : 'Stabilizing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions: Next Challenge or Reset */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass-medium hover:bg-white text-stone-700 border border-white/90 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                    <span>Reset Simulation</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-xs"
                  >
                    <span>Try another prediction scenario →</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
