import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sliders, Zap, Activity } from 'lucide-react';
import { SimulationParams } from '../../types';

interface SimulatorControlPanelProps {
  params: SimulationParams;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  speedMs: number;
  onSpeedChange: (speedMs: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  currentStep: number;
  maxSteps: number;
}

export const SimulatorControlPanel: React.FC<SimulatorControlPanelProps> = ({
  params,
  onParamChange,
  speedMs,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  currentStep,
  maxSteps,
}) => {
  return (
    <div
      className="p-5 sm:p-6 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-5 glass-specular h-full flex flex-col justify-between"
      id="simulator-control-panel"
    >
      {/* Header */}
      <div className="space-y-1 border-b border-stone-200/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center shadow-2xs">
              <Sliders className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">Simulator</h3>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
            {isPlaying ? 'Running' : 'Ready'}
          </span>
        </div>
        <p className="text-xs text-stone-600 font-normal">
          Change the system and watch what happens.
        </p>
      </div>

      {/* Main Execution Controls: ▶ Run, ⏸ Pause, ↻ Reset, ⏭ Step */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Execution Controls
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Run / Pause */}
          <button
            type="button"
            id="simulator-btn-play-pause"
            onClick={onPlayPause}
            className={`col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-extrabold text-white transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 ring-2 ring-amber-400/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{currentStep === 0 ? 'Run' : 'Resume'}</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            id="simulator-btn-reset"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-xs font-bold glass-medium hover:bg-white text-stone-800 border border-white/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            title="Reset simulation to initial state (Step 0)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-700" />
            <span>Reset</span>
          </button>

          {/* Step */}
          <button
            type="button"
            id="simulator-btn-step"
            onClick={onStep}
            disabled={currentStep >= maxSteps}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-2xs active:scale-[0.98] ${
              currentStep >= maxSteps
                ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200'
                : 'glass-medium hover:bg-white text-amber-950 border-amber-200/80 hover:shadow-xs'
            }`}
            title="Advance exactly one reasoning iteration"
          >
            <SkipForward className="w-3.5 h-3.5 text-amber-700" />
            <span>Step</span>
          </button>
        </div>
      </div>

      {/* Existing Simulation Parameters */}
      <div className="space-y-4 pt-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          System Parameters
        </div>

        {/* 1. Simulation speed */}
        <div className="space-y-1.5 bg-white/50 p-3 rounded-2xl border border-stone-200/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-900">Simulation speed</span>
            <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200/60">
              {speedMs === 1200 ? '0.7x (Slow)' : speedMs === 850 ? '1.0x (Normal)' : '1.8x (Fast)'}
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="1200"
            step="100"
            // Inverse mapping: lower ms = faster speed
            value={1600 - speedMs}
            onChange={(e) => onSpeedChange(1600 - Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <p className="text-[11px] text-stone-500 leading-snug font-normal">
            Controls the pacing between reasoning cycles.
          </p>
        </div>

        {/* 2. Reasoning steps */}
        <div className="space-y-1.5 bg-white/50 p-3 rounded-2xl border border-stone-200/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-900">Reasoning steps</span>
            <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200/60">
              {params.reasoningEffort}
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="24"
            step="1"
            value={params.reasoningEffort}
            onChange={(e) => onParamChange('reasoningEffort', Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <p className="text-[11px] text-stone-500 leading-snug font-normal">
            How many times the internal state is updated.
          </p>
        </div>

        {/* 3. Threshold (Sparsity Threshold theta) */}
        <div className="space-y-1.5 bg-white/50 p-3 rounded-2xl border border-stone-200/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-900">Threshold</span>
            <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200/60">
              {params.sparsityThreshold.toFixed(2)} (θ)
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={params.sparsityThreshold}
            onChange={(e) => onParamChange('sparsityThreshold', Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <p className="text-[11px] text-stone-500 leading-snug font-normal">
            Non-negative activation cutoff for monosemantic neurons.
          </p>
        </div>

        {/* 4. Sparsity / Synaptic Plasticity (Hebbian Rate eta) */}
        <div className="space-y-1.5 bg-white/50 p-3 rounded-2xl border border-stone-200/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-900">Sparsity & Plasticity</span>
            <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200/60">
              {params.hebbianRate.toFixed(2)} (η)
            </span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={params.hebbianRate}
            onChange={(e) => onParamChange('hebbianRate', Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <p className="text-[11px] text-stone-500 leading-snug font-normal">
            Rate of dynamic synaptic weight adjustment during reasoning.
          </p>
        </div>
      </div>
    </div>
  );
};
