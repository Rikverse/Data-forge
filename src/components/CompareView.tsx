import React from 'react';
import { CheckCircle2, AlertTriangle, Cpu, DollarSign, Brain, Zap } from 'lucide-react';

interface CompareViewProps {
  onClose?: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onClose }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
            Architectural Paradigm Contrast
          </span>
          <h3 className="text-lg font-bold text-stone-900 mt-2">
            Baseline (Autoregressive LLM + CoT) vs BDH-CQ (Recurrent Latent Reasoning)
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            How deliberating in continuous latent space transforms compute, interpretability, and cost economics.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer self-start transition-colors"
          >
            Close Comparison
          </button>
        )}
      </div>

      {/* Side-by-side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Baseline: Transformer CoT</h4>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Verbalized Tokens
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Forces the model to spell out natural language words (&ldquo;Let&apos;s think step by step, first examine row 1...&rdquo;).
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-600 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-rose-600" /> Cost / ARC Task:
              </span>
              <strong className="text-rose-700 font-mono">~$0.0500 - $0.2500</strong>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-600 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-rose-600" /> KV-Cache Complexity:
              </span>
              <strong className="text-rose-700 font-mono">O(N²) quadratic attention</strong>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-600 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-rose-600" /> Weight Dynamics:
              </span>
              <span className="text-stone-700 font-medium">Frozen (Stateless inference)</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-600 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-rose-600" /> Representation:
              </span>
              <span className="text-stone-700 font-medium">Polysemantic superposition</span>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed">
            <strong>Limitation:</strong> Converting 2D visual grids into 1D text tokens introduces token bloat, high latency, and fails to adapt to demonstration patterns in real time.
          </div>
        </div>

        {/* BDH-CQ Card */}
        <div className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Modified: BDH-CQ Reasoning</h4>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Recurrent Latent
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Deliberates entirely within internal high-dimensional continuous hidden states across tunable reasoning effort steps T.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-200/80">
              <span className="text-stone-600 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" /> Cost / ARC Task:
              </span>
              <strong className="text-emerald-800 font-mono font-bold">$0.0007 (100x cheaper!)</strong>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-200/80">
              <span className="text-stone-600 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-700" /> Recurrence Complexity:
              </span>
              <strong className="text-emerald-800 font-mono">O(T · d) linear in steps</strong>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-200/80">
              <span className="text-stone-600 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-emerald-700" /> Weight Dynamics:
              </span>
              <span className="text-emerald-900 font-medium">Sticky Inference (Hebbian ΔW)</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-200/80">
              <span className="text-stone-600 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-700" /> Representation:
              </span>
              <span className="text-emerald-900 font-medium">Sparse positive (Monosemantic)</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
            <strong>Advantage:</strong> The 150M parameter BDH-CQ achieved 29.5% pass@2 on ARC-AGI-1 at $0.0007 per task, achieving unprecedented cost-efficiency and direct geometric reasoning.
          </div>
        </div>
      </div>

      {/* Meaningful Difference Summary Matrix */}
      <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-3">
        <h4 className="text-xs uppercase font-bold text-stone-600 tracking-wider">
          Direct Mechanistic Differences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-900 block font-bold">1. Deliberation Mechanism</span>
            <p className="text-stone-600 leading-relaxed">
              Baseline emits <strong className="text-rose-700">external text words</strong> one by one; BDH-CQ cycles <strong className="text-emerald-800">internal continuous states</strong> until settling into an attractor.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-900 block font-bold">2. Synaptic Plasticity</span>
            <p className="text-stone-600 leading-relaxed">
              Baseline weights are frozen at inference; BDH uses <strong className="text-emerald-800">online Hebbian plasticity</strong> so demonstrations immediately rewire synapses.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-900 block font-bold">3. Interpretability</span>
            <p className="text-stone-600 leading-relaxed">
              Baseline features are entangled polysemantic vectors; BDH enforces <strong className="text-emerald-800">sparse non-negative projections</strong> for direct monosemantic reading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
