import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  Eye,
  HelpCircle,
  Activity,
  Layers,
  FlaskConical,
  X,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { AppRoute, UserProgress, SimulationParams } from '../types';
import { runSimulation, PRESET_EXPERIMENTS, PresetExperiment } from '../services/simulationEngine';
import { InteractiveCanvas } from '../components/InteractiveCanvas';
import { ParameterSlider } from '../components/ParameterSlider';
import { CompareView } from '../components/CompareView';

interface PlaygroundViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onRunExperiment: () => void;
}

const DEFAULT_PARAMS: SimulationParams = {
  reasoningEffort: 12,
  sparsityThreshold: 0.65,
  hebbianRate: 0.05,
  decayFactor: 0.08,
  networkScale: 48,
  inputDemonstrations: 4,
  noiseLevel: 0.03,
};

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  onNavigate,
  progress,
  onRunExperiment,
}) => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [showCompare, setShowCompare] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('latent-deliberation');

  const output = useMemo(() => runSimulation(params), [params]);

  const handleApplyPreset = (preset: PresetExperiment) => {
    setActivePreset(preset.id);
    setParams((prev) => ({
      ...prev,
      ...preset.recommendedParams,
    }));
    onRunExperiment();
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Laboratory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            The BDH-CQ Simulation Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Manipulate internal recurrence, biological sparsity, and Hebbian plasticity in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCompare(!showCompare)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
              showCompare
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border border-amber-400/40'
                : 'glass-medium hover:bg-white text-stone-800 border border-white/90'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showCompare ? 'Hide Comparison' : 'Compare Baseline'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowExplanation(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border border-amber-300/60 text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs backdrop-blur-md active:scale-[0.98]"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Explain State</span>
          </button>
        </div>
      </div>

      {/* Preset Experiment Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span className="uppercase tracking-wider font-bold text-stone-700 font-mono">
            Guided Research Presets
          </span>
          <span className="text-stone-400">Click any preset to load its parameter configuration</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PRESET_EXPERIMENTS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-2 shadow-xs ${
                  isSelected
                    ? 'glass-strong border-amber-400/90 ring-2 ring-amber-400/30 shadow-md'
                    : 'glass-medium border-white/80 hover:border-amber-400/60 hover:shadow-md'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100/90 text-stone-600 border border-stone-200">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-amber-800">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 font-display">{preset.name}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                    {preset.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-200/50 text-[11px] text-amber-800 font-bold flex items-center gap-1">
                  <span>Apply Preset</span>
                  <span>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Before / After Comparison Drawer */}
      {showCompare && (
        <div className="animate-fadeIn">
          <CompareView onClose={() => setShowCompare(false)} />
        </div>
      )}

      {/* Main Grid: Control Panel (Left) & Canvas Visualization (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parameter Sliders Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 glass-strong border border-white/90 rounded-3xl space-y-4 shadow-lg glass-specular">
            <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 font-display">Parameter Controls</h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* Slider 1: Reasoning Effort T */}
            <ParameterSlider
              id="slider-t"
              label="Reasoning Effort (Latent Steps)"
              symbol="T"
              value={params.reasoningEffort}
              min={1}
              max={24}
              step={1}
              unit=" steps"
              description="Cycles of continuous hidden-state recurrence per query"
              onChange={(val) => {
                setParams((prev) => ({ ...prev, reasoningEffort: val }));
                onRunExperiment();
              }}
            />

            {/* Slider 2: Biological Sparsity Threshold θ */}
            <ParameterSlider
              id="slider-sparsity"
              label="Sparsity Threshold (Threshold Projection)"
              symbol="θ"
              value={params.sparsityThreshold}
              min={0.1}
              max={0.95}
              step={0.05}
              description="Cutoff for strictly positive non-negative neuron activation"
              onChange={(val) => {
                setParams((prev) => ({ ...prev, sparsityThreshold: val }));
                onRunExperiment();
              }}
            />

            {/* Slider 3: Hebbian Plasticity Rate η */}
            <ParameterSlider
              id="slider-hebbian"
              label="Online Hebbian Plasticity Rate"
              symbol="η"
              value={params.hebbianRate}
              min={0.0}
              max={0.1}
              step={0.01}
              description="Synaptic learning rate during context demonstration streaming"
              onChange={(val) => {
                setParams((prev) => ({ ...prev, hebbianRate: val }));
                onRunExperiment();
              }}
            />

            {/* Slider 4: Homeostatic Decay α */}
            <ParameterSlider
              id="slider-decay"
              label="Homeostatic Weight Decay"
              symbol="α"
              value={params.decayFactor}
              min={0.01}
              max={0.2}
              step={0.01}
              description="Biological damping factor preventing runaway neural excitation"
              onChange={(val) => {
                setParams((prev) => ({ ...prev, decayFactor: val }));
                onRunExperiment();
              }}
            />

            {/* Slider 5: Demonstrations K */}
            <ParameterSlider
              id="slider-demos"
              label="In-Context Demonstrations"
              symbol="K"
              value={params.inputDemonstrations}
              min={1}
              max={6}
              step={1}
              unit=" pairs"
              description="Number of ARC sample grids presented before test query"
              onChange={(val) => {
                setParams((prev) => ({ ...prev, inputDemonstrations: val }));
                onRunExperiment();
              }}
            />
          </div>

          {/* Theoretical Summary Box */}
          <div className="p-5 glass-medium rounded-3xl border border-white/80 text-xs text-stone-600 space-y-2 shadow-sm glass-specular">
            <div className="flex items-center gap-1.5 text-stone-900 font-bold">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Attractor Stability Condition</span>
            </div>
            <p className="leading-relaxed font-normal">
              For continuous latent reasoning to converge, the energy gradient must be negative:
              <span className="font-mono text-stone-900 font-bold"> dE/dt &lt; 0</span>. Adjusting <strong className="text-stone-900 font-mono">T &ge; 10</strong> allows the system to settle into the basin representing the verified abstract rule.
            </p>
          </div>
        </div>

        {/* Live Interactive Visualization Canvas */}
        <div className="lg:col-span-7">
          <InteractiveCanvas
            params={params}
            output={output}
            onReset={handleReset}
            onRun={onRunExperiment}
            onToggleCompare={() => setShowCompare(!showCompare)}
            onExplainChange={() => setShowExplanation(true)}
            reducedMotion={progress.reducedMotion}
          />
        </div>
      </div>

      {/* Explanation Modal ("Explain What Changed") */}
      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md animate-fadeIn">
          <div className="glass-strong border border-white/90 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5 glass-specular">
            <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-amber-400/20 to-orange-400/30 text-amber-900 rounded-xl border border-white/90 shadow-2xs">
                  <HelpCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display">Live State Interpretation</h3>
                  <p className="text-xs text-stone-500">What your current parameters do physically inside the model</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-4 glass-light rounded-2xl border border-white/80 space-y-1 shadow-2xs">
                <span className="font-bold text-amber-900 font-mono">
                  1. Reasoning Depth (T = {params.reasoningEffort} steps)
                </span>
                <p className="leading-relaxed">
                  At {params.reasoningEffort} steps, the residual delta decayed to{' '}
                  <strong className="text-stone-900 font-mono">
                    {output.trajectory[output.trajectory.length - 1]?.residualDelta}
                  </strong>
                  . The state {output.convergenceStep <= params.reasoningEffort ? 'successfully reached a stable attractor state' : 'has not yet stabilized fully'}.
                </p>
              </div>

              <div className="p-4 glass-light rounded-2xl border border-white/80 space-y-1 shadow-2xs">
                <span className="font-bold text-stone-900 font-mono">
                  2. Sparsity & Monosemanticity (θ = {params.sparsityThreshold})
                </span>
                <p className="leading-relaxed">
                  Non-negative projection yields a monosemanticity score of{' '}
                  <strong className="text-stone-900 font-mono">{output.monosemanticityScore}%</strong>. Only{' '}
                  <strong className="text-stone-900 font-mono">{output.activeNeuronsCount}</strong> of {params.networkScale} neurons fire simultaneously, avoiding polysemantic superposition.
                </p>
              </div>

              <div className="p-4 glass-light rounded-2xl border border-white/80 space-y-1 shadow-2xs">
                <span className="font-bold text-amber-900 font-mono">
                  3. In-Context Demonstration Absorption (K = {params.inputDemonstrations})
                </span>
                <p className="leading-relaxed">
                  With Hebbian rate <span className="font-mono">η = {params.hebbianRate}</span>, the {params.inputDemonstrations} input demonstrations were imprinted into dynamic synaptic weights <span className="font-mono">W_plastic</span>, providing instant in-context generalization without backpropagation.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs border border-amber-400/40"
              >
                Close Interpretation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
