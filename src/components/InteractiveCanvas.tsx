import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  HelpCircle,
  Layers,
  Activity,
  Grid3X3,
  Sparkles,
  Brain,
  Crosshair,
  Split,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Info,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { SimulationParams, SimulationOutput } from '../types';
import { NeuralNetworkVisualizer } from './NeuralNetworkVisualizer';

interface InteractiveCanvasProps {
  params: SimulationParams;
  output: SimulationOutput;
  onReset: () => void;
  onRun?: () => void;
  onExplainChange?: () => void;
  onToggleCompare?: () => void;
  reducedMotion?: boolean;
}

export type TrajectoryMode = 'waterfall' | 'phase_orbit';

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  params,
  output,
  onReset,
  onRun,
  onExplainChange,
  onToggleCompare,
  reducedMotion = false,
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'trajectory' | 'arc_grid'>('network');
  const [isPlaying, setIsPlaying] = useState(true);
  const [animStep, setAnimStep] = useState(0);

  // Thought Trajectory state
  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>('waterfall');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [selectedTrajectoryStep, setSelectedTrajectoryStep] = useState<number>(0);

  // Pattern Output state
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [showSymmetryGuides, setShowSymmetryGuides] = useState<boolean>(true);
  const [showInputComparison, setShowInputComparison] = useState<boolean>(false);

  // Animation cycle for step playback
  const maxReasoningSteps = Math.max(1, params.reasoningEffort || 12);
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % maxReasoningSteps);
    }, 550);
    return () => clearInterval(interval);
  }, [isPlaying, maxReasoningSteps, reducedMotion]);

  // Keep selectedTrajectoryStep in sync with animStep when playing
  useEffect(() => {
    if (isPlaying) {
      setSelectedTrajectoryStep(animStep);
    }
  }, [animStep, isPlaying]);

  // Modern jewel-toned ARC color palette mapping
  const getGridColor = (val: number, isSelected: boolean, isSymmetricPartner: boolean) => {
    let base = '';
    switch (val) {
      case 0:
        base =
          'bg-stone-900/10 hover:bg-stone-900/15 border-stone-300/50 text-stone-400 shadow-inner backdrop-blur-xs';
        break;
      case 1:
        // Luminous Sapphire Blue
        base =
          'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 border-sky-300 text-white font-black shadow-md shadow-sky-500/25';
        break;
      case 2:
        // Radiant Emerald Jade
        base =
          'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 border-emerald-300 text-white font-black shadow-md shadow-emerald-500/25';
        break;
      case 3:
        // Glowing Amber Citrine
        base =
          'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 border-amber-300 text-white font-black shadow-md shadow-amber-500/25';
        break;
      case 4:
        // Royal Amethyst Violet
        base =
          'bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 border-purple-300 text-white font-black shadow-md shadow-purple-500/25';
        break;
      default:
        base = 'bg-stone-900/10 border-stone-300/50 text-stone-400';
    }

    if (isSelected) {
      return `${base} ring-3 ring-amber-400 ring-offset-2 ring-offset-white scale-105 z-10`;
    }
    if (isSymmetricPartner) {
      return `${base} ring-2 ring-sky-400 ring-offset-1 ring-offset-white scale-[1.03] z-5 animate-pulse`;
    }

    return base;
  };

  // Mock input demonstration question grid (Incomplete diamond problem to contrast with completed solution)
  const inputProblemGrid = useMemo(() => {
    return [
      [0, 1, 0, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ];
  }, []);

  // Inspect trajectory step data
  const currentInspectPoint = useMemo(() => {
    const targetIdx = hoveredStep !== null ? hoveredStep : selectedTrajectoryStep;
    return output.trajectory[targetIdx] || output.trajectory[output.trajectory.length - 1] || {
      step: 1,
      residualDelta: 0.95,
      latentNorm: 1.0,
      entropy: 2.1,
    };
  }, [output.trajectory, hoveredStep, selectedTrajectoryStep]);

  // Check if a cell is a symmetric counterpart of the hovered/selected cell (D4 dihedral reflection)
  const isCellSymmetricPartner = (r: number, c: number) => {
    const active = hoveredCell || selectedCell;
    if (!active) return false;
    if (active.r === r && active.c === c) return false; // Self
    const rReflect = 3 - active.r;
    const cReflect = 3 - active.c;
    // Horizontal, vertical, or central diagonal reflection
    return (
      (r === rReflect && c === active.c) ||
      (r === active.r && c === cReflect) ||
      (r === rReflect && c === cReflect)
    );
  };

  return (
    <div className="glass-strong border border-white/90 rounded-3xl overflow-hidden shadow-xl glass-specular transition-all">
      {/* Top Bar: Pipeline Flow & Tab Switchers */}
      <div className="p-4 glass-medium border-b border-white/80 flex flex-wrap items-center justify-between gap-3">
        {/* Conceptual Pipeline indicator */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="px-3 py-1 rounded-full bg-white/80 border border-white/90 text-stone-700 font-medium flex items-center gap-1.5 shadow-2xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Input: ARC Query (K={params.inputDemonstrations})</span>
          </div>
          <span className="text-stone-400 font-bold">→</span>
          <div className="px-3 py-1 rounded-full bg-white/80 border border-white/90 text-stone-700 font-medium flex items-center gap-1.5 shadow-2xs backdrop-blur-xs">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Process: Deliberation (T={params.reasoningEffort})</span>
          </div>
          <span className="text-stone-400 font-bold">→</span>
          <div className="px-3 py-1 rounded-full bg-white/80 border border-white/90 text-stone-700 font-medium shadow-2xs backdrop-blur-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Pass Rate: <strong className="text-emerald-800 font-mono">{output.passProbability}%</strong>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/60 rounded-2xl border border-white/90 shadow-2xs">
          <button
            type="button"
            id="tab-network"
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'network'
                ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-600" />
            <span>Neural Network & Synapses</span>
          </button>
          <button
            type="button"
            id="tab-trajectory"
            onClick={() => setActiveTab('trajectory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'trajectory'
                ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Thought Trajectory</span>
          </button>
          <button
            type="button"
            id="tab-arc-grid"
            onClick={() => setActiveTab('arc_grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'arc_grid'
                ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Pattern Output</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="p-4 sm:p-6 relative min-h-[420px] flex items-center justify-center bg-white/30 backdrop-blur-md">
        {/* Warm Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(217, 119, 6, 0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* View 1: Neural Network Visualizer */}
        {activeTab === 'network' && (
          <div className="w-full max-w-3xl relative">
            <NeuralNetworkVisualizer
              params={params}
              output={output}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        {/* View 2: Redesigned High-Contrast Thought Trajectory */}
        {activeTab === 'trajectory' && (
          <div className="w-full max-w-3xl space-y-4" id="thought-trajectory-view">
            <div className="p-5 sm:p-6 glass-medium border border-white/90 rounded-3xl shadow-sm space-y-4">
              {/* Header with Sub-mode selector & Attractor Basin Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 font-display text-sm">
                    Latent Thought Trajectory
                  </span>
                  <span className="text-stone-300">|</span>
                  <div className="flex items-center gap-1 bg-stone-100/80 p-0.5 rounded-xl border border-stone-200/60">
                    <button
                      type="button"
                      onClick={() => setTrajectoryMode('waterfall')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        trajectoryMode === 'waterfall'
                          ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Convergence Waterfall
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrajectoryMode('phase_orbit')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        trajectoryMode === 'phase_orbit'
                          ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      2D Phase Orbit
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500 text-xs">Attractor Basin:</span>
                  <span className="text-amber-900 font-bold font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shadow-2xs">
                    E* = {output.energy}
                  </span>
                </div>
              </div>

              {/* Visualization Container */}
              {trajectoryMode === 'waterfall' ? (
                <div className="relative pt-4">
                  {/* Critical Convergence Threshold Guide Line at 0.05 */}
                  <div className="absolute top-[72%] left-2 right-2 flex items-center pointer-events-none z-10">
                    <div className="w-full border-b-2 border-dashed border-emerald-500/70" />
                    <span className="shrink-0 ml-2 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-300/80 px-2 py-0.5 rounded-full shadow-2xs">
                      Threshold θ = 0.05 (Attractor Basin)
                    </span>
                  </div>

                  {/* Interactive Trajectory Bar Chart */}
                  <div className="h-48 flex items-end gap-1.5 sm:gap-2 pt-4 px-2 border-b border-l border-stone-300/80 relative">
                    {output.trajectory.map((point, idx) => {
                      const heightPercent = Math.min(100, Math.max(8, (point.residualDelta / 1.8) * 100));
                      const isCurrent = point.step === animStep + 1;
                      const isSelected = point.step - 1 === selectedTrajectoryStep;
                      const isHovered = point.step - 1 === hoveredStep;
                      const isConverged = point.residualDelta < 0.05;

                      // Multiphase Color Gradient:
                      // Exploratory initial phase -> Radiant sky blue / indigo
                      // Deliberation refinement -> Vibrant amber / orange
                      // Converged basin -> Luminous emerald / jade
                      let barGradient = 'from-sky-500 via-indigo-500 to-blue-600';
                      if (isConverged) {
                        barGradient = 'from-emerald-400 via-teal-500 to-emerald-600 shadow-sm shadow-emerald-500/30';
                      } else if (point.step > 2) {
                        barGradient = 'from-amber-400 via-orange-500 to-amber-600';
                      }

                      return (
                        <div
                          key={point.step}
                          className="flex-1 flex flex-col items-center gap-1 group/bar h-full justify-end cursor-pointer relative"
                          onMouseEnter={() => setHoveredStep(idx)}
                          onMouseLeave={() => setHoveredStep(null)}
                          onClick={() => {
                            setSelectedTrajectoryStep(idx);
                            setAnimStep(idx);
                            setIsPlaying(false);
                          }}
                        >
                          {/* Active Step Indicator Needle */}
                          {isSelected && (
                            <div className="absolute -top-3 text-amber-600 animate-bounce">
                              ▼
                            </div>
                          )}

                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${barGradient} ${
                              isSelected || isHovered
                                ? 'ring-2 ring-amber-500 scale-[1.04] brightness-110 shadow-md'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                          />
                          <span
                            className={`text-[9.5px] font-mono transition-colors ${
                              isSelected
                                ? 'font-bold text-amber-950'
                                : 'text-stone-500 group-hover/bar:text-stone-900'
                            }`}
                          >
                            t{point.step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* 2D Phase Orbit Mode: Spiraling into Attractor Sink */
                <div className="relative h-56 flex items-center justify-center bg-stone-900/5 rounded-2xl border border-stone-200/60 p-3 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <radialGradient id="sinkGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Central Attractor Basin Sink */}
                    <circle cx="200" cy="100" r="45" fill="url(#sinkGlow)" />
                    <circle cx="200" cy="100" r="28" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="200" cy="100" r="6" fill="#059669" />
                    <text x="200" y="122" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-900">
                      Attractor Sink (h*)
                    </text>

                    {/* Spiral trajectory path */}
                    <path
                      d="M 60 40 Q 140 20 230 45 T 310 110 T 220 150 T 160 110 T 200 100"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />

                    {/* Interactive Animated Beacon */}
                    {(() => {
                      const ratio = Math.min(1, (animStep + 1) / maxReasoningSteps);
                      // Parametric spiral approximation
                      const angle = ratio * Math.PI * 3.5;
                      const radius = (1 - ratio) * 110 + 4;
                      const px = 200 + Math.cos(angle) * radius;
                      const py = 100 + Math.sin(angle) * (radius * 0.6);

                      return (
                        <g transform={`translate(${px}, ${py})`} className="transition-all duration-300">
                          <circle cx="0" cy="0" r="10" fill="#EA580C" fillOpacity="0.25" className="animate-ping" />
                          <circle cx="0" cy="0" r="6" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />
                          <text x="0" y="-10" textAnchor="middle" className="text-[9.5px] font-bold font-mono fill-amber-950">
                            t = {animStep + 1}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              )}

              {/* Interactive Step Telemetry Card */}
              <div className="p-3.5 glass-strong rounded-2xl border border-white/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 font-mono font-bold flex items-center justify-center border border-amber-300 shadow-2xs">
                    t{currentInspectPoint.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">
                        Step {currentInspectPoint.step} Telemetry:
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          currentInspectPoint.residualDelta < 0.05
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {currentInspectPoint.residualDelta < 0.05 ? 'Settled in Basin' : 'Active Deliberation'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-stone-600 mt-0.5">
                      <span>Residual Δ: <strong>{currentInspectPoint.residualDelta}</strong></span>
                      <span>Norm ||h||: <strong>{currentInspectPoint.latentNorm.toFixed(3)}</strong></span>
                      <span>Entropy S: <strong>{currentInspectPoint.entropy.toFixed(3)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Scrubber control */}
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 text-[11px]">Scrub:</span>
                  <input
                    type="range"
                    min="0"
                    max={output.trajectory.length - 1}
                    value={selectedTrajectoryStep}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setSelectedTrajectoryStep(s);
                      setAnimStep(s);
                      setIsPlaying(false);
                    }}
                    className="w-24 sm:w-28 accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Color Scheme Legend */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-600 pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-500 to-indigo-600" />
                    <span>Initial Search (t≤2)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-amber-400 to-orange-500" />
                    <span>Recurrent Thinking</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-emerald-400 to-teal-500" />
                    <span>Settled in Basin (&lt;0.05)</span>
                  </span>
                </div>

                <div className="font-mono font-bold text-stone-800">
                  Convergence Step: t = {output.convergenceStep}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Redesigned High-Contrast Interactive Pattern Output */}
        {activeTab === 'arc_grid' && (
          <div className="w-full max-w-2xl flex flex-col items-center space-y-4" id="pattern-output-view">
            {/* Header & Mode Controls */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs bg-white/70 p-3 rounded-2xl border border-white/90 shadow-2xs">
              <div>
                <h4 className="text-sm font-bold text-stone-900 font-display">
                  Visual Pattern Solution (ARC Readout)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Decoded directly from settled continuous state $W_{'{out}'} h^*$ without token generation.
                </p>
              </div>

              {/* Symmetry & Comparison Toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSymmetryGuides((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                    showSymmetryGuides
                      ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs font-semibold'
                      : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                  }`}
                >
                  <Split className="w-3.5 h-3.5 text-amber-600" />
                  <span>Symmetry Guides</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowInputComparison((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                    showInputComparison
                      ? 'bg-sky-50 text-sky-950 border-sky-300 shadow-2xs font-semibold'
                      : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  <span>Compare Input</span>
                </button>
              </div>
            </div>

            {/* Main Grid Area: Side-by-Side or Centered */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              {/* Optional Input Problem Grid */}
              {showInputComparison && (
                <div className="flex flex-col items-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-[11px] font-bold text-stone-600 font-mono bg-white/80 px-2.5 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
                    Input Demonstration (Incomplete)
                  </div>
                  <div className="p-3.5 glass-medium border border-white/90 rounded-3xl shadow-md">
                    <div className="grid grid-cols-4 gap-2 w-44 h-44">
                      {inputProblemGrid.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <div
                            key={`input-${rIdx}-${cIdx}`}
                            className={`rounded-xl border flex items-center justify-center font-mono text-xs font-bold ${getGridColor(
                              val,
                              false,
                              false
                            )}`}
                          >
                            {val > 0 ? val : ''}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showInputComparison && (
                <div className="hidden sm:flex flex-col items-center text-stone-400">
                  <span className="text-xs font-mono font-bold text-amber-800">Recurrence</span>
                  <ArrowRight className="w-6 h-6 text-amber-600 animate-pulse" />
                  <span className="text-[10px] font-mono text-stone-500">T={params.reasoningEffort}</span>
                </div>
              )}

              {/* Primary 4x4 Output Solution Grid */}
              <div className="flex flex-col items-center space-y-2">
                <div className="text-[11px] font-bold text-emerald-900 font-mono bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Decoded Diamond Symmetry (Converged)</span>
                </div>

                <div className="p-4 glass-strong border border-white/90 rounded-3xl shadow-lg relative">
                  {/* Symmetry Mirror Plane Guides (Overlay) */}
                  {showSymmetryGuides && (
                    <div className="absolute inset-4 pointer-events-none z-15">
                      {/* Vertical Mirror Plane */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-amber-500/80 -translate-x-1/2" />
                      {/* Horizontal Mirror Plane */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-amber-500/80 -translate-y-1/2" />
                    </div>
                  )}

                  {/* 4x4 Tiles */}
                  <div className="grid grid-cols-4 gap-2.5 w-52 h-52">
                    {output.gridState.map((row, rIdx) =>
                      row.map((val, cIdx) => {
                        const isSelected = selectedCell?.r === rIdx && selectedCell?.c === cIdx;
                        const isPartner = isCellSymmetricPartner(rIdx, cIdx);

                        return (
                          <div
                            key={`out-${rIdx}-${cIdx}`}
                            id={`grid-cell-${rIdx}-${cIdx}`}
                            onClick={() => {
                              if (selectedCell?.r === rIdx && selectedCell?.c === cIdx) {
                                setSelectedCell(null);
                              } else {
                                setSelectedCell({ r: rIdx, c: cIdx });
                              }
                            }}
                            onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`rounded-xl border transition-all duration-300 flex items-center justify-center font-mono text-sm font-bold cursor-pointer relative ${getGridColor(
                              val,
                              isSelected,
                              isPartner
                            )}`}
                            title={`Cell (${rIdx}, ${cIdx}) - Value: ${val}`}
                          >
                            {val > 0 ? val : ''}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Cell Inspector Card */}
            {selectedCell && (
              <div className="w-full p-3.5 glass-strong rounded-2xl border border-white/90 shadow-sm text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between border-b border-stone-200/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 font-display">
                      Cell ({selectedCell.r}, {selectedCell.c})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono font-bold text-stone-800">
                      Value: {output.gridState[selectedCell.r]?.[selectedCell.c]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCell(null)}
                    className="text-stone-400 hover:text-stone-700 text-[11px]"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white/60 border border-stone-200/60">
                    <span className="text-stone-500 block">Symmetry Pair (V):</span>
                    <strong className="font-mono text-stone-900">
                      ({selectedCell.r}, {3 - selectedCell.c})
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/60 border border-stone-200/60">
                    <span className="text-stone-500 block">Symmetry Pair (H):</span>
                    <strong className="font-mono text-stone-900">
                      ({3 - selectedCell.r}, {selectedCell.c})
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/70">
                    <span className="text-emerald-700 block">Decoded Confidence:</span>
                    <strong className="font-mono text-emerald-950">
                      98.4% (D4 Invariant)
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* ARC Semantic Legend */}
            <div className="flex items-center gap-3 text-[11px] text-stone-600 flex-wrap justify-center">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-stone-900/15 border border-stone-300" />
                <span>0: Background</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gradient-to-br from-sky-400 to-blue-600 border border-sky-300" />
                <span>1: Blue (Symmetry Core)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 border border-emerald-300" />
                <span>2: Green (Vertices)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gradient-to-br from-amber-400 to-orange-600 border border-amber-300" />
                <span>3: Orange (Fills)</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls & Metrics Bar */}
      <div className="p-4 glass-medium border-t border-white/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Playback & Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 border border-white/90 font-medium transition-all shadow-2xs cursor-pointer"
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 border border-white/90 font-medium transition-all shadow-2xs cursor-pointer"
            aria-label="Start over"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>

          {onRun && (
            <button
              type="button"
              onClick={onRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Let's see what happens →</span>
            </button>
          )}

          {onToggleCompare && (
            <button
              type="button"
              onClick={onToggleCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 border border-white/90 font-medium transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Compare with regular AI</span>
            </button>
          )}

          {onExplainChange && (
            <button
              type="button"
              onClick={onExplainChange}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border border-amber-300/60 font-medium transition-all shadow-2xs cursor-pointer backdrop-blur-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Why did this happen?</span>
            </button>
          )}
        </div>

        {/* Live System Telemetry Metrics */}
        <div className="flex items-center gap-3 text-[11px] text-stone-600 flex-wrap">
          <div className="bg-white/80 px-2.5 py-1 rounded-xl border border-white/90 shadow-2xs backdrop-blur-xs">
            <span>Inference Cost: </span>
            <strong className="text-amber-800 font-mono">${output.inferenceCostPerTask.toFixed(5)}/task</strong>
          </div>
          <div className="bg-white/80 px-2.5 py-1 rounded-xl border border-white/90 shadow-2xs backdrop-blur-xs">
            <span>Latency: </span>
            <strong className="text-stone-900 font-mono">{output.latencyMs} ms</strong>
          </div>
          <div className="bg-white/80 px-2.5 py-1 rounded-xl border border-white/90 shadow-2xs backdrop-blur-xs">
            <span>Disentanglement: </span>
            <strong className="text-emerald-700 font-mono">{output.monosemanticityScore}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
