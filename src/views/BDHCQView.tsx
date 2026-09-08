import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  DollarSign,
  TrendingDown,
  Award,
  ArrowRight,
  CheckCircle2,
  Grid3X3,
  BarChart3,
  Clock,
  Layers,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';
import { MathView } from '../components/MathView';

interface BDHCQViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
}

export const BDHCQView: React.FC<BDHCQViewProps> = ({ onNavigate, progress }) => {
  const [taskCount, setTaskCount] = useState<number>(400); // 400 ARC evaluation tasks
  const [selectedBenchmark, setSelectedBenchmark] = useState<'arc-agi' | 'visual-in-context'>('arc-agi');

  // Comparative Cost calculations
  const bdhCqCost = (taskCount * 0.0007).toFixed(2);
  const gpt4oCoTCost = (taskCount * 0.08).toFixed(2);
  const claudeSonnetCoTCost = (taskCount * 0.12).toFixed(2);
  const o1CoTCost = (taskCount * 0.45).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <Brain className="w-3.5 h-3.5 text-amber-700" />
          <span>Continuous Query Reasoning Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          BDH-CQ: Recurrent Latent Reasoning
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl font-normal">
          BDH-CQ extends the Dragon Hatchling architecture into a high-efficiency reasoning engine. Instead of outputting verbalized Chain-of-Thought words, BDH-CQ absorbs visual demonstrations into synaptic memory and iterates directly in continuous hidden states.
        </p>
      </div>

      {/* The Landmark Milestone: ARC-AGI Evaluation */}
      <div className="p-6 sm:p-9 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 glass-specular">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-5">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-950 font-mono">
              Benchmark Milestone
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              State-of-the-Art Cost-Accuracy Frontier on ARC-AGI
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/15 text-amber-950 border border-amber-300/60 text-xs font-bold font-mono shadow-xs backdrop-blur-xs">
            <Award className="w-4 h-4 text-amber-700" />
            <span>29.5% pass@2 (150M Params)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-1 shadow-2xs">
            <span className="text-stone-500 text-xs font-medium">Inference Cost per Task:</span>
            <div className="text-2xl font-extrabold text-amber-900 font-mono">$0.0007</div>
            <p className="text-[11px] text-stone-600 leading-tight font-normal">Over 100x cheaper than LLM Chain-of-Thought</p>
          </div>

          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-1 shadow-2xs">
            <span className="text-stone-500 text-xs font-medium">Parameter Efficiency:</span>
            <div className="text-2xl font-extrabold text-stone-900 font-mono">150M params</div>
            <p className="text-[11px] text-stone-600 leading-tight font-normal">Rivals billion-parameter models without token bloat</p>
          </div>

          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-1 shadow-2xs">
            <span className="text-stone-500 text-xs font-medium">Reasoning Substrate:</span>
            <div className="text-2xl font-extrabold text-amber-800 font-mono">Continuous Latent</div>
            <p className="text-[11px] text-stone-600 leading-tight font-normal">Recurrent steps T in high-dimensional hidden state</p>
          </div>
        </div>

        <div className="p-4 glass-light rounded-2xl border border-amber-300/60 text-xs text-stone-700 leading-relaxed space-y-1.5 shadow-2xs">
          <strong className="text-amber-950 font-bold">Why this matters:</strong> Most LLMs struggle with ARC-AGI because converting visual grid coordinates into text strings ("[ [0, 2], [2, 0] ]") creates immense sequence lengths and destroys 2D spatial locality. BDH-CQ preserves topological spatial invariants, updating latent states recurrently until the transformation rule snaps into an attractor.
        </div>
      </div>

      {/* Interactive Inference Cost Calculator */}
      <div className="p-6 sm:p-9 rounded-3xl glass-strong border border-white/90 space-y-6 shadow-xl glass-specular">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/50 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-950 font-mono">
              Interactive Cost Calculator
            </span>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              Compute Budget Comparison: BDH-CQ vs Verbalized LLM CoT
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span>Evaluating</span>
            <input
              type="number"
              min="10"
              max="2000"
              step="50"
              value={taskCount}
              onChange={(e) => setTaskCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 glass-light border border-stone-300/80 rounded-lg text-amber-900 font-bold text-right font-mono focus:outline-hidden focus:border-amber-400 shadow-2xs"
            />
            <span>Tasks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* BDH-CQ */}
          <div className="p-5 rounded-2xl glass-medium border border-amber-400/80 space-y-2 shadow-md bg-amber-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 font-display">BDH-CQ (150M)</span>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-950 px-2 py-0.5 rounded-full font-mono border border-amber-300/50">
                Latent
              </span>
            </div>
            <div className="font-mono text-2xl font-extrabold text-amber-950">${bdhCqCost}</div>
            <div className="text-[11px] text-stone-600 font-normal">0 verbalized tokens • $0.0007 / task</div>
          </div>

          {/* GPT-4o */}
          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">GPT-4o CoT</span>
              <span className="text-[10px] text-stone-500 font-medium font-mono">~600 tokens</span>
            </div>
            <div className="font-mono text-2xl font-bold text-stone-800">${gpt4oCoTCost}</div>
            <div className="text-[11px] text-stone-500 font-normal">~$0.08 / task</div>
          </div>

          {/* Claude 3.5 Sonnet */}
          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Claude 3.5 Sonnet</span>
              <span className="text-[10px] text-stone-500 font-medium font-mono">~800 tokens</span>
            </div>
            <div className="font-mono text-2xl font-bold text-stone-800">${claudeSonnetCoTCost}</div>
            <div className="text-[11px] text-stone-500 font-normal">~$0.12 / task</div>
          </div>

          {/* OpenAI o1 */}
          <div className="p-5 rounded-2xl glass-light border border-white/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">OpenAI o1 Reasoning</span>
              <span className="text-[10px] text-stone-500 font-medium font-mono">~2,500 tokens</span>
            </div>
            <div className="font-mono text-2xl font-bold text-rose-700">${o1CoTCost}</div>
            <div className="text-[11px] text-stone-500 font-normal">~$0.45 / task</div>
          </div>
        </div>

        <div className="p-4 glass-light border border-amber-300/60 rounded-2xl text-xs text-amber-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              For {taskCount} benchmark tasks, BDH-CQ saves approximately{' '}
              <strong className="font-extrabold text-amber-900">${(parseFloat(gpt4oCoTCost) - parseFloat(bdhCqCost)).toFixed(2)}</strong> compared to standard CoT.
            </span>
          </div>
        </div>
      </div>

      {/* Recurrent Latent Loop Formulation */}
      <div className="p-6 sm:p-9 rounded-3xl glass-strong border border-white/90 space-y-4 shadow-xl glass-specular">
        <h3 className="text-lg font-bold text-stone-900 font-display">
          The Continuous Query Recurrence Formulation
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
          In BDH-CQ, reasoning effort is treated as a dial. Given a test query q and dynamic plastic matrix W_plastic (adapted from demonstrations K), the internal loop executes:
        </p>

        <MathView
          formula="h_{t+1} = \Pi_{\ge \theta}\left( (W_{\text{rec}} + W_{\text{plastic}}) h_t + W_q q + b \right), \quad t \in [1, \dots, T]"
          explanationTitle="BDH-CQ Recurrent Loop"
          explanationBody="The state h_t starts from a neutral prior. Each step injects both the query q and associative recall from the plastic memory W_plastic, projecting through threshold theta. Reasoning effort T terminates when the residual delta ||h_{t+1} - h_t|| falls below tolerance epsilon."
          terms={[
            { symbol: 'W_{\\text{rec}}', meaning: 'Fixed scale-free baseline connectivity matrix' },
            { symbol: 'W_{\\text{plastic}}', meaning: 'Dynamic Hebbian synaptic memory conditioned on in-context demonstrations' },
            { symbol: 'W_q q', meaning: 'Input query projection guiding the trajectory' },
            { symbol: 'T', meaning: 'Tunable reasoning effort (computational deliberation steps)' },
          ]}
        />

        <div className="pt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => onNavigate('/experiment')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer border border-amber-400/40"
          >
            <span>Launch Guided Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
