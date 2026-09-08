import React from 'react';
import { Activity, TrendingDown, CheckCircle, Sparkles } from 'lucide-react';

interface WhatHappenedBannerProps {
  currentStep: number;
  prevStep: number;
  currentDelta: number;
  prevDelta: number;
  stabilityPercent: number;
  isConverged: boolean;
}

export const WhatHappenedBanner: React.FC<WhatHappenedBannerProps> = ({
  currentStep,
  prevStep,
  currentDelta,
  prevDelta,
  stabilityPercent,
  isConverged,
}) => {
  // Generate concrete explanation based on real delta values
  const narrative = React.useMemo(() => {
    if (currentStep === 0) {
      return {
        title: 'Initial State Injected',
        body: 'The visual puzzle and demonstration tokens entered the network. Latent activations are currently at rest.',
        metric: 'Ready to iterate',
      };
    }

    const deltaDiff = prevDelta - currentDelta;

    if (isConverged) {
      return {
        title: 'The internal state has reached an attractor minimum.',
        body: `Recurrent updates produced negligible change (Δ = ${currentDelta.toFixed(3)} < 0.04). The internal representation is now stable.`,
        metric: '100% Stable',
      };
    }

    if (deltaDiff > 0.005) {
      return {
        title: 'The internal state became more stable.',
        body: `Between Step ${prevStep} and Step ${currentStep}, the state difference decreased from ${prevDelta.toFixed(2)} → ${currentDelta.toFixed(2)} (a drop of ${deltaDiff.toFixed(2)}).`,
        metric: `${stabilityPercent}% Stability`,
      };
    }

    if (Math.abs(deltaDiff) <= 0.005) {
      return {
        title: 'The internal state is settling near a steady state.',
        body: `Step ${currentStep} maintained low residual change (Δ = ${currentDelta.toFixed(2)}). Representations are consolidating without divergent oscillations.`,
        metric: `${stabilityPercent}% Stability`,
      };
    }

    return {
      title: 'The internal state is dynamically adjusting.',
      body: `Synaptic updates modified the activation pattern (Δ = ${currentDelta.toFixed(2)}). The network is actively resolving visual constraints.`,
      metric: `${stabilityPercent}% Stability`,
    };
  }, [currentStep, prevStep, currentDelta, prevDelta, stabilityPercent, isConverged]);

  return (
    <div
      className="p-4 sm:p-5 rounded-3xl glass-strong border border-white/90 shadow-md space-y-2 glass-specular"
      id="what-just-happened-banner"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <span className="text-xs font-bold text-stone-900 font-display uppercase tracking-wider">
            What Just Happened?
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-800 bg-white/70 px-2.5 py-1 rounded-xl border border-stone-200/60">
          <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
          <span>{narrative.metric}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-stone-900">
          "{narrative.title}"
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          {narrative.body}
        </p>
      </div>
    </div>
  );
};
