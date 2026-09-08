import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  Clock,
  Circle,
  HelpCircle,
  Brain,
  Layers,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppRoute, UserProgress, SimulationParams } from '../types';
import { LEARNING_OBJECTIVES, PREREQUISITES } from '../data/curriculumData';
import { runSimulation } from '../services/simulationEngine';
import { InteractiveCanvas } from '../components/InteractiveCanvas';
import { MathView } from '../components/MathView';

interface LandingViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onTogglePrereq: (id: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  progress,
  onTogglePrereq,
}) => {
  // Hero simulation state
  const [heroParams, setHeroParams] = useState<SimulationParams>({
    reasoningEffort: 12,
    sparsityThreshold: 0.7,
    hebbianRate: 0.05,
    decayFactor: 0.08,
    networkScale: 32,
    inputDemonstrations: 4,
    noiseLevel: 0.04,
  });

  const [expandedPrereq, setExpandedPrereq] = useState<string | null>(null);

  const heroOutput = React.useMemo(() => runSimulation(heroParams), [heroParams]);

  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Research Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              Interactive AI Education
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono bg-white/70 text-stone-700 border border-white/90 backdrop-blur-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              NeurIPS 2026 Education Track Inspired
            </span>
          </div>

          {/* Hero Title & Supporting Text */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight font-display">
              Make Frontier AI <span className="text-amber-800 italic">Click.</span>
            </h1>
            <p className="text-base sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Turn difficult research ideas into interactive experiments you can see, manipulate, and understand.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="start-learning-cta"
              type="button"
              onClick={() => onNavigate('/concept')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-amber-400/40"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="explore-experiment-cta"
              type="button"
              onClick={() => onNavigate('/experiment')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass-medium hover:bg-white text-stone-800 border border-white/90 font-bold text-sm shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Explore the Experiment</span>
              <Sliders className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Hero Visual: Interactive preview of the core AI concept */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="mb-3 flex items-center justify-between px-2 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CONCEPT SIMULATION: Recurrent Latent Deliberation & Spiking Particles</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/playground')}
              className="text-amber-800 hover:text-amber-900 flex items-center gap-1 font-bold cursor-pointer transition-colors"
            >
              <span>Open in Full Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>

          <InteractiveCanvas
            params={heroParams}
            output={heroOutput}
            onReset={() =>
              setHeroParams({
                reasoningEffort: 12,
                sparsityThreshold: 0.7,
                hebbianRate: 0.05,
                decayFactor: 0.08,
                networkScale: 32,
                inputDemonstrations: 4,
                noiseLevel: 0.04,
              })
            }
            onRun={() => onNavigate('/experiment')}
            onToggleCompare={() => onNavigate('/playground')}
            onExplainChange={() => onNavigate('/concept')}
            reducedMotion={progress.reducedMotion}
          />
        </div>
      </section>

      {/* 2. LEARNING OBJECTIVES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs uppercase font-mono tracking-wider text-amber-800 font-bold">
            Curriculum Outcomes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            What You Will Master
          </h2>
          <p className="text-sm text-stone-600 font-normal">
            By the end of this laboratory experience, you will be able to:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARNING_OBJECTIVES.map((obj, idx) => {
            const isCompleted = progress.objectivesCompleted[obj.id] || progress.completedRoutes[obj.targetRoute];
            const isInProgress = !isCompleted && progress.lastVisitedRoute === obj.targetRoute;

            let statusLabel = 'Not Started';
            let StatusIcon = Circle;
            let statusBadge = 'bg-stone-100/90 text-stone-600 border-stone-200';

            if (isCompleted) {
              statusLabel = 'Completed';
              StatusIcon = CheckCircle2;
              statusBadge = 'bg-emerald-100/90 text-emerald-800 border-emerald-300';
            } else if (isInProgress) {
              statusLabel = 'In Progress';
              StatusIcon = Clock;
              statusBadge = 'bg-amber-100/90 text-amber-900 border-amber-300';
            }

            return (
              <div
                key={obj.id}
                onClick={() => onNavigate(obj.targetRoute)}
                className="p-6 rounded-3xl glass-medium border border-white/80 hover:border-amber-400/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm glass-specular"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs ${statusBadge}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusLabel}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors font-display">
                    {obj.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {obj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-xs font-bold text-stone-500 group-hover:text-amber-800 transition-colors">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-700" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PREREQUISITES PANEL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-7 sm:p-8 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-8 glass-specular">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-800 font-bold">
                Foundations Check
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
                Prerequisite Refresher
              </h2>
              <p className="text-xs text-stone-600 font-normal">
                We assume no prior exposure to advanced biological AI. Click any topic to review or mark your familiarity.
              </p>
            </div>

            <div className="text-xs font-mono text-stone-700 bg-white/80 px-3.5 py-1.5 rounded-2xl border border-white/90 self-start sm:self-auto font-medium shadow-2xs backdrop-blur-xs">
              Mastered:{' '}
              <strong className="text-emerald-800 font-bold">
                {Object.values(progress.prerequisitesKnown).filter(Boolean).length} / {PREREQUISITES.length}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREREQUISITES.map((p) => {
              const isKnown = !!progress.prerequisitesKnown[p.id];
              const isExpanded = expandedPrereq === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isKnown
                      ? 'bg-emerald-50/60 border-emerald-300/80 shadow-xs'
                      : 'glass-light border-white/80 hover:border-amber-300/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                          {p.category}
                        </span>
                        {isKnown && (
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Known
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 font-display">{p.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-normal">{p.summary}</p>
                    </div>
                  </div>

                  {/* Expandable Refresher Drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-3 text-xs text-stone-700 animate-fadeIn">
                      <p className="leading-relaxed bg-white/85 p-3.5 rounded-xl border border-white/90 shadow-2xs">
                        {p.refresher}
                      </p>
                      {p.formula && (
                        <div className="p-3 bg-white/85 rounded-xl border border-white/90 text-center font-mono shadow-2xs">
                          <MathView formula={p.formula} displayMode={false} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedPrereq(isExpanded ? null : p.id)}
                      className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Refresher</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Review This</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePrereq(p.id)}
                      className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        isKnown
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-white/80 hover:bg-white text-stone-700 border border-white/90 shadow-2xs'
                      }`}
                    >
                      {isKnown ? 'Marked as Known' : 'I Know This'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. THE CORE BREAKTHROUGH SPOTLIGHT: DRAGON HATCHLING & BDH-CQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-strong border border-white/90 shadow-xl relative overflow-hidden glass-specular">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Frontier AI Highlight: Dragon Hatchling & BDH-CQ
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
              Why Recurrent Latent Reasoning Changes Everything
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Every submission to the NeurIPS 2026 Education Track explores frontier concepts that rethink basic assumptions. Dragon Hatchling (BDH) replaces frozen weights with biological synaptic plasticity, while BDH-CQ eliminates word verbalization to achieve $0.0007 per task reasoning on the ARC-AGI benchmark.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/bdh')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] border border-amber-400/40"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Dragon Hatchling (BDH)</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/bdh-cq')}
                className="px-5 py-2.5 rounded-2xl glass-medium hover:bg-white text-stone-800 font-bold text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-white/90 shadow-2xs active:scale-[0.98]"
              >
                <Brain className="w-4 h-4 text-amber-600" />
                <span>Explore BDH-CQ Reasoning</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
