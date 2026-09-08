import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Brain,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Info,
  Sliders,
  Activity,
  Zap,
  Check,
  TrendingDown,
  Link2,
} from 'lucide-react';
import { SimulationParams, SimulationOutput } from '../types';
import { runSimulation } from '../services/simulationEngine';
import { ReasoningProgressBar } from './neural/ReasoningProgressBar';
import { SimulatorControlPanel } from './neural/SimulatorControlPanel';
import { WhatHappenedBanner } from './neural/WhatHappenedBanner';
import { ConvergencePanel } from './neural/ConvergencePanel';
import { DynamicReasoningTest } from './neural/DynamicReasoningTest';

interface NeuralNetworkVisualizerProps {
  params: SimulationParams;
  output: SimulationOutput;
  reducedMotion?: boolean;
  onParamsChange?: (params: SimulationParams) => void;
}

export type ViewMode = 'simple' | 'technical';
export type TechnicalSubView = 'circuit' | 'attractor';

interface SimplifiedNeuron {
  id: string;
  simpleName: string;
  simpleRole: string;
  simpleDescription: string;
  technicalName: string;
  technicalMath: string;
  category: string;
  role: 'input' | 'latent' | 'output';
  baseActivation: number;
  x: number;
  y: number;
}

export const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = ({
  params,
  output,
  reducedMotion = false,
  onParamsChange,
}) => {
  // Mode selection: Default to 'simple' for immediate educational clarity
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [techSubView, setTechSubView] = useState<TechnicalSubView>('circuit');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('h1');
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [showTechDetailsInInspector, setShowTechDetailsInInspector] = useState<boolean>(false);

  // Live simulation parameters driven by Simulator Control Panel
  const [activeParams, setActiveParams] = useState<SimulationParams>(params);
  const [speedMs, setSpeedMs] = useState<number>(850);

  // Sync if props change externally
  useEffect(() => {
    setActiveParams(params);
  }, [params]);

  // Compute active simulation output in real-time from activeParams
  const activeOutput = useMemo(() => {
    return runSimulation(activeParams);
  }, [activeParams]);

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setActiveParams((prev) => {
      const updated = { ...prev, [key]: value };
      if (onParamsChange) {
        onParamsChange(updated);
      }
      return updated;
    });
  };

  // Recurrence Step Navigation: t in [0, activeParams.reasoningEffort]
  const maxSteps = Math.max(1, activeParams.reasoningEffort || 12);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pulseTick, setPulseTick] = useState<number>(0);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track previous step and delta for What Happened banner
  const [prevStep, setPrevStep] = useState<number>(0);
  const [prevDelta, setPrevDelta] = useState<number>(0.95);
  const prevStepRef = useRef<number>(0);
  const prevDeltaRef = useRef<number>(0.95);

  // Single smooth clock for information signal flow
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setPulseTick((t) => (t + 1) % 120);
    }, 35);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Playback timer with dynamic speedMs
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return maxSteps;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, maxSteps, speedMs]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(maxSteps, prev + 1));
  };

  const handleAdvanceSteps = (count: number) => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(maxSteps, prev + count));
  };

  // State metrics
  const convergenceTargetStep = Math.min(maxSteps, activeOutput.convergenceStep || 8);
  const isConverged = currentStep >= convergenceTargetStep;

  // Single intuitive metric: State Stability %
  const stabilityPercent = useMemo(() => {
    if (currentStep === 0) return 18;
    if (isConverged) return 100;
    const progress = currentStep / convergenceTargetStep;
    return Math.min(96, Math.round(20 + 78 * Math.sqrt(progress)));
  }, [currentStep, convergenceTargetStep, isConverged]);

  // Technical residual delta decay ||h_{t+1} - h_t||
  const residualDelta = useMemo(() => {
    if (currentStep === 0) return 0.95;
    const base = 0.95 * Math.exp(-0.28 * currentStep);
    return Math.max(0.012, Number(base.toFixed(3)));
  }, [currentStep]);

  // Update previous step and delta tracker
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      setPrevStep(prevStepRef.current);
      setPrevDelta(prevDeltaRef.current);
      prevStepRef.current = currentStep;
      prevDeltaRef.current = residualDelta;
    }
  }, [currentStep, residualDelta]);

  // Technical Lyapunov energy descent
  const currentEnergy = useMemo(() => {
    const initialEnergy = 14.8;
    const targetEnergy = Math.max(1.2, activeOutput.energy || 2.4);
    const e = initialEnergy - (initialEnergy - targetEnergy) * (1 - Math.exp(-0.25 * currentStep));
    return Number(e.toFixed(2));
  }, [currentStep, activeOutput.energy]);

  // 5 Representative Neurons: Clean, minimal, and mathematically grounded
  const neurons: SimplifiedNeuron[] = useMemo(() => {
    return [
      {
        id: 'input',
        simpleName: 'Input',
        simpleRole: 'Task & Demonstrations',
        simpleDescription: 'Receives the visual puzzle and demonstration pairs, projecting them directly into continuous numbers.',
        technicalName: 'Task Query Continuous Embedding',
        technicalMath: 'W_{in} q + K \\text{ demos}',
        category: 'Input Layer',
        role: 'input',
        baseActivation: 0.92,
        x: 75,
        y: 155,
      },
      {
        id: 'h0',
        simpleName: 'Neuron 1',
        simpleRole: 'Core Concept Hub',
        simpleDescription: 'Holds the central hypothesis. Re-evaluates each cycle to anchor the reasoning trajectory.',
        technicalName: 'Attractor Hub Unit (h_t^{(0)})',
        technicalMath: 'h_t^{(0)}',
        category: 'Latent Reasoning State',
        role: 'latent',
        baseActivation: 0.94,
        x: 200,
        y: 155,
      },
      {
        id: 'h1',
        simpleName: 'Neuron 2',
        simpleRole: 'Symmetry & Rules',
        simpleDescription: 'Detects reflections, rotations, and transformation rules across grid cells without verbal prompt steps.',
        technicalName: 'Symmetry Invariance Unit (h_t^{(1)})',
        technicalMath: 'h_t^{(1)}',
        category: 'Latent Reasoning State',
        role: 'latent',
        baseActivation: 0.88,
        x: 310,
        y: 155,
      },
      {
        id: 'h2',
        simpleName: 'Neuron 3',
        simpleRole: 'Shapes & Filling',
        simpleDescription: 'Refines object boundaries, closed contours, and color mappings until the pattern is consistent.',
        technicalName: 'Topology & Boundary Unit (h_t^{(2)})',
        technicalMath: 'h_t^{(2)}',
        category: 'Latent Reasoning State',
        role: 'latent',
        baseActivation: 0.84,
        x: 420,
        y: 155,
      },
      {
        id: 'output',
        simpleName: 'Answer',
        simpleRole: 'Final Grid Solution',
        simpleDescription: 'Decodes the settled internal thoughts into the concrete solution matrix with zero verbal token overhead.',
        technicalName: 'Zero-Token Solution Readout',
        technicalMath: 'W_{out} h^*',
        category: 'Output Readout',
        role: 'output',
        baseActivation: 0.95,
        x: 565,
        y: 155,
      },
    ];
  }, []);

  // Compute activation states for each neuron at currentStep
  const neuronStates = useMemo(() => {
    const states: Record<string, { activation: number; isActive: boolean; isStable: boolean }> = {};
    neurons.forEach((n) => {
      let act = 0;
      if (n.role === 'input') {
        act = n.baseActivation;
      } else if (n.role === 'latent') {
        if (currentStep === 0) {
          act = 0.22; // Baseline rest
        } else {
          // Activation sharpens and aligns as reasoning effort increases
          const stepFactor = Math.min(1, currentStep * 0.24);
          act = Math.min(0.98, n.baseActivation * stepFactor + activeParams.hebbianRate * 0.4);
        }
      } else if (n.role === 'output') {
        if (isConverged) {
          act = n.baseActivation;
        } else if (currentStep > 2) {
          act = n.baseActivation * (currentStep / convergenceTargetStep) * 0.6;
        } else {
          act = 0.12;
        }
      }

      const isActive = act >= activeParams.sparsityThreshold || n.role === 'input';
      const isStable = isConverged && (n.role === 'latent' || n.role === 'output');

      states[n.id] = {
        activation: Number(act.toFixed(2)),
        isActive,
        isStable,
      };
    });
    return states;
  }, [neurons, currentStep, activeParams.sparsityThreshold, activeParams.hebbianRate, isConverged, convergenceTargetStep]);

  // Selected neuron inspector
  const activeNeuron = useMemo(() => {
    return neurons.find((n) => n.id === selectedNodeId) || neurons[1]; // default h0
  }, [neurons, selectedNodeId]);

  const activeNeuronState = neuronStates[activeNeuron.id] || { activation: 0.5, isActive: false, isStable: false };

  // Dynamic narrative sentence explaining what happens right now
  const dynamicStorySentence = useMemo(() => {
    if (currentStep === 0) {
      return '1. Input enters: The visual problem and demonstrations enter the neural network.';
    }
    if (currentStep === 1) {
      return '2. Initial thought: Neurons activate an initial internal hypothesis in continuous latent space.';
    }
    if (!isConverged) {
      return `3. Think again (Cycle ${currentStep} of ${maxSteps}): The recurrent loop passes the state back through the neurons, filtering noise and resolving contradictions.`;
    }
    return `4. Stable state reached (Cycle ${currentStep}): Internal thoughts have settled into a stable attractor minimum. The final answer is decoded at zero token cost.`;
  }, [currentStep, maxSteps, isConverged]);

  // Single Signal Animation Position: Clear, slow, trackable bead
  const signalPos = useMemo(() => {
    if (reducedMotion) return null;

    const t = (pulseTick % 100) / 100; // 0 to 1

    if (currentStep === 0) {
      // Input -> Neuron 1
      return {
        x: 75 + t * (200 - 75),
        y: 155,
        color: '#0284C7', // Distinct Azure / Sky blue input signal
      };
    }

    if (!isConverged) {
      // Active thinking: Travels along the Recurrent Loop and through latent neurons in Radiant Gold
      // Segment 1 (t in [0, 0.45]): Forward through latent neurons 200 -> 420
      // Segment 2 (t in [0.45, 1.0]): Up and back through the recurrent loop arch 420 -> 200
      if (t < 0.45) {
        const segT = t / 0.45;
        return {
          x: 200 + segT * (430 - 200),
          y: 155,
          color: '#EAB308', // Warm Gold thinking signal
        };
      } else {
        const segT = (t - 0.45) / 0.55;
        // Bezier arch M 430 135 C 430 40, 200 40, 200 135
        const u = 1 - segT;
        const p0 = { x: 430, y: 135 };
        const p1 = { x: 430, y: 40 };
        const p2 = { x: 200, y: 40 };
        const p3 = { x: 200, y: 135 };
        const bx = u * u * u * p0.x + 3 * u * u * segT * p1.x + 3 * u * segT * segT * p2.x + segT * segT * segT * p3.x;
        const by = u * u * u * p0.y + 3 * u * u * segT * p1.y + 3 * u * segT * segT * p2.y + segT * segT * segT * p3.y;
        return {
          x: bx,
          y: by,
          color: '#D97706', // Radiant Gold loop return
        };
      }
    }

    // Converged: Signal flows smoothly through settled Teal latent core to Answer
    // Segment 1 (t in [0, 0.5]): In settled teal core
    // Segment 2 (t in [0.5, 1.0]): Exits into Answer (420 -> 565)
    if (t < 0.5) {
      return {
        x: 200 + t * 2 * (420 - 200),
        y: 155,
        color: '#0D9488', // Luminous Teal stable signal
      };
    } else {
      const segT = (t - 0.5) / 0.5;
      return {
        x: 420 + segT * (565 - 420),
        y: 155,
        color: '#7C3AED', // Royal Violet answer readout
      };
    }
  }, [pulseTick, currentStep, isConverged, reducedMotion]);

  // Position of moving thought dot in Attractor Phase Basin view
  const attractorThoughtPos = useMemo(() => {
    // Starts at top-left (190, 80) and smoothly converges to attractor basin (320, 155)
    const ratio = Math.min(1, currentStep / Math.max(1, convergenceTargetStep));
    const startX = 190;
    const startY = 85;
    const targetX = 320;
    const targetY = 155;
    // Spiral dampening curve
    const currentX = startX + (targetX - startX) * ratio;
    const currentY = startY + (targetY - startY) * ratio + Math.sin(ratio * Math.PI * 2) * (1 - ratio) * 22;
    return { x: currentX, y: currentY };
  }, [currentStep, convergenceTargetStep]);

  // Trajectory activity peaks and dynamic line thickness during thinking cycles
  const trajectoryDynamics = useMemo(() => {
    const isThinking = currentStep > 0 && !isConverged;
    if (reducedMotion) {
      return {
        peakInput: 0,
        peak2a: 0,
        peak2b: 0,
        peakLoop: 0,
        peakOutput: 0,
        thicknessInput: currentStep === 0 ? 2.5 : 1.5,
        thickness2a: isConverged ? 2.4 : isThinking ? 2.6 : 1.2,
        thickness2b: isConverged ? 2.4 : isThinking ? 2.6 : 1.2,
        thicknessLoop: isConverged ? 2.5 : isThinking ? 3.4 : 1.8,
        thicknessOutput: isConverged ? 2.8 : 1.5,
      };
    }

    const t = (pulseTick % 100) / 100; // 0 to 1

    // Peak activity factors (0 to 1) for each trajectory segment
    const peakInput = currentStep === 0 ? Math.max(0, 1 - Math.abs(t - 0.5) / 0.45) : 0;
    
    // Latent 1 -> 2 (traversed during t in [0, 0.22])
    const peak2a = isThinking ? Math.max(0, 1 - Math.abs(t - 0.11) / 0.13) : 0;
    
    // Latent 2 -> 3 (traversed during t in [0.22, 0.45])
    const peak2b = isThinking ? Math.max(0, 1 - Math.abs(t - 0.33) / 0.13) : 0;
    
    // Recurrent loop arch (traversed during t in [0.45, 1.0])
    const peakLoop = isThinking ? Math.max(0, 1 - Math.abs(t - 0.72) / 0.26) : 0;
    
    // Output (traversed during t in [0.5, 1.0] when converged)
    const peakOutput = isConverged && t >= 0.5 ? Math.max(0, 1 - Math.abs(t - 0.75) / 0.24) : 0;

    return {
      peakInput,
      peak2a,
      peak2b,
      peakLoop,
      peakOutput,
      thicknessInput: Number((currentStep === 0 ? 2.5 + peakInput * 1.3 : 1.5).toFixed(2)),
      thickness2a: Number((isConverged ? 2.4 : isThinking ? 2.5 + peak2a * 1.6 : 1.2).toFixed(2)),
      thickness2b: Number((isConverged ? 2.4 : isThinking ? 2.5 + peak2b * 1.6 : 1.2).toFixed(2)),
      thicknessLoop: Number((isConverged ? 2.5 : isThinking ? 3.2 + peakLoop * 1.8 : 1.8).toFixed(2)),
      thicknessOutput: Number((isConverged ? 2.8 + peakOutput * 1.4 : 1.5).toFixed(2)),
    };
  }, [pulseTick, currentStep, isConverged, reducedMotion]);

  return (
    <div className="w-full flex flex-col space-y-6" id="thinkloop-neural-experience">
      {/* 1. Reasoning Progress Bar (Prominently Placed at the Top) */}
      <ReasoningProgressBar
        currentStep={currentStep}
        maxSteps={maxSteps}
        isConverged={isConverged}
        convergenceStep={convergenceTargetStep}
        onStepClick={(step) => {
          setIsPlaying(false);
          setCurrentStep(step);
        }}
        residualDelta={residualDelta}
      />

      {/* 2. Desktop 2-Column Section: Neural Visualization (Left) + Simulator Control Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Neural Network Visualizer + Mode Selectors + Inspector */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* View Mode Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-white/90 shadow-2xs">
            {/* View Mode Toggle (Simple View vs Technical View) */}
            <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-xl border border-white/90 shadow-2xs">
              <button
                type="button"
                id="btn-simple-view"
                onClick={() => setViewMode('simple')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'simple'
                    ? 'bg-white text-stone-900 shadow-xs border border-white/95'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Simple View</span>
              </button>

              <button
                type="button"
                id="btn-technical-view"
                onClick={() => setViewMode('technical')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'technical'
                    ? 'bg-white text-stone-900 shadow-xs border border-white/95'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Technical View</span>
              </button>
            </div>

            {/* Technical Sub-View Toggle (Only in Technical mode) */}
            {viewMode === 'technical' && (
              <div className="flex items-center gap-1 p-1 bg-stone-100/70 rounded-xl text-xs border border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setTechSubView('circuit')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    techSubView === 'circuit'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Circuit Details
                </button>
                <button
                  type="button"
                  onClick={() => setTechSubView('attractor')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    techSubView === 'attractor'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Attractor Basin
                </button>
              </div>
            )}

            {/* Quick Status / Mode Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConverged
                    ? 'bg-emerald-500'
                    : currentStep > 0
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-sky-500'
                }`}
              />
              <span className="text-stone-800">
                {isConverged
                  ? 'Stable Attractor'
                  : currentStep > 0
                  ? 'Recurrent Thinking'
                  : 'Input Injected'}
              </span>
            </div>
          </div>

      {/* 3. Main Glassmorphic Interactive Canvas */}
      <div className="relative w-full rounded-3xl glass-strong border border-white/90 overflow-hidden shadow-xl glass-specular p-2 sm:p-3">
        {/* Subtle Ambient Dots Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(217, 119, 6, 0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Technical Accuracy Note (Requested Requirement) */}
        <div className="absolute top-2.5 right-4 z-10 text-[10px] text-stone-600 bg-white/75 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-stone-200/60 pointer-events-none">
          Simplified view — showing representative neurons
        </div>

        {/* Expandable Equation Toggle (Requested: Keep main visual clear, provide expandable control) */}
        <div className="absolute top-2.5 left-4 z-10">
          <button
            type="button"
            onClick={() => setShowFormula((prev) => !prev)}
            className="flex items-center gap-1 text-[10.5px] font-medium text-stone-600 hover:text-stone-900 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/90 shadow-2xs transition-all cursor-pointer"
          >
            <span className="font-mono text-amber-800 font-bold">f(x)</span>
            <span>{showFormula ? 'Hide equation' : 'Show equation'}</span>
            {showFormula ? (
              <ChevronUp className="w-3 h-3 text-stone-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-stone-500" />
            )}
          </button>
        </div>

        {/* Expandable Equation Card */}
        {showFormula && (
          <div className="absolute top-11 left-4 z-20 p-3 rounded-2xl glass-strong border border-white/90 shadow-lg text-xs max-w-sm space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="font-mono font-bold text-amber-950 text-xs bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60">
              {`h_{t+1} = Π_{≥${activeParams.sparsityThreshold.toFixed(2)}}(W_t · h_t + W_in · q)`}
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Plain English:</strong> Next internal state = Only strong activations (≥ threshold) from combined memory (W_t · h_t) and original query (W_in · q).
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* SVG DIAGRAM: SIMPLE VIEW / TECHNICAL CIRCUIT VIEW                */}
        {/* ================================================================= */}
        {!(viewMode === 'technical' && techSubView === 'attractor') ? (
          <svg
            className="w-full h-72 sm:h-80 select-none overflow-visible"
            viewBox="0 0 640 280"
            role="img"
            aria-label="Recurrent Latent Reasoning Neural Architecture"
          >
            <defs>
              {/* 1. Luminous Gold Gradient for Active Thinking Recurrent Loop */}
              <linearGradient id="goldLoopGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="70%" stopColor="#EAB308" stopOpacity="1" />
                <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.95" />
              </linearGradient>

              {/* 1b. Smooth Moving Gold Pulse Gradient along Recurrent Loop (Right-to-Left Return) */}
              <linearGradient id="goldLoopMovingPulseGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#B45309" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FEF08A" stopOpacity="1" />
                <stop offset="70%" stopColor="#EAB308" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.4" />
                {!reducedMotion && (
                  <>
                    <animate attributeName="x1" from="200%" to="0%" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="x2" from="100%" to="-100%" dur="1.5s" repeatCount="indefinite" />
                  </>
                )}
              </linearGradient>

              {/* 2. Luminous Teal Gradient for Settled / Stable State Loop */}
              <linearGradient id="tealLoopGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.9" />
              </linearGradient>

              {/* 3. Soft Slate Gradient for Inactive / Resting Loop */}
              <linearGradient id="slateLoopGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.7" />
              </linearGradient>

              {/* Trajectory lines gradients */}
              <linearGradient id="inputTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>

              <linearGradient id="goldTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              {/* Smooth Moving Gold Gradient Pulse for Forward Latent Trajectory Lines */}
              <linearGradient id="goldMovingPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FEF08A" stopOpacity="1" />
                <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.4" />
                {!reducedMotion && (
                  <>
                    <animate attributeName="x1" from="-100%" to="100%" dur="1.1s" repeatCount="indefinite" />
                    <animate attributeName="x2" from="0%" to="200%" dur="1.1s" repeatCount="indefinite" />
                  </>
                )}
              </linearGradient>

              <linearGradient id="tealTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>

              <linearGradient id="slateTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="outputTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              {/* Attractor Basin Pulse Gradient */}
              <linearGradient id="attractorPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#FEF08A" stopOpacity="1" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
              </linearGradient>

              {/* State Node Gradients */}
              {/* Gold: Active Thinking State Nodes */}
              <linearGradient id="nodeGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="45%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Teal: Stable State Nodes */}
              <linearGradient id="nodeGradTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5EEAD4" />
                <stop offset="45%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>

              {/* Soft Slate: Inactive / Resting State Nodes */}
              <linearGradient id="nodeGradSlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Input Node Gradient */}
              <linearGradient id="nodeGradInput" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Output Node Gradient */}
              <linearGradient id="nodeGradOutput" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              {/* Subtle aura filters */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#EAB308" floodOpacity="0.4" />
              </filter>

              <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#0D9488" floodOpacity="0.4" />
              </filter>

              {/* Peak Activity Radiant Glow for Trajectory Lines */}
              <filter id="trajectoryPeakGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#F59E0B" floodOpacity="0.75" />
                <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#EAB308" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* 1. HERO RECURRENT LOOP (The Star of the Story) */}
            <g className="hero-recurrent-loop">
              {/* Base curved arch over latent neurons with smooth SVG transition */}
              <path
                d="M 430 135 C 430 36, 200 36, 200 135"
                fill="none"
                stroke={
                  isConverged
                    ? 'url(#tealLoopGrad)'
                    : currentStep > 0
                    ? 'url(#goldLoopMovingPulseGrad)'
                    : 'url(#slateLoopGrad)'
                }
                strokeWidth={
                  currentStep > 0 && !isConverged
                    ? trajectoryDynamics.thicknessLoop
                    : isConverged
                    ? 2.5
                    : 1.8
                }
                strokeDasharray={currentStep > 0 || isConverged ? 'none' : '4 3'}
                filter={currentStep > 0 && !isConverged && trajectoryDynamics.peakLoop > 0.35 ? 'url(#trajectoryPeakGlow)' : undefined}
                className="svg-trajectory-smooth"
              />

              {/* Active gold pulse wave moving along the recurrent loop path during thinking cycle */}
              {currentStep > 0 && !isConverged && !reducedMotion && (
                <path
                  d="M 430 135 C 430 36, 200 36, 200 135"
                  fill="none"
                  stroke="url(#goldLoopMovingPulseGrad)"
                  strokeWidth={trajectoryDynamics.thicknessLoop + 1.2}
                  strokeOpacity={0.4 + trajectoryDynamics.peakLoop * 0.55}
                  strokeDasharray="42 66"
                  filter="url(#goldGlow)"
                  className="animate-trajectory-reverse pointer-events-none svg-trajectory-smooth"
                />
              )}

              {/* Directional arrowhead at loop return (entering back into Neuron 1) */}
              <polygon
                points="200,135 195,123 205,123"
                fill={isConverged ? '#0D9488' : currentStep > 0 ? '#D97706' : '#94A3B8'}
                transform={currentStep > 0 && !isConverged ? `scale(${1 + trajectoryDynamics.peakLoop * 0.18})` : undefined}
                transformOrigin="200 135"
                className="transition-all duration-300"
              />

              {/* Hero Loop Badge at apex */}
              <g transform="translate(315, 36)">
                <rect
                  x="-75"
                  y="-13"
                  width="150"
                  height="26"
                  rx="13"
                  fill={isConverged ? '#F0FDFA' : currentStep > 0 ? '#FEFCE8' : '#F8FAFC'}
                  stroke={isConverged ? '#14B8A6' : currentStep > 0 ? '#EAB308' : '#CBD5E1'}
                  strokeWidth="1.5"
                  className="shadow-xs transition-all"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className={`text-[11px] font-bold select-none ${
                    isConverged
                      ? 'fill-teal-950 font-sans'
                      : currentStep > 0
                      ? 'fill-amber-950 font-sans'
                      : 'fill-slate-500 font-sans'
                  }`}
                >
                  {isConverged
                    ? '✓ State Stable (Settled)'
                    : currentStep > 0
                    ? `↺ Think again (Step ${currentStep})`
                    : '↺ Recurrent loop'}
                </text>
              </g>
            </g>

            {/* 2. THREE CONCEPTUAL CONNECTIONS (Simplified & Clean) */}
            <g className="conceptual-connections">
              {/* Connection 1: Input -> Latent Core (Neuron 1) */}
              <path
                d="M 97 155 L 178 155"
                fill="none"
                stroke={currentStep === 0 ? 'url(#inputTrajectoryGrad)' : 'url(#slateTrajectoryGrad)'}
                strokeWidth={trajectoryDynamics.thicknessInput}
                className="svg-trajectory-smooth"
              />
              {currentStep === 0 && !reducedMotion && (
                <path
                  d="M 97 155 L 178 155"
                  fill="none"
                  stroke="url(#inputTrajectoryGrad)"
                  strokeWidth={trajectoryDynamics.thicknessInput + 1.0}
                  strokeOpacity={0.5 + trajectoryDynamics.peakInput * 0.4}
                  strokeDasharray="20 28"
                  className="animate-trajectory-flow pointer-events-none svg-trajectory-smooth"
                />
              )}
              <polygon
                points="178,155 170,151 170,159"
                fill={currentStep === 0 ? '#0284C7' : '#94A3B8'}
                transform={currentStep === 0 ? `scale(${1 + trajectoryDynamics.peakInput * 0.15})` : undefined}
                transformOrigin="178 155"
                className="transition-all duration-300"
              />

              {/* Connection 2a: Latent Step 1 -> Step 2 */}
              <path
                d="M 222 155 L 288 155"
                fill="none"
                stroke={
                  isConverged
                    ? 'url(#tealTrajectoryGrad)'
                    : currentStep > 0
                    ? 'url(#goldMovingPulseGrad)'
                    : 'url(#slateTrajectoryGrad)'
                }
                strokeWidth={
                  currentStep > 0 && !isConverged
                    ? trajectoryDynamics.thickness2a
                    : isConverged
                    ? 2.4
                    : 1.2
                }
                strokeDasharray={isConverged || currentStep > 0 ? 'none' : '3 3'}
                filter={currentStep > 0 && !isConverged && trajectoryDynamics.peak2a > 0.35 ? 'url(#trajectoryPeakGlow)' : undefined}
                className="svg-trajectory-smooth"
              />
              {/* Active gold gradient pulse moving along Connection 2a during thinking cycle */}
              {currentStep > 0 && !isConverged && !reducedMotion && (
                <path
                  d="M 222 155 L 288 155"
                  fill="none"
                  stroke="url(#goldMovingPulseGrad)"
                  strokeWidth={trajectoryDynamics.thickness2a + 1.0}
                  strokeOpacity={0.45 + trajectoryDynamics.peak2a * 0.5}
                  strokeDasharray="20 30"
                  filter="url(#goldGlow)"
                  className="animate-trajectory-flow pointer-events-none svg-trajectory-smooth"
                />
              )}
              <polygon
                points="288,155 280,151 280,159"
                fill={isConverged ? '#0D9488' : currentStep > 0 ? '#D97706' : '#CBD5E1'}
                transform={currentStep > 0 && !isConverged ? `scale(${1 + trajectoryDynamics.peak2a * 0.18})` : undefined}
                transformOrigin="288 155"
                className="transition-all duration-300"
              />

              {/* Connection 2b: Latent Step 2 -> Step 3 */}
              <path
                d="M 332 155 L 398 155"
                fill="none"
                stroke={
                  isConverged
                    ? 'url(#tealTrajectoryGrad)'
                    : currentStep > 0
                    ? 'url(#goldMovingPulseGrad)'
                    : 'url(#slateTrajectoryGrad)'
                }
                strokeWidth={
                  currentStep > 0 && !isConverged
                    ? trajectoryDynamics.thickness2b
                    : isConverged
                    ? 2.4
                    : 1.2
                }
                strokeDasharray={isConverged || currentStep > 0 ? 'none' : '3 3'}
                filter={currentStep > 0 && !isConverged && trajectoryDynamics.peak2b > 0.35 ? 'url(#trajectoryPeakGlow)' : undefined}
                className="svg-trajectory-smooth"
              />
              {/* Active gold gradient pulse moving along Connection 2b during thinking cycle */}
              {currentStep > 0 && !isConverged && !reducedMotion && (
                <path
                  d="M 332 155 L 398 155"
                  fill="none"
                  stroke="url(#goldMovingPulseGrad)"
                  strokeWidth={trajectoryDynamics.thickness2b + 1.0}
                  strokeOpacity={0.45 + trajectoryDynamics.peak2b * 0.5}
                  strokeDasharray="20 30"
                  filter="url(#goldGlow)"
                  className="animate-trajectory-flow pointer-events-none svg-trajectory-smooth"
                />
              )}
              <polygon
                points="398,155 390,151 390,159"
                fill={isConverged ? '#0D9488' : currentStep > 0 ? '#D97706' : '#CBD5E1'}
                transform={currentStep > 0 && !isConverged ? `scale(${1 + trajectoryDynamics.peak2b * 0.18})` : undefined}
                transformOrigin="398 155"
                className="transition-all duration-300"
              />

              {/* Connection 3: Latent Core -> Answer Output */}
              <path
                d="M 442 155 L 541 155"
                fill="none"
                stroke={isConverged ? 'url(#outputTrajectoryGrad)' : 'url(#slateTrajectoryGrad)'}
                strokeWidth={trajectoryDynamics.thicknessOutput}
                strokeDasharray={isConverged ? 'none' : '4 3'}
                filter={isConverged && trajectoryDynamics.peakOutput > 0.3 ? 'url(#tealGlow)' : undefined}
                className="svg-trajectory-smooth"
              />
              {isConverged && !reducedMotion && (
                <path
                  d="M 442 155 L 541 155"
                  fill="none"
                  stroke="url(#outputTrajectoryGrad)"
                  strokeWidth={trajectoryDynamics.thicknessOutput + 1.2}
                  strokeOpacity={0.5 + trajectoryDynamics.peakOutput * 0.4}
                  strokeDasharray="24 34"
                  className="animate-trajectory-flow pointer-events-none svg-trajectory-smooth"
                />
              )}
              <polygon
                points="541,155 533,151 533,159"
                fill={isConverged ? '#7C3AED' : '#CBD5E1'}
                transform={isConverged ? `scale(${1 + trajectoryDynamics.peakOutput * 0.18})` : undefined}
                transformOrigin="541 155"
                className="transition-all duration-300"
              />
            </g>

            {/* 3. TECHNICAL VIEW OVERLAYS (Only in Technical Mode) */}
            {viewMode === 'technical' && (
              <g className="technical-circuit-annotations">
                {/* Clean Sparsity Threshold Indicator */}
                <line
                  x1="490"
                  y1="90"
                  x2="490"
                  y2="220"
                  stroke="#D97706"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <rect
                  x="455"
                  y="225"
                  width="70"
                  height="18"
                  rx="6"
                  fill="#FEF3C7"
                  stroke="#F59E0B"
                  strokeWidth="1"
                />
                <text
                  x="490"
                  y="237"
                  textAnchor="middle"
                  className="text-[9.5px] font-mono font-bold fill-amber-950"
                >
                  Gate θ = {params.sparsityThreshold}
                </text>
              </g>
            )}

            {/* 4. THE 5 REPRESENTATIVE NEURONS (Clean, Circular, Calm) */}
            <g className="neurons-layer">
              {neurons.map((n) => {
                const state = neuronStates[n.id];
                const isSelected = selectedNodeId === n.id;
                const isInput = n.role === 'input';
                const isOutput = n.role === 'output';

                // Distinct Semantic Color Palette with subtle gradients:
                // - Input: Distinct Azure / Sky Blue
                // - Gold: Active Thinking Latent Neurons
                // - Teal: Stable State Latent Neurons
                // - Soft Slate: Inactive / Resting Nodes
                // - Royal Violet: Output Readout
                let nodeFill = 'url(#nodeGradSlate)';
                let nodeStroke = '#94A3B8';
                let centralDotFill = '#F1F5F9';
                let selectionRingColor = '#94A3B8';
                let filterEffect = '';

                if (isInput) {
                  nodeFill = 'url(#nodeGradInput)';
                  nodeStroke = '#0369A1';
                  centralDotFill = '#E0F2FE';
                  selectionRingColor = '#0284C7';
                } else if (isOutput) {
                  if (isConverged) {
                    nodeFill = 'url(#nodeGradOutput)';
                    nodeStroke = '#6B21A8';
                    centralDotFill = '#F3E8FF';
                    selectionRingColor = '#7C3AED';
                  } else {
                    nodeFill = 'url(#nodeGradSlate)';
                    nodeStroke = '#94A3B8';
                    centralDotFill = '#F8FAFC';
                    selectionRingColor = '#64748B';
                  }
                } else if (state.isStable) {
                  nodeFill = 'url(#nodeGradTeal)';
                  nodeStroke = '#0F766E';
                  centralDotFill = '#CCFBF1';
                  selectionRingColor = '#0D9488';
                  filterEffect = 'url(#tealGlow)';
                } else if (state.isActive) {
                  nodeFill = 'url(#nodeGradGold)';
                  nodeStroke = '#B45309';
                  centralDotFill = '#FEF9C3';
                  selectionRingColor = '#EAB308';
                  filterEffect = 'url(#goldGlow)';
                } else {
                  // Inactive latent node
                  nodeFill = 'url(#nodeGradSlate)';
                  nodeStroke = '#94A3B8';
                  centralDotFill = '#F8FAFC';
                  selectionRingColor = '#64748B';
                }

                return (
                  <g
                    key={n.id}
                    id={`neuron-${n.id}`}
                    onClick={() => setSelectedNodeId(n.id)}
                    className="cursor-pointer group"
                  >
                    {/* Bi-directional selection ring linked to Convergence Matrix */}
                    {isSelected && (
                      <>
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={isOutput ? '31' : '29'}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          className="pointer-events-none"
                        />
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={isOutput ? '36' : '34'}
                          fill="none"
                          stroke={selectionRingColor}
                          strokeWidth="1.5"
                          opacity="0.6"
                          className={reducedMotion ? 'pointer-events-none' : 'pointer-events-none animate-ping'}
                          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        />
                      </>
                    )}

                    {/* Clean circular node with subtle gradient */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isOutput ? '23' : '21'}
                      fill={nodeFill}
                      stroke={nodeStroke}
                      strokeWidth="2"
                      filter={filterEffect}
                      className="transition-all duration-300 shadow-sm group-hover:scale-105"
                    />

                    {/* Small central indicator dot with subtle specular ring */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="7"
                      fill={centralDotFill}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      className="pointer-events-none transition-all duration-300"
                    />

                    {/* Clean primary label underneath */}
                    <text
                      x={n.x}
                      y={n.y + 36}
                      textAnchor="middle"
                      className={`text-xs select-none pointer-events-none font-display font-bold ${
                        isSelected ? 'fill-stone-900 font-extrabold' : 'fill-stone-700'
                      }`}
                    >
                      {viewMode === 'simple' ? n.simpleName : n.technicalMath}
                    </text>

                    {/* Role subtext underneath */}
                    <text
                      x={n.x}
                      y={n.y + 49}
                      textAnchor="middle"
                      className="text-[10px] select-none pointer-events-none fill-stone-500 font-sans"
                    >
                      {viewMode === 'simple' ? n.simpleRole : n.category}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* 5. SINGLE VISIBLE INFORMATION SIGNAL BEAD (Followable & Clear) */}
            {signalPos && (
              <g className="single-information-signal pointer-events-none">
                {/* Subtle soft outer glow */}
                <circle
                  cx={signalPos.x}
                  cy={signalPos.y}
                  r="8"
                  fill={signalPos.color}
                  opacity="0.35"
                />
                {/* Crisp central signal bead */}
                <circle
                  cx={signalPos.x}
                  cy={signalPos.y}
                  r="4.5"
                  fill={signalPos.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="shadow-sm"
                />
              </g>
            )}
          </svg>
        ) : (
          /* ================================================================= */
          /* SVG DIAGRAM: SIMPLIFIED ATTRACTOR BASIN VIEW (Technical Mode)     */
          /* ================================================================= */
          <svg
            className="w-full h-72 sm:h-80 select-none overflow-visible"
            viewBox="0 0 640 280"
            role="img"
            aria-label="Attractor Phase Basin Landscape"
          >
            <defs>
              <linearGradient id="attractorGuideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="attractorMovingPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B45309" stopOpacity="0.3" />
                <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FEF08A" stopOpacity="1" />
                <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.3" />
                {!reducedMotion && (
                  <>
                    <animate attributeName="x1" from="-100%" to="100%" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="x2" from="0%" to="200%" dur="1.4s" repeatCount="indefinite" />
                  </>
                )}
              </linearGradient>
            </defs>

            {/* Soft concentric Lyapunov energy contours */}
            <g className="attractor-landscape">
              <circle
                cx="320"
                cy="155"
                r="115"
                fill="none"
                stroke="#D97706"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.25"
              />
              <circle
                cx="320"
                cy="155"
                r="75"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <circle
                cx="320"
                cy="155"
                r="35"
                fill="#CCFBF1"
                fillOpacity="0.5"
                stroke="#0D9488"
                strokeWidth="2"
                opacity="0.9"
              />
              {/* Basin label */}
              <text
                x="320"
                y="160"
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-teal-950"
              >
                Stable Attractor (h*)
              </text>
              <text
                x="320"
                y="173"
                textAnchor="middle"
                className="text-[9.5px] font-sans fill-stone-500"
              >
                Minimum Energy dE/dt ≤ 0
              </text>
            </g>

            {/* Trajectory Guide Arrow */}
            <path
              d="M 190 85 Q 260 115 310 148"
              fill="none"
              stroke={isConverged ? '#0D9488' : 'url(#attractorGuideGrad)'}
              strokeWidth={
                currentStep > 0 && !isConverged
                  ? Number((1.8 + trajectoryDynamics.peakLoop * 1.5).toFixed(2))
                  : 1.8
              }
              strokeDasharray={isConverged ? 'none' : '3 3'}
              className="svg-trajectory-smooth"
            />
            {/* Active pulse moving along guide path */}
            {currentStep > 0 && !isConverged && !reducedMotion && (
              <path
                d="M 190 85 Q 260 115 310 148"
                fill="none"
                stroke="url(#attractorMovingPulseGrad)"
                strokeWidth={Number((2.6 + trajectoryDynamics.peakLoop * 1.6).toFixed(2))}
                strokeDasharray="22 36"
                className="animate-trajectory-flow pointer-events-none svg-trajectory-smooth"
              />
            )}

            {/* Moving Thought Dot ($h_t$) */}
            <g
              transform={`translate(${attractorThoughtPos.x}, ${attractorThoughtPos.y})`}
              className="transition-all duration-300"
            >
              <circle
                cx="0"
                cy="0"
                r="12"
                fill={isConverged ? '#14B8A6' : '#F59E0B'}
                fillOpacity="0.25"
                className="animate-ping"
              />
              <circle
                cx="0"
                cy="0"
                r="8"
                fill={isConverged ? '#0D9488' : '#EAB308'}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="shadow-sm"
              />
              <text
                x="0"
                y="-14"
                textAnchor="middle"
                className={`text-[10.5px] font-bold font-sans ${
                  isConverged ? 'fill-teal-950' : 'fill-amber-950'
                }`}
              >
                Current Thought (h_{currentStep})
              </text>
            </g>
          </svg>
        )}

        {/* 4. Canvas Bottom: Dynamic One-Sentence Explanation & Minimal Legend */}
        <div className="p-3 sm:p-3.5 glass-medium border-t border-white/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          {/* Dynamic Story Explanation (Requested Requirement) */}
          <div className="flex items-center gap-2 text-stone-800 font-medium">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="leading-snug">{dynamicStorySentence}</span>
          </div>

          {/* Minimal 5-Item Distinct Palette Legend */}
          <div className="flex items-center gap-3 text-[11px] text-stone-600 shrink-0 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-sky-600" />
              <span>Input</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border border-amber-600 shadow-2xs" />
              <span className="font-semibold text-amber-900">Gold: Active Thinking</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border border-teal-700 shadow-2xs" />
              <span className="font-semibold text-teal-900">Teal: Stable State</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-400" />
              <span>Slate: Inactive</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-purple-700" />
              <span>Answer</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Interactive Node Explanation Card (Beginner-friendly with progressive disclosure) */}
      {activeNeuron && (
        <div className="p-4 sm:p-5 rounded-3xl glass-strong border border-white/90 shadow-md space-y-3 glass-specular">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/50 pb-3">
            <div className="flex items-center gap-3">
              {/* Clean circular icon badge */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                  activeNeuron.role === 'input'
                    ? 'bg-sky-500/20 text-sky-950 border border-sky-300'
                    : activeNeuron.role === 'output'
                    ? isConverged
                      ? 'bg-purple-500/20 text-purple-950 border border-purple-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                    : activeNeuronState.isStable
                    ? 'bg-teal-500/20 text-teal-950 border border-teal-300 shadow-2xs'
                    : activeNeuronState.isActive
                    ? 'bg-amber-400/20 text-amber-950 border border-amber-400/60 shadow-2xs'
                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                }`}
              >
                <span>{activeNeuron.simpleName.slice(0, 1)}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-stone-900 font-display">
                    {activeNeuron.simpleName}: {activeNeuron.simpleRole}
                  </h4>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      activeNeuronState.isStable
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : activeNeuronState.isActive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {activeNeuronState.isStable
                      ? 'Stable State (Settled)'
                      : activeNeuronState.isActive
                      ? 'Active Thinking'
                      : 'Inactive (Resting)'}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1 shadow-2xs">
                    <Link2 className="w-2.5 h-2.5 text-amber-700" />
                    <span>Linked to Matrix: {activeNeuron.id === 'input' ? 'x_in' : activeNeuron.id === 'output' ? 'y_out' : `h_t^(${activeNeuron.id.replace('h', '')})`}</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-normal">
                  {activeNeuron.category}
                </p>
              </div>
            </div>

            {/* Simple activation progress indicator */}
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/60">
              <span className="text-stone-600 font-medium">Activation:</span>
              <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeNeuronState.isStable
                      ? 'bg-gradient-to-r from-teal-400 to-teal-600'
                      : activeNeuronState.isActive
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(100, activeNeuronState.activation * 100)}%` }}
                />
              </div>
              <span className="font-mono font-bold text-stone-800">
                {activeNeuronState.activation.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Plain English "What it is doing" */}
          <div className="space-y-1 text-xs text-stone-700">
            <span className="font-semibold text-stone-900 block">
              What it is doing:
            </span>
            <p className="leading-relaxed font-normal">
              {activeNeuron.simpleDescription}
            </p>
          </div>

          {/* Progressive Disclosure: Technical details toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowTechDetailsInInspector((prev) => !prev)}
              className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showTechDetailsInInspector ? 'Hide technical details' : 'Technical details →'}</span>
            </button>

            {showTechDetailsInInspector && (
              <div className="mt-2.5 p-3 rounded-2xl bg-white/60 border border-stone-200/60 text-xs space-y-2 font-mono text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Formal Identity:</span>
                  <span className="font-bold text-stone-900">{activeNeuron.technicalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Math Symbol:</span>
                  <span className="font-bold text-amber-900">{activeNeuron.technicalMath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Sparsity Gate (θ = {activeParams.sparsityThreshold.toFixed(2)}):</span>
                  <span className={activeNeuronState.activation >= activeParams.sparsityThreshold ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                    {activeNeuronState.activation >= activeParams.sparsityThreshold
                      ? 'Transmits forward (≥ θ)'
                      : 'Zeroed out (< θ)'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </div>

        {/* Right Column: Simulator Control Panel */}
        <div className="lg:col-span-4 h-full">
          <SimulatorControlPanel
            params={activeParams}
            onParamChange={handleParamChange}
            speedMs={speedMs}
            onSpeedChange={setSpeedMs}
            isPlaying={isPlaying}
            onPlayPause={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                if (currentStep >= maxSteps) setCurrentStep(0);
                setIsPlaying(true);
              }
            }}
            onStep={handleStepForward}
            onReset={handleReset}
            currentStep={currentStep}
            maxSteps={maxSteps}
          />
        </div>
      </div>

      {/* 3. WHAT JUST HAPPENED? Banner */}
      <WhatHappenedBanner
        currentStep={currentStep}
        prevStep={prevStep}
        currentDelta={residualDelta}
        prevDelta={prevDelta}
        stabilityPercent={stabilityPercent}
        isConverged={isConverged}
      />

      {/* 4. Unified Convergence Panel (Matrix & Graph) */}
      <ConvergencePanel
        currentStep={currentStep}
        maxSteps={maxSteps}
        params={activeParams}
        output={activeOutput}
        selectedNeuronId={selectedNodeId}
        onSelectNeuron={(id) => setSelectedNodeId(id)}
        neuronStates={neuronStates}
        residualDelta={residualDelta}
        onStepChange={(step) => {
          setIsPlaying(false);
          setCurrentStep(step);
        }}
        reducedMotion={reducedMotion}
      />

      {/* 5. Dynamic Reasoning Test */}
      <DynamicReasoningTest
        currentStep={currentStep}
        maxSteps={maxSteps}
        currentDelta={residualDelta}
        stabilityPercent={stabilityPercent}
        isConverged={isConverged}
        convergenceStep={convergenceTargetStep}
        params={activeParams}
        output={activeOutput}
        onAdvanceSteps={handleAdvanceSteps}
        onReset={handleReset}
      />
    </div>
  );
};
