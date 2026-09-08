import React, { useState, useMemo, useEffect } from 'react';
import {
  Brain,
  Activity,
  Sparkles,
  TrendingDown,
  Layers,
  ChevronDown,
  ChevronUp,
  Link2,
  ExternalLink,
  Target,
  ArrowRight,
  Maximize2,
  Minimize2,
  Zap,
} from 'lucide-react';
import { SimulationParams, SimulationOutput } from '../../types';

export interface ConvergencePanelProps {
  currentStep: number;
  maxSteps: number;
  params: SimulationParams;
  output: SimulationOutput;
  selectedNeuronId: string;
  onSelectNeuron: (id: string) => void;
  neuronStates: Record<string, { activation: number; isActive: boolean; isStable: boolean }>;
  residualDelta: number;
  onStepChange?: (step: number) => void;
  reducedMotion?: boolean;
}

export interface MatrixCell {
  id: string;
  row: number;
  col: number;
  name: string;
  symbol: string;
  neuronId?: string; // Links directly to NeuralNetworkVisualizer node
  description: string;
  getValue: (step: number) => number;
}

export type ConvergencePanelViewMode = 'split' | 'matrix' | 'graph';

export const ConvergencePanel: React.FC<ConvergencePanelProps> = ({
  currentStep,
  maxSteps,
  params,
  output,
  selectedNeuronId,
  onSelectNeuron,
  neuronStates,
  residualDelta,
  onStepChange,
  reducedMotion = false,
}) => {
  const [viewMode, setViewMode] = useState<ConvergencePanelViewMode>('split');
  const [showTechnical, setShowTechnical] = useState(false);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);
  const [hoveredGraphStep, setHoveredGraphStep] = useState<number | null>(null);
  const [activeCellId, setActiveCellId] = useState<string>('cell-h1');

  // 3x3 Matrix cells mapped to real simulation dimensions & visualizer neurons
  const matrixCells: MatrixCell[] = useMemo(() => {
    return [
      {
        id: 'cell-input',
        row: 0,
        col: 0,
        name: 'Input Query',
        symbol: 'x_in',
        neuronId: 'input',
        description: 'Input puzzle and demonstration pairs projected into continuous embedding.',
        getValue: (step) => (step === 0 ? 0.92 : 0.45),
      },
      {
        id: 'cell-h0',
        row: 0,
        col: 1,
        name: 'Hub Unit (Neuron 1)',
        symbol: 'h_t^(0)',
        neuronId: 'h0',
        description: 'Central concept hypothesis; re-evaluated each cycle to anchor trajectory.',
        getValue: (step) => {
          if (step === 0) return 0.22;
          const target = 0.94;
          return Number((0.22 + (target - 0.22) * (1 - Math.exp(-0.35 * step))).toFixed(2));
        },
      },
      {
        id: 'cell-h1',
        row: 0,
        col: 2,
        name: 'Symmetry Unit (Neuron 2)',
        symbol: 'h_t^(1)',
        neuronId: 'h1',
        description: 'Geometric invariance detector tracking reflections, rotations, and symmetries.',
        getValue: (step) => {
          if (step === 0) return 0.22;
          const target = 0.88;
          return Number((0.22 + (target - 0.22) * (1 - Math.exp(-0.32 * step))).toFixed(2));
        },
      },
      {
        id: 'cell-h2',
        row: 1,
        col: 0,
        name: 'Boundary Unit (Neuron 3)',
        symbol: 'h_t^(2)',
        neuronId: 'h2',
        description: 'Refines spatial object contours, closures, and fill color mappings.',
        getValue: (step) => {
          if (step === 0) return 0.22;
          const target = 0.84;
          return Number((0.22 + (target - 0.22) * (1 - Math.exp(-0.29 * step))).toFixed(2));
        },
      },
      {
        id: 'cell-norm',
        row: 1,
        col: 1,
        name: 'Latent Vector Norm',
        symbol: '||h_t||',
        description: 'L2 norm magnitude of the entire internal reasoning vector.',
        getValue: (step) => {
          const item = output.trajectory[Math.max(0, step - 1)];
          return item ? Number(item.latentNorm.toFixed(2)) : 1.2;
        },
      },
      {
        id: 'cell-plasticity',
        row: 1,
        col: 2,
        name: 'Synaptic Plasticity',
        symbol: 'ΔW_ij',
        description: 'Hebbian weight updates accumulating correlation across recurrent loops.',
        getValue: (step) => {
          return Number((params.hebbianRate * (1 + Math.min(step, 8) * 0.15)).toFixed(2));
        },
      },
      {
        id: 'cell-mass',
        row: 2,
        col: 0,
        name: 'Topological Center',
        symbol: 'c_mass',
        description: 'Center of activation density across the recurrent latent subspace.',
        getValue: (step) => {
          if (step === 0) return 0.15;
          return Number(Math.min(0.95, 0.2 + step * 0.08).toFixed(2));
        },
      },
      {
        id: 'cell-energy',
        row: 2,
        col: 1,
        name: 'Attractor Basin Depth',
        symbol: 'E(h)',
        description: 'Lyapunov energy level descending monotonically toward a stable basin.',
        getValue: (step) => {
          const initial = 0.95;
          const finalVal = 0.12;
          return Number((finalVal + (initial - finalVal) * Math.exp(-0.3 * step)).toFixed(2));
        },
      },
      {
        id: 'cell-output',
        row: 2,
        col: 2,
        name: 'Output Readout (Answer)',
        symbol: 'y_out',
        neuronId: 'output',
        description: 'Zero-token final solution projection decoded from the settled latent vector.',
        getValue: (step) => {
          if (step < 3) return 0.12;
          const ratio = Math.min(1, step / (output.convergenceStep || 8));
          return Number((0.15 + 0.8 * ratio).toFixed(2));
        },
      },
    ];
  }, [params.hebbianRate, output.trajectory, output.convergenceStep]);

  // Sync activeCellId when selectedNeuronId changes from the outside (NeuralNetworkVisualizer)
  useEffect(() => {
    if (selectedNeuronId) {
      const match = matrixCells.find((c) => c.neuronId === selectedNeuronId);
      if (match) {
        setActiveCellId(match.id);
      }
    }
  }, [selectedNeuronId, matrixCells]);

  // Current values and previous step values for delta calculations
  const currentValues = useMemo(() => {
    return matrixCells.map((c) => c.getValue(currentStep));
  }, [matrixCells, currentStep]);

  const prevValues = useMemo(() => {
    return matrixCells.map((c) => c.getValue(Math.max(0, currentStep - 1)));
  }, [matrixCells, currentStep]);

  // Delta between previous and current step in matrix
  const cellDeltas = useMemo(() => {
    return currentValues.map((v, i) => Math.abs(v - prevValues[i]));
  }, [currentValues, prevValues]);

  // Active cell object for detailed inspector
  const activeCell = useMemo(() => {
    return matrixCells.find((c) => c.id === activeCellId) || matrixCells[2];
  }, [matrixCells, activeCellId]);

  // Compute Delta State history across all steps using trajectory data
  const deltaHistory = useMemo(() => {
    return output.trajectory.slice(0, Math.min(output.trajectory.length, 6)).map((item) => {
      const fromStep = item.step;
      const toStep = item.step + 1;
      const deltaVal = item.residualDelta;
      return {
        label: `Step ${fromStep} → ${toStep}`,
        step: fromStep,
        val: deltaVal,
      };
    });
  }, [output.trajectory]);

  // Convergence graph points from output.trajectory
  const graphPoints = useMemo(() => {
    return output.trajectory.map((p) => ({
      step: p.step,
      delta: p.residualDelta,
    }));
  }, [output.trajectory]);

  // Trend interpretation from actual delta data
  const graphTrend = useMemo(() => {
    if (graphPoints.length < 2) return { status: 'settling', text: 'The system is settling.', badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300' };
    const first = graphPoints[0]?.delta ?? 1;
    const last = graphPoints[graphPoints.length - 1]?.delta ?? 0.05;
    const isDecreasing = last < first * 0.4;
    const hasSpikes = graphPoints.some((p, i) => i > 0 && p.delta > (graphPoints[i - 1]?.delta ?? 0) * 1.5);

    if (hasSpikes && params.noiseLevel > 0.15) {
      return {
        status: 'oscillating',
        text: 'Fluctuating / Perturbed',
        badgeClass: 'bg-amber-100/80 text-amber-900 border-amber-300',
      };
    }
    if (isDecreasing) {
      return {
        status: 'settling',
        text: 'Settling into Attractor',
        badgeClass: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
      };
    }
    return {
      status: 'changing',
      text: 'Iterating Trajectory',
      badgeClass: 'bg-sky-100/80 text-sky-900 border-sky-300',
    };
  }, [graphPoints, params.noiseLevel]);

  // Handle clicking a matrix cell -> sets active cell and fires bi-directional event to Visualizer
  const handleCellClick = (cell: MatrixCell) => {
    setActiveCellId(cell.id);
    if (cell.neuronId) {
      onSelectNeuron(cell.neuronId);
    }
  };

  // SVG dimensions for Convergence Graph
  const svgWidth = viewMode === 'graph' ? 620 : 340;
  const svgHeight = viewMode === 'graph' ? 220 : 155;
  const padding = { top: 20, right: 24, bottom: 28, left: 42 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const maxDelta = 1.0;
  const cutoffThreshold = 0.05;
  const cutoffY = padding.top + chartH - (cutoffThreshold / maxDelta) * chartH;

  const pointsString = graphPoints
    .map((p) => {
      const x = padding.left + ((p.step - 1) / Math.max(1, maxSteps - 1)) * chartW;
      const y = padding.top + chartH - (Math.min(maxDelta, p.delta) / maxDelta) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Area polygon under the curve for lush liquid effect
  const areaPolygonString = useMemo(() => {
    if (graphPoints.length === 0) return '';
    const firstX = padding.left;
    const lastX = padding.left + ((graphPoints[graphPoints.length - 1].step - 1) / Math.max(1, maxSteps - 1)) * chartW;
    const baseY = padding.top + chartH;
    return `${pointsString} ${lastX.toFixed(1)},${baseY} ${firstX},${baseY}`;
  }, [graphPoints, pointsString, maxSteps, chartW, chartH, padding.left, padding.top]);

  // Current step marker position on graph
  const currentStepPoint = useMemo(() => {
    if (currentStep === 0) return null;
    const p = graphPoints.find((item) => item.step === currentStep);
    if (!p) return null;
    const x = padding.left + ((p.step - 1) / Math.max(1, maxSteps - 1)) * chartW;
    const y = padding.top + chartH - (Math.min(maxDelta, p.delta) / maxDelta) * chartH;
    return { x, y, delta: p.delta };
  }, [currentStep, graphPoints, maxSteps, chartW, chartH, padding]);

  // Quick switchable neurons for direct visualizer linking
  const linkedNeurons = [
    { id: 'input', label: 'Input', symbol: 'x_in', cellId: 'cell-input' },
    { id: 'h0', label: 'Neuron 1', symbol: 'h^(0)', cellId: 'cell-h0' },
    { id: 'h1', label: 'Neuron 2', symbol: 'h^(1)', cellId: 'cell-h1' },
    { id: 'h2', label: 'Neuron 3', symbol: 'h^(2)', cellId: 'cell-h2' },
    { id: 'output', label: 'Answer', symbol: 'y_out', cellId: 'cell-output' },
  ];

  return (
    <div
      className="p-5 sm:p-7 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 glass-specular relative overflow-hidden transition-all duration-300"
      id="convergence-panel-container"
    >
      {/* Subtle Specular Top Arc Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

      {/* 1. Header Toolbar with Title, Telemetry, and View Mode Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/80 text-amber-800 flex items-center justify-center shadow-2xs">
              <Brain className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-display tracking-tight">
              Convergence Panel
            </h3>
            {/* Bi-directional Link Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <Link2 className="w-3 h-3 text-amber-700" />
              <span>Bi-Directional Link Active</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
            Unified matrix state and attractor trajectory. Click any matrix cell or visualizer neuron to inspect linked activations.
          </p>
        </div>

        {/* View Mode Switcher + Live Delta Pill */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {/* Live Residual Delta */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-stone-200/80 shadow-2xs font-mono text-xs text-stone-800">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Δ State:</span>
            <span className="font-bold text-amber-900">{residualDelta.toFixed(3)}</span>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 p-1 bg-white/80 rounded-xl border border-stone-200/80 shadow-2xs text-xs">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="View Matrix and Graph side-by-side"
            >
              Unified
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Focus on Matrix"
            >
              Matrix
            </button>
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Focus on Graph"
            >
              Graph
            </button>
          </div>
        </div>
      </div>

      {/* 2. Bi-directional Synchronization Quick Bar */}
      <div className="p-3 rounded-2xl glass-medium border border-white/95 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <Target className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Synchronized Neurons:</span>
        </div>

        {/* Interactive Quick Links to All 5 Representative Neurons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {linkedNeurons.map((n) => {
            const isSelected = selectedNeuronId === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  onSelectNeuron(n.id);
                  setActiveCellId(n.cellId);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs scale-105 ring-2 ring-amber-300'
                    : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200/80'
                }`}
              >
                <span className="font-mono text-[10px] opacity-85">{n.symbol}</span>
                <span>{n.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content: Matrix & Graph Layout based on viewMode */}
      <div
        className={`grid gap-6 items-start ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1'
        }`}
      >
        {/* LEFT: THE INTERACTIVE CONVERGENCE MATRIX */}
        {(viewMode === 'split' || viewMode === 'matrix') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'w-full'} space-y-4`}>
            {/* Matrix Header */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>3×3 State Space Matrix (Step {currentStep})</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Click cell to link with neuron
              </span>
            </div>

            {/* 3x3 Grid with Liquid Glass Styling and Bi-Directional Highlight */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-stone-200/70 shadow-inner space-y-2.5">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {matrixCells.map((cell, idx) => {
                  const val = currentValues[idx];
                  const delta = cellDeltas[idx];
                  const isNeuronLinked = !!cell.neuronId;
                  const isSelected = isNeuronLinked && cell.neuronId === selectedNeuronId;
                  const isActiveCell = activeCellId === cell.id;
                  const hasChangedSignificantly = currentStep > 0 && delta >= 0.05;
                  const isSettled = currentStep > 0 && delta < 0.02;

                  return (
                    <button
                      key={cell.id}
                      id={`matrix-${cell.id}`}
                      type="button"
                      onClick={() => handleCellClick(cell)}
                      onMouseEnter={() => setHoveredCellId(cell.id)}
                      onMouseLeave={() => setHoveredCellId(null)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-300 focus:outline-hidden cursor-pointer group ${
                        isSelected
                          ? 'bg-amber-100/95 border-2 border-amber-500 shadow-md ring-3 ring-amber-300/50 scale-[1.03] z-10'
                          : isActiveCell
                          ? 'bg-amber-50/95 border-2 border-amber-400 shadow-sm ring-2 ring-amber-200/50 scale-[1.01]'
                          : hasChangedSignificantly
                          ? 'bg-amber-50/70 border border-amber-300/70 shadow-2xs hover:bg-amber-100/60'
                          : isSettled
                          ? 'bg-teal-50/60 border border-teal-200/70 hover:bg-teal-100/50'
                          : 'bg-white/90 border border-stone-200/80 hover:border-amber-300 hover:bg-white shadow-2xs'
                      }`}
                    >
                      {/* Top Specular Sheen for selected cell */}
                      {isSelected && (
                        <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />
                      )}

                      {/* Header of Cell */}
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-mono text-stone-600 font-bold bg-stone-100 px-1.5 py-0.5 rounded-md">
                          {cell.symbol}
                        </span>
                        {isSelected ? (
                          <span className="text-[9px] font-bold text-amber-950 bg-amber-300/90 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-ping" />
                            Active
                          </span>
                        ) : isNeuronLinked ? (
                          <span className="text-[9px] font-medium text-stone-500 bg-stone-100/90 px-1 rounded-sm">
                            Neuron
                          </span>
                        ) : null}
                      </div>

                      {/* Cell Title */}
                      <div className="text-[11px] font-bold text-stone-900 truncate" title={cell.name}>
                        {cell.name}
                      </div>

                      {/* Cell Numerical Value */}
                      <div className="mt-1.5 flex items-baseline justify-between font-mono">
                        <span
                          className={`text-base sm:text-lg font-extrabold transition-all duration-300 ${
                            isSelected
                              ? 'text-amber-950'
                              : hasChangedSignificantly
                              ? 'text-amber-800'
                              : isSettled
                              ? 'text-teal-800'
                              : 'text-stone-800'
                          }`}
                        >
                          {val.toFixed(2)}
                        </span>

                        {currentStep > 0 && (
                          <span
                            className={`text-[10px] font-bold ${
                              delta >= 0.05
                                ? 'text-amber-700'
                                : 'text-stone-400'
                            }`}
                          >
                            Δ{delta.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Bi-Directional Indicator Footnote */}
                      {isNeuronLinked && (
                        <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-stone-500 font-medium">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-amber-600' : 'bg-stone-400'
                            }`}
                          />
                          <span>Node: {cell.neuronId}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Cell Explanation Card */}
            {activeCell && (
              <div className="p-3.5 rounded-2xl glass-medium border border-white/90 shadow-xs space-y-1.5 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{activeCell.name}</span>
                    <span className="font-mono text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60 text-[11px]">
                      {activeCell.symbol}
                    </span>
                  </div>
                  {activeCell.neuronId && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Link2 className="w-2.5 h-2.5 text-amber-700" />
                      Visualizer Link: {activeCell.neuronId}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 text-[11.5px] leading-relaxed">
                  {activeCell.description}
                </p>
              </div>
            )}

            {/* Matrix Delta Progression Strip across Recent Steps */}
            <div className="space-y-2 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/70 text-xs">
              <div className="flex items-center justify-between text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-stone-600" />
                  <span>State Difference History (Δ)</span>
                </div>
                <span className="text-teal-800 font-semibold text-[10px]">
                  Norm decay: ||h_(t+1) - h_t|| → 0
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                {deltaHistory.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onStepChange && onStepChange(item.step)}
                    className={`p-2 rounded-xl bg-white border text-center space-y-0.5 transition-all cursor-pointer ${
                      currentStep === item.step
                        ? 'border-amber-500 bg-amber-50/80 shadow-2xs font-bold'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-[10px] text-stone-500 font-sans">{item.label}</div>
                    <div className="text-xs font-bold text-amber-900">{item.val.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT: THE CONVERGENCE TRAJECTORY GRAPH & EXPLANATION */}
        {(viewMode === 'split' || viewMode === 'graph') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'w-full'} space-y-4`}>
            {/* Graph Card */}
            <div className="space-y-3 bg-white/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-2xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Convergence Trajectory Curve</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    State change ||h_(t+1) - h_t|| vs Reasoning Cycles
                  </p>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${graphTrend.badgeClass}`}
                >
                  {graphTrend.text}
                </span>
              </div>

              {/* Dynamic SVG Convergence Graph */}
              <div className="w-full flex justify-center pt-2">
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="overflow-visible select-none"
                  role="img"
                  aria-label="Convergence Line Graph"
                >
                  <defs>
                    {/* Linear Gradient for Line Curve */}
                    <linearGradient id="convergenceLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D97706" />
                      <stop offset="60%" stopColor="#0D9488" />
                      <stop offset="100%" stopColor="#0F766E" />
                    </linearGradient>

                    {/* Area fill gradient */}
                    <linearGradient id="convergenceAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-axis grid lines */}
                  <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={svgWidth - padding.right}
                    y2={padding.top}
                    stroke="#E2E8F0"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={padding.left}
                    y1={padding.top + chartH / 2}
                    x2={svgWidth - padding.right}
                    y2={padding.top + chartH / 2}
                    stroke="#E2E8F0"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={padding.left}
                    y1={padding.top + chartH}
                    x2={svgWidth - padding.right}
                    y2={padding.top + chartH}
                    stroke="#CBD5E1"
                  />

                  {/* Convergence Attractor Cutoff Guide Line at delta = 0.05 */}
                  <line
                    x1={padding.left}
                    y1={cutoffY}
                    x2={svgWidth - padding.right}
                    y2={cutoffY}
                    stroke="#0D9488"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                    opacity="0.85"
                  />
                  <text
                    x={svgWidth - padding.right}
                    y={cutoffY - 4}
                    textAnchor="end"
                    className="text-[9px] fill-teal-800 font-mono font-semibold"
                  >
                    Attractor Threshold (0.05)
                  </text>

                  {/* Y-axis labels */}
                  <text x={padding.left - 6} y={padding.top + 4} textAnchor="end" className="text-[9px] fill-stone-400 font-mono">
                    1.0
                  </text>
                  <text x={padding.left - 6} y={padding.top + chartH / 2 + 3} textAnchor="end" className="text-[9px] fill-stone-400 font-mono">
                    0.5
                  </text>
                  <text x={padding.left - 6} y={padding.top + chartH + 3} textAnchor="end" className="text-[9px] fill-stone-400 font-mono">
                    0.0
                  </text>

                  {/* Area fill under curve */}
                  {areaPolygonString && (
                    <polygon
                      points={areaPolygonString}
                      fill="url(#convergenceAreaGrad)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Polyline Curve */}
                  <polyline
                    fill="none"
                    stroke="url(#convergenceLineGrad)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Interactive Points */}
                  {graphPoints.map((p) => {
                    const cx = padding.left + ((p.step - 1) / Math.max(1, maxSteps - 1)) * chartW;
                    const cy = padding.top + chartH - (Math.min(maxDelta, p.delta) / maxDelta) * chartH;
                    const isCurrent = p.step === currentStep;
                    const isHovered = p.step === hoveredGraphStep;

                    return (
                      <g
                        key={p.step}
                        className="cursor-pointer"
                        onClick={() => onStepChange && onStepChange(p.step)}
                        onMouseEnter={() => setHoveredGraphStep(p.step)}
                        onMouseLeave={() => setHoveredGraphStep(null)}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isCurrent ? 6 : isHovered ? 5 : 3.5}
                          fill={isCurrent ? '#F59E0B' : '#0D9488'}
                          stroke="#FFFFFF"
                          strokeWidth={isCurrent ? 2.5 : 1.5}
                          className="transition-all duration-200"
                        />
                        {/* Invisible larger hit target for smooth clicking */}
                        <circle cx={cx} cy={cy} r="14" fill="transparent" />
                      </g>
                    );
                  })}

                  {/* Current Step Active Guide Marker with Radar Ping */}
                  {currentStepPoint && (
                    <g>
                      <line
                        x1={currentStepPoint.x}
                        y1={padding.top}
                        x2={currentStepPoint.x}
                        y2={padding.top + chartH}
                        stroke="#F59E0B"
                        strokeDasharray="2 2"
                        strokeWidth="1.4"
                      />
                      <circle
                        cx={currentStepPoint.x}
                        cy={currentStepPoint.y}
                        r="9"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="1.8"
                        opacity="0.7"
                        className={reducedMotion ? '' : 'animate-ping'}
                      />
                    </g>
                  )}

                  {/* X-axis labels */}
                  <text x={padding.left} y={svgHeight - 6} textAnchor="middle" className="text-[9.5px] fill-stone-500 font-mono font-medium">
                    t=1
                  </text>
                  <text x={padding.left + chartW / 2} y={svgHeight - 6} textAnchor="middle" className="text-[9.5px] fill-stone-500 font-mono font-medium">
                    t={Math.round(maxSteps / 2)}
                  </text>
                  <text x={padding.left + chartW} y={svgHeight - 6} textAnchor="middle" className="text-[9.5px] fill-stone-500 font-mono font-medium">
                    t={maxSteps}
                  </text>
                </svg>
              </div>

              {/* Step Navigation Hint */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span>Hover or click any node point to jump to that step</span>
                <span className="font-mono font-bold text-amber-950">
                  Current Step: {currentStep} / {maxSteps}
                </span>
              </div>
            </div>

            {/* Beginner-Friendly Concept Explanation */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs text-stone-800 shadow-2xs">
              <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>WHAT IS CONVERGENCE?</span>
              </div>
              <p className="leading-relaxed font-normal">
                Convergence means the neural state settles into an equilibrium. Each recurrent cycle refines the internal state until change drops below the attractor threshold.
              </p>
              <div className="pt-1 flex items-center justify-between font-semibold text-amber-950 text-[11.5px]">
                <span>Fixed-point equilibrium: h* = f(h*, x)</span>
                <span className="text-teal-800">No token generation required</span>
              </div>
            </div>

            {/* Collapsible Mathematical Formulation */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowTechnical((prev) => !prev)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{showTechnical ? 'Hide technical formulation' : 'Show technical formulation →'}</span>
                {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTechnical && (
                <div className="mt-3 p-4 rounded-2xl bg-white/90 border border-stone-200/80 text-xs space-y-2.5 font-mono text-stone-800 shadow-sm animate-in fade-in duration-200">
                  <div className="font-bold text-stone-900 font-sans border-b border-stone-200/60 pb-1 flex justify-between items-center">
                    <span>Mathematical Fixed-Point Formulation</span>
                    <span className="text-[10px] text-amber-800 font-mono">Lyapunov Descent</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl text-amber-950 text-center font-bold text-sm">
                    h(t+1) = Π_{`{≥θ}`}(W · h(t) + W_in · x)
                  </div>
                  <div className="space-y-1 text-[11px] font-sans text-stone-600">
                    <div className="flex justify-between">
                      <span className="font-mono text-stone-900 font-bold">h(t)</span>
                      <span>Current latent thought vector</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-stone-900 font-bold">h(t+1)</span>
                      <span>Updated recurrent state vector</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-amber-800 font-bold">||h(t+1) - h(t)|| &lt; 0.05</span>
                      <span>Attractor basin convergence criterion</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
