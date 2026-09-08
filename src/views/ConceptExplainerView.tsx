import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  Activity,
  ArrowRight,
  Layers,
  Brain,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppRoute, UserProgress, SimulationParams } from '../types';
import { CONCEPT_STEPS } from '../data/curriculumData';
import { runSimulation } from '../services/simulationEngine';
import { MathView } from '../components/MathView';
import { ParameterSlider } from '../components/ParameterSlider';

interface ConceptExplainerViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
}

export const ConceptExplainerView: React.FC<ConceptExplainerViewProps> = ({
  onNavigate,
  progress,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showDeepDive, setShowDeepDive] = useState(false);

  // Live mini-simulator for Step 04 & 05
  const [stepParams, setStepParams] = useState<SimulationParams>({
    reasoningEffort: 10,
    sparsityThreshold: 0.7,
    hebbianRate: 0.05,
    decayFactor: 0.08,
    networkScale: 32,
    inputDemonstrations: 4,
    noiseLevel: 0.03,
  });

  const simOutput = React.useMemo(() => runSimulation(stepParams), [stepParams]);
  const step = CONCEPT_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < CONCEPT_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      setShowDeepDive(false);
    } else {
      onNavigate('/playground');
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      setShowDeepDive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Breadcrumb & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-amber-900 font-bold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs">
              {step.code}
            </span>
            <span className="text-stone-300">/</span>
            <span>STEP 08</span>
          </div>
          <span className="text-stone-600 font-medium">
            Story Progress: {Math.round(((currentStepIdx + 1) / CONCEPT_STEPS.length) * 100)}%
          </span>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-8 gap-1.5 h-2 bg-stone-900/5 rounded-full overflow-hidden p-0.5 border border-white/80 backdrop-blur-xs">
          {CONCEPT_STEPS.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentStepIdx(idx);
                setShowDeepDive(false);
              }}
              className={`h-full rounded-full cursor-pointer transition-all ${
                idx < currentStepIdx
                  ? 'bg-amber-600'
                  : idx === currentStepIdx
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs'
                  : 'bg-stone-300/60 hover:bg-stone-400/60'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Main Step Card */}
      <div className="p-6 sm:p-9 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-6 glass-specular">
        {/* Step Header */}
        <div className="space-y-2 border-b border-stone-200/50 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-xs font-mono">
            {step.code}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            {step.title}
          </h2>
          <p className="text-sm font-medium text-amber-800">
            {step.subtitle}
          </p>
        </div>

        {/* Concise Explanation */}
        <div className="text-stone-700 text-sm leading-relaxed font-normal">
          <p>{step.summary}</p>
        </div>

        {/* Step Specific Visual & Interactive Element */}
        <div className="p-6 rounded-3xl glass-medium border border-white/80 shadow-sm">
          {step.id === 1 && (
            /* Step 1 Visual: Token cost comparison visualizer */
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Compute Footprint: Verbalized Thinking vs Silent Latent Deliberation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 glass-light border border-rose-200/80 rounded-2xl space-y-2 shadow-2xs">
                  <div className="text-xs font-bold text-rose-700">Standard LLM Chain-of-Thought</div>
                  <div className="font-mono text-xl font-extrabold text-stone-900">500 tokens emitted</div>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Quadratic attention over repetitive self-talk ("Let's see, maybe..."). Cost: ~$0.08 / task.
                  </p>
                </div>
                <div className="p-5 glass-light border border-amber-300/80 rounded-2xl space-y-2 shadow-2xs">
                  <div className="text-xs font-bold text-amber-800">BDH-CQ Recurrent Latent Deliberation</div>
                  <div className="font-mono text-xl font-extrabold text-amber-900">12 latent cycles (0 tokens)</div>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Linear hidden state iterations. Solution discovered privately in memory. Cost: $0.0007 / task.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step.id === 2 && (
            /* Step 2 Visual: Attractor Landscape & Energy Well */
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Energy Landscape: Thought Rolling into Solution Basin
              </div>
              <div className="h-36 glass-light rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/80 shadow-2xs">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  <path
                    d="M 10 20 Q 120 110 200 110 T 390 20"
                    fill="none"
                    stroke="#D6D3D1"
                    strokeWidth="3"
                  />
                  <path
                    d="M 100 80 Q 150 110 200 110"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                  <circle cx="200" cy="110" r="8" className="fill-amber-500 animate-pulse" />
                  <text x="200" y="85" textAnchor="middle" className="fill-amber-900 text-[11px] font-bold">
                    Attractor Minimum (E = -12.5)
                  </text>
                  <circle cx="100" cy="80" r="6" className="fill-stone-600" />
                  <text x="90" y="65" textAnchor="middle" className="fill-stone-600 text-[10px] font-medium">
                    Initial Guess h_0
                  </text>
                </svg>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Each recurrence step rolls down the energy slope E(h) until the state rests in the basin representing the verified abstract rule.
              </p>
            </div>
          )}

          {step.id === 3 && (
            /* Step 3 Visual: Monosemantic Spikes */
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Disentangled Neurons with Non-Negative Activations
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Neuron #04', role: 'Vertical Symmetry', active: true, val: '+0.88' },
                  { name: 'Neuron #11', role: 'Color Inversion', active: true, val: '+0.62' },
                  { name: 'Neuron #19', role: 'Gravity Shift', active: false, val: '0.00' },
                  { name: 'Neuron #28', role: 'Enclosure Box', active: false, val: '0.00' },
                ].map((n, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                      n.active
                        ? 'bg-amber-500/15 border-amber-300/80 text-amber-950 shadow-xs backdrop-blur-xs'
                        : 'glass-light border-white/80 text-stone-400'
                    }`}
                  >
                    <div className="font-mono text-[11px] font-bold">{n.name}</div>
                    <div className="font-semibold text-stone-800">{n.role}</div>
                    <div className="font-mono text-[10px] text-amber-800">
                      Act: {n.val}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Threshold projection Π(≥ θ) clips negative values to 0, preventing jumbled superposition and making every neuron’s role cleanly readable.
              </p>
            </div>
          )}

          {step.id === 4 && step.formula && (
            /* Step 4 Visual: Math breakdown */
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Governing Equations
              </div>
              <MathView
                formula={step.formula}
                terms={step.formulaMeaning}
                explanationBody="The first equation updates the continuous latent state with non-negative threshold projection. The second equation updates the fast synaptic connection weights online during context demonstration."
                interactiveNote="Click 'Explain' to inspect the physical meaning of every variable."
              />
            </div>
          )}

          {step.id === 5 && (
            /* Step 5 Visual: Live phase transition slider */
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Phase Transition Simulator: Adjust Reasoning Effort T
              </div>
              <ParameterSlider
                id="explainer-t"
                label="Reasoning Effort (Recurrent Steps T)"
                symbol="T"
                value={stepParams.reasoningEffort}
                min={1}
                max={20}
                step={1}
                unit=" steps"
                description="Number of recurrent latent deliberation cycles"
                onChange={(val) => setStepParams((prev) => ({ ...prev, reasoningEffort: val }))}
              />
              <div className="p-3.5 glass-light rounded-2xl border border-white/80 flex items-center justify-between text-xs shadow-2xs">
                <span>Convergence: <strong className="text-stone-900 font-bold">Step {simOutput.convergenceStep}</strong></span>
                <span>Energy: <strong className="text-amber-800 font-mono font-bold">{simOutput.energy}</strong></span>
                <span>Pass Prob: <strong className="text-emerald-700 font-bold">{simOutput.passProbability}%</strong></span>
              </div>
            </div>
          )}

          {step.id === 6 && (
            /* Step 6 Visual: BDH & BDH-CQ Pipeline */
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Dragon Hatchling (BDH) & BDH-CQ Integrated Architecture
              </div>
              <div className="p-5 glass-light rounded-2xl border border-white/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center shadow-2xs">
                <div className="p-3 bg-white/70 rounded-xl border border-white/90 w-full sm:w-auto">
                  <div className="text-stone-900 font-bold">Demonstrations</div>
                  <div className="text-[11px] text-stone-500">3-5 ARC Grids</div>
                </div>
                <span className="text-stone-400 font-bold">→</span>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-300/50 w-full sm:w-auto">
                  <div className="text-amber-950 font-bold">Synaptic Memory</div>
                  <div className="text-[11px] text-stone-600">Sticky Weights ΔW</div>
                </div>
                <span className="text-stone-400 font-bold">→</span>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-300/50 w-full sm:w-auto">
                  <div className="text-amber-950 font-bold">Latent Loop</div>
                  <div className="text-[11px] text-stone-600">Reasoning Effort T</div>
                </div>
                <span className="text-stone-400 font-bold">→</span>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-300/50 w-full sm:w-auto">
                  <div className="text-emerald-950 font-bold">Solved Output</div>
                  <div className="text-[11px] text-stone-600">$0.0007 / task</div>
                </div>
              </div>
            </div>
          )}

          {step.id === 7 && (
            /* Step 7 Visual: Lineage */
            <div className="space-y-3 text-xs">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
                Lineage of Ideas
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 glass-light rounded-2xl border border-white/80 shadow-2xs">
                  <span className="text-amber-800 font-bold">1949 Hebb / 1982 Hopfield</span>
                  <p className="text-stone-600 mt-1 leading-relaxed font-normal">Associative memory & energy attractors in biology.</p>
                </div>
                <div className="p-4 glass-light rounded-2xl border border-white/80 shadow-2xs">
                  <span className="text-stone-800 font-bold">2017 Transformers</span>
                  <p className="text-stone-600 mt-1 leading-relaxed font-normal">Attention scaling laws, but static frozen inference.</p>
                </div>
                <div className="p-4 glass-light rounded-2xl border border-white/80 shadow-2xs">
                  <span className="text-emerald-800 font-bold">2025 BDH & BDH-CQ</span>
                  <p className="text-stone-600 mt-1 leading-relaxed font-normal">Uniting biological plasticity with modern GPU compute.</p>
                </div>
              </div>
            </div>
          )}

          {step.id === 8 && (
            /* Step 8 Visual: Assessment Invitation */
            <div className="text-center py-6 space-y-3.5">
              <div className="inline-flex p-3.5 bg-amber-500/15 rounded-full border border-amber-300/60 text-amber-800 shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-base font-bold text-stone-900 font-display">Ready to Test Your Knowledge?</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-normal">
                Evaluate your intuitive grasp through friendly prediction challenges, tactile slider reasoning, and visual pattern interpretation.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/knowledge-check')}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer border border-amber-400/40"
              >
                Launch Knowledge Check
              </button>
            </div>
          )}
        </div>

        {/* Key Takeaways Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500 font-mono">
            Core Insights
          </h4>
          <div className="space-y-2">
            {step.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed font-normal">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure: Technical Deep Dive Drawer */}
        <div className="pt-2 border-t border-stone-200/50">
          <button
            type="button"
            onClick={() => setShowDeepDive(!showDeepDive)}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors cursor-pointer"
          >
            {showDeepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showDeepDive ? 'Hide Technical Deep Dive' : 'Explore Technical Deep Dive'}</span>
          </button>

          {showDeepDive && (
            <div className="mt-3 p-4 glass-light rounded-2xl border border-white/80 text-xs text-stone-700 leading-relaxed space-y-2 animate-fadeIn shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Theoretical & Architectural Depth</span>
              </div>
              <p className="font-normal">{step.deepDive}</p>
            </div>
          )}
        </div>

        {/* Interactive Prompt callout */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-300/50 rounded-2xl flex items-center justify-between text-xs text-amber-950 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{step.interactivePrompt}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200/50">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={handlePrev}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100/50 border border-transparent'
                : 'glass-medium hover:bg-white text-stone-700 border border-white/90 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-stone-500 font-medium font-mono">
            {currentStepIdx + 1} of {CONCEPT_STEPS.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer border border-amber-400/40"
          >
            <span>{currentStepIdx === CONCEPT_STEPS.length - 1 ? 'Go to Playground' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
