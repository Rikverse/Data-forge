import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ReasoningProgressBarProps {
  currentStep: number;
  maxSteps: number;
  isConverged: boolean;
  convergenceStep: number;
  onStepClick: (step: number) => void;
  residualDelta: number;
}

export const ReasoningProgressBar: React.FC<ReasoningProgressBarProps> = ({
  currentStep,
  maxSteps,
  isConverged,
  convergenceStep,
  onStepClick,
  residualDelta,
}) => {
  // Generate descriptive step narrative from actual state
  const stepExplanation = React.useMemo(() => {
    if (currentStep === 0) {
      return 'Step 0: Your input enters the network. Task stimuli and demonstration embeddings are projected into continuous latent space.';
    }
    if (currentStep === 1) {
      return 'Step 1: The neurons begin forming an internal representation. Hub units activate and broadcast across recurrent synapses.';
    }
    if (isConverged) {
      return `Step ${currentStep}: The system has reached a stable attractor state (Δ = ${residualDelta.toFixed(3)} < 0.04). Internal thoughts have crystallized for readout.`;
    }
    if (currentStep >= convergenceStep - 2) {
      return `Step ${currentStep}: The representation is becoming more stable. Latent state difference Δ decreased to ${residualDelta.toFixed(3)}.`;
    }
    return `Step ${currentStep}: The network is updating its internal state. Recurrent feedback loops through latent neurons, filtering noise.`;
  }, [currentStep, isConverged, convergenceStep, residualDelta]);

  // Generate steps array [0, 1, ..., maxSteps]
  const steps = React.useMemo(() => {
    return Array.from({ length: maxSteps + 1 }, (_, i) => i);
  }, [maxSteps]);

  return (
    <div
      className="p-4 sm:p-5 rounded-3xl glass-strong border border-white/90 shadow-md space-y-3.5 glass-specular"
      id="reasoning-progress-container"
    >
      {/* Header: Label & Step Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/50 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-900 font-display uppercase tracking-wider">
            Reasoning progress
          </span>
          {isConverged && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
              <CheckCircle2 className="w-3 h-3 text-teal-700" />
              <span>Attractor Converged</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Current Cycle:</span>
          <span className="text-xs font-extrabold text-stone-900 font-mono px-2.5 py-0.5 rounded-lg bg-stone-100/90 border border-stone-200/80">
            Step {currentStep} / {maxSteps}
          </span>
        </div>
      </div>

      {/* Segmented / Interactive Progress Bar: ●━━●━━●━━●━━○━━○━━○ */}
      <div className="w-full relative py-2">
        {/* Continuous Background Rail */}
        <div className="absolute top-1/2 left-3 right-3 h-1 -translate-y-1/2 bg-stone-200/80 rounded-full z-0" />

        {/* Continuous Active Filled Rail */}
        <div
          className="absolute top-1/2 left-3 h-1 -translate-y-1/2 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-500 rounded-full z-0 transition-all duration-300"
          style={{
            width: `calc(${Math.min(100, (currentStep / maxSteps) * 100)}% * (1 - 24px / 100%))`,
          }}
        />

        {/* Step Nodes */}
        <div className="relative z-10 flex items-center justify-between">
          {steps.map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;
            const isConvStep = step === convergenceStep;

            return (
              <button
                key={step}
                type="button"
                onClick={() => onStepClick(step)}
                title={`Jump to Step ${step} (${step === 0 ? 'Input' : isConvStep ? 'Target Attractor' : 'Iteration'})`}
                className="group flex flex-col items-center focus:outline-hidden cursor-pointer"
              >
                {/* Node Dot / Badge */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-extrabold shadow-md ring-4 ring-amber-300/40 scale-110'
                      : isCompleted
                      ? 'w-5 h-5 sm:w-6 sm:h-6 bg-amber-500/90 text-white font-bold shadow-xs hover:scale-105'
                      : 'w-4 h-4 sm:w-5 sm:h-5 bg-stone-100 text-stone-400 border border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {isCurrent ? (
                    <span className="text-[11px] font-mono leading-none">{step}</span>
                  ) : isCompleted ? (
                    <span className="text-[9px] font-mono leading-none sm:inline hidden">{step}</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-stone-400" />
                  )}

                  {/* Marker for convergence threshold */}
                  {isConvStep && !isCurrent && (
                    <span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"
                      title="Attractor Convergence Step"
                    />
                  )}
                </div>

                {/* Optional mini label for key steps */}
                {step === 0 && (
                  <span className="text-[9px] font-bold text-stone-500 mt-1 hidden sm:block">
                    In
                  </span>
                )}
                {step === maxSteps && (
                  <span className="text-[9px] font-bold text-stone-500 mt-1 hidden sm:block">
                    End
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Explanation Sentence Below Bar */}
      <div className="pt-1 flex items-start sm:items-center gap-2 text-xs text-stone-700 bg-amber-50/60 p-2.5 rounded-2xl border border-amber-200/50">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed font-normal text-stone-800">
          {stepExplanation}
        </p>
      </div>
    </div>
  );
};
