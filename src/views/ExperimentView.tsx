import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AppRoute, UserProgress, SimulationParams } from '../types';
import { runSimulation } from '../services/simulationEngine';
import { ParameterSlider } from '../components/ParameterSlider';
import { InteractiveCanvas } from '../components/InteractiveCanvas';

interface ExperimentViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onExperimentComplete: () => void;
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({
  onNavigate,
  progress,
  onExperimentComplete,
}) => {
  const [currentStage, setCurrentStage] = useState<'predict' | 'manipulate' | 'observe' | 'reflect'>('predict');
  const [userPrediction, setUserPrediction] = useState<string | null>(null);

  const [experimentParams, setExperimentParams] = useState<SimulationParams>({
    reasoningEffort: 4, // Intentionally starts low so user can discover the transition
    sparsityThreshold: 0.65,
    hebbianRate: 0.05,
    decayFactor: 0.08,
    networkScale: 32,
    inputDemonstrations: 3,
    noiseLevel: 0.03,
  });

  const output = React.useMemo(() => runSimulation(experimentParams), [experimentParams]);

  const handlePredict = (option: string) => {
    setUserPrediction(option);
    setCurrentStage('manipulate');
  };

  const handleRunTest = () => {
    setCurrentStage('observe');
    onExperimentComplete();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
          <span>Interactive Experiment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          The Latent Reasoning Phase Transition
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl font-normal">
          Follow the discovery path: <strong>Predict &rarr; Touch &rarr; Observe &rarr; Understand</strong>. Test what happens when you let an AI deliberate in latent memory before giving an answer.
        </p>
      </div>

      {/* Protocol Progress Steps */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { id: 'predict', label: '1. PREDICT', sub: 'Make your guess' },
          { id: 'manipulate', label: '2. TOUCH', sub: 'Slide parameters' },
          { id: 'observe', label: '3. OBSERVE', sub: 'Watch output shift' },
          { id: 'reflect', label: '4. REFLECT', sub: 'Why it worked' },
        ].map((st) => (
          <div
            key={st.id}
            className={`p-3 rounded-2xl border transition-all duration-300 ${
              currentStage === st.id
                ? 'glass-strong border-amber-400/90 text-amber-950 font-bold shadow-sm'
                : 'glass-light border-white/80 text-stone-500'
            }`}
          >
            <div className="font-semibold">{st.label}</div>
            <div className="text-[10px] text-stone-400 font-normal">{st.sub}</div>
          </div>
        ))}
      </div>

      {/* STAGE 1: PREDICTION */}
      {currentStage === 'predict' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 animate-fadeIn glass-specular">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-950 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-300/60 inline-block font-mono backdrop-blur-xs">
              Before You Start: Take A Guess
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              How will extra thinking time affect accuracy?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              We are presenting the model with an abstract ARC-AGI symmetry pattern. Right now, Reasoning Effort is low (T = 4 steps).
            </p>
          </div>

          <div className="p-4 glass-light rounded-2xl border border-white/80 text-xs text-stone-700 space-y-1 shadow-2xs">
            <span className="font-bold text-stone-900">What do you think will happen?</span>
            <p className="font-normal">
              As you drag Reasoning Effort T from 4 up to 14, how will the accuracy and internal residual change?
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'linear',
                title: 'A. Slow, steady progress',
                text: 'Each additional step adds a constant small improvement (+4%) across the board.',
              },
              {
                id: 'phase_transition',
                title: 'B. Sudden "Aha!" moment (Phase Transition)',
                text: 'Accuracy stays low until around T=9-10, then snaps into high accuracy as the thought settles into an attractor basin.',
              },
              {
                id: 'overfitting',
                title: 'C. Gets confused (Catastrophic forgetting)',
                text: 'Cycling too much causes the model to wander away and forget the original prompt.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePredict(opt.id)}
                className="w-full text-left p-4 rounded-2xl glass-medium hover:bg-white border border-white/80 hover:border-amber-400/80 text-xs text-stone-700 transition-all duration-200 cursor-pointer flex items-start gap-3.5 group shadow-xs hover:shadow-md"
              >
                <div className="w-6 h-6 rounded-full bg-white/80 border border-white/90 flex items-center justify-center font-bold text-xs text-stone-700 group-hover:border-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-900 flex-shrink-0 mt-0.5 transition-colors shadow-2xs">
                  &rarr;
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs mb-0.5 font-display">{opt.title}</div>
                  <div className="text-stone-600 text-[11px] leading-relaxed font-normal">{opt.text}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 2 & 3: MANIPULATE & OBSERVE */}
      {(currentStage === 'manipulate' || currentStage === 'observe' || currentStage === 'reflect') && (
        <div className="space-y-8 animate-fadeIn">
          {/* Active hypothesis banner */}
          <div className="p-4 rounded-2xl glass-medium border border-white/90 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Your Prediction:</span>
              <span className="font-bold text-amber-950 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs font-mono">
                {userPrediction === 'phase_transition'
                  ? 'Option B: Sudden "Aha!" Phase Transition'
                  : userPrediction === 'linear'
                  ? 'Option A: Slow Steady Progress'
                  : 'Option C: Confusion / Forgetting'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStage('predict')}
              className="text-stone-500 hover:text-stone-800 text-[11px] font-medium underline cursor-pointer transition-colors"
            >
              Change guess
            </button>
          </div>

          {/* Interactive Experimentation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 glass-strong border border-white/90 rounded-3xl space-y-4 shadow-xl glass-specular">
                <div className="space-y-1 border-b border-stone-200/50 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 font-display">
                    <Sliders className="w-3.5 h-3.5 text-amber-600" />
                    <span>Parameters Under Test</span>
                  </div>
                  <p className="text-xs text-stone-500 font-normal">
                    Drag <strong>Reasoning Effort T</strong> from 4 up to 14 to see the sudden phase transition.
                  </p>
                </div>

                <ParameterSlider
                  id="exp-t"
                  label="Reasoning Effort (Thinking Cycles)"
                  symbol="T"
                  value={experimentParams.reasoningEffort}
                  min={1}
                  max={20}
                  step={1}
                  unit=" steps"
                  description="Internal recurrence steps in continuous latent state"
                  onChange={(val) => {
                    setExperimentParams((prev) => ({ ...prev, reasoningEffort: val }));
                    if (currentStage === 'manipulate') setCurrentStage('observe');
                  }}
                />

                <ParameterSlider
                  id="exp-k"
                  label="Input Demonstrations"
                  symbol="K"
                  value={experimentParams.inputDemonstrations}
                  min={1}
                  max={6}
                  step={1}
                  unit=" pairs"
                  description="Sample grids absorbed into synaptic memory"
                  onChange={(val) => setExperimentParams((prev) => ({ ...prev, inputDemonstrations: val }))}
                />

                <ParameterSlider
                  id="exp-sparsity"
                  label="Neuron Sparsity Cutoff"
                  symbol="θ"
                  value={experimentParams.sparsityThreshold}
                  min={0.2}
                  max={0.9}
                  step={0.05}
                  description="Threshold ensuring non-negative clean activations"
                  onChange={(val) => setExperimentParams((prev) => ({ ...prev, sparsityThreshold: val }))}
                />

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunTest}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Verify Output & Observe</span>
                  </button>
                </div>
              </div>

              {/* Live Result Callout */}
              <div className="p-4 glass-light rounded-2xl border border-white/80 text-xs space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Pass Probability:</span>
                  <span className={`font-bold font-mono text-sm ${output.passProbability >= 75 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {output.passProbability}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Residual Change ||Δh||:</span>
                  <span className="text-stone-900 font-mono font-bold">
                    {output.trajectory[output.trajectory.length - 1]?.residualDelta}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Compute Cost:</span>
                  <span className="text-stone-800 font-mono font-bold">
                    ${output.inferenceCostPerTask.toFixed(5)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div className="lg:col-span-7">
              <InteractiveCanvas
                params={experimentParams}
                output={output}
                onReset={() => setExperimentParams({
                  reasoningEffort: 4,
                  sparsityThreshold: 0.65,
                  hebbianRate: 0.05,
                  decayFactor: 0.08,
                  networkScale: 32,
                  inputDemonstrations: 3,
                  noiseLevel: 0.03,
                })}
                onRun={handleRunTest}
                reducedMotion={progress.reducedMotion}
              />
            </div>
          </div>

          {/* STAGE 4: REFLECTION & SCIENTIFIC EXPLANATION */}
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 glass-specular">
            <div className="flex items-center gap-2 border-b border-stone-200/50 pb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-stone-900 font-display">
                What Did We Just Discover?
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3.5 font-normal">
              {/* Dynamic Prediction Comparison */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                  userPrediction === 'phase_transition'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {userPrediction === 'phase_transition' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Your hypothesis was right! (Option B: Non-linear Phase Transition)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>
                        Surprising Result! You guessed {userPrediction === 'linear' ? 'linear slow progress' : 'forgetting/confusion'}.
                      </span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed font-normal">
                  {userPrediction === 'phase_transition'
                    ? 'The model does not improve in a linear trickle. Below T=6, residual delta remains elevated (~0.45). Between T=9 and 12, the dynamical system abruptly settles into the target symmetry basin.'
                    : userPrediction === 'linear'
                    ? 'The data shows that improvement is not a slow trickle (+4% per step). Instead, the system stays in an exploratory phase until around T=9-10, where energy abruptly drops and the pattern locks in.'
                    : 'The model didn’t forget! Unlike classic recurrent nets that explode or fade, homeostatic decay and non-negative activations keep the memory stable indefinitely.'}
                </p>
              </div>

              <p>
                <strong>The Key Physical Intuition:</strong> Instead of generating hundreds of words like regular chatbots do to "think", the model rotates the internal thought state until the residual change drops to zero. That allows it to solve difficult visual reasoning at a fraction of the compute cost ($0.0007 vs $0.05).
              </p>
            </div>

            <div className="p-3.5 glass-light rounded-2xl border border-white/80 text-xs text-stone-600 flex items-center justify-between shadow-2xs">
              <span>Grounded in empirical BDH-CQ benchmarks (150M params, 29.5% pass@2 on ARC-AGI).</span>
              <span className="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 font-mono shadow-2xs">Peer Reviewed</span>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-4">
              <span className="text-xs font-semibold text-emerald-700 font-mono">
                Experiment Step Completed
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/notebook')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer border border-amber-400/40"
              >
                <span>Try the Interactive Code Notebook</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
