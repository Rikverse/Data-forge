import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Sliders,
  FlaskConical,
  FileText,
  HelpCircle,
  Layers,
  Brain,
  Award,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';

interface LearnPathwayViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
}

export const LearnPathwayView: React.FC<LearnPathwayViewProps> = ({
  onNavigate,
  progress,
}) => {
  const steps = [
    {
      step: '01',
      route: '/concept' as AppRoute,
      title: 'The 8-Step Concept Explainer',
      type: 'Core Theory',
      icon: BookOpen,
      desc: 'Guided narrative unfolding the problem of token emission, biological intuition, math formulation, and the phase transition.',
      duration: '8 min',
    },
    {
      step: '02',
      route: '/bdh' as AppRoute,
      title: 'Dragon Hatchling (BDH) Architecture',
      type: 'Deep Architecture',
      icon: Layers,
      desc: 'Discover the scale-free network of neuron particles, sparse positive spiking, and intrinsic monosemanticity.',
      duration: '6 min',
    },
    {
      step: '03',
      route: '/bdh-cq' as AppRoute,
      title: 'BDH-CQ & Continuous Query Reasoning',
      type: 'State of the Art',
      icon: Brain,
      desc: 'Examine in-context learning through dynamic synaptic memory and iterative latent deliberation on ARC-AGI.',
      duration: '7 min',
    },
    {
      step: '04',
      route: '/playground' as AppRoute,
      title: 'Interactive Laboratory Playground',
      type: 'Hands-on Simulation',
      icon: Sliders,
      desc: 'Manipulate reasoning effort T, sparsity thresholds, and Hebbian rates. Watch how real-time network graphs respond.',
      duration: '10 min',
    },
    {
      step: '05',
      route: '/experiment' as AppRoute,
      title: 'Guided Hypothesis Experiment',
      type: 'Scientific Discovery',
      icon: FlaskConical,
      desc: 'Follow the "Predict → Run → Observe → Explain" protocol to test if latent reasoning beats autoregressive CoT.',
      duration: '8 min',
    },
    {
      step: '06',
      route: '/notebook' as AppRoute,
      title: 'Interactive PyTorch-Style Notebook',
      type: 'Coding Laboratory',
      icon: FileText,
      desc: 'Step through simulated Python/PyTorch cells implementing threshold projections, Hebbian updates, and trajectory tracking.',
      duration: '12 min',
    },
    {
      step: '07',
      route: '/papers' as AppRoute,
      title: 'Research Timeline & References',
      type: 'Academic Literature',
      icon: BookOpen,
      desc: 'Trace the lineage from Hebb and Hopfield to modern State Space Models, Chollet’s ARC-AGI, and Pathway’s BDH.',
      duration: '5 min',
    },
    {
      step: '08',
      route: '/knowledge-check' as AppRoute,
      title: 'Interactive Knowledge Check',
      type: 'Assessment & Verification',
      icon: HelpCircle,
      desc: 'Test your understanding with multiple-choice, slider predictions, and visual activation interpretation challenges.',
      duration: '6 min',
    },
  ];

  const completedCount = steps.filter((s) => progress.completedRoutes[s.route]).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Curriculum Pathway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          The Recurrent Latent Reasoning Master Pathway
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl font-normal">
          Follow a structured educational sequence specifically crafted for the NeurIPS 2026 Education Track. You will move seamlessly from core biological intuition to hands-on parameter manipulation, notebook coding, and rigorous assessment.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-7 rounded-3xl glass-strong border border-white/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl glass-specular">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-stone-400 font-mono">
            Overall Curriculum Progress
          </span>
          <div className="text-xl font-extrabold text-stone-900 flex items-center gap-2.5 justify-center sm:justify-start font-display">
            <span>{completedCount} of {steps.length} Modules Completed</span>
            {progressPercent === 100 && (
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                Mastery Achieved!
              </span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs text-stone-600 font-medium">
            <span>Progress</span>
            <span className="text-amber-900 font-bold font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-stone-900/5 rounded-full overflow-hidden border border-white/80 p-0.5 backdrop-blur-xs">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sequential Pathway Timeline */}
      <div className="space-y-4">
        {steps.map((item, idx) => {
          const isCompleted = !!progress.completedRoutes[item.route];
          const isNext = !isCompleted && (idx === 0 || progress.completedRoutes[steps[idx - 1].route]);
          const Icon = item.icon;

          return (
            <div
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                isCompleted
                  ? 'glass-medium border-white/80 hover:border-amber-400/60'
                  : isNext
                  ? 'glass-strong border-amber-400/90 ring-2 ring-amber-400/20 shadow-md'
                  : 'glass-light border-white/70 hover:border-white/90'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Step badge */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 shadow-2xs'
                      : isNext
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm border border-amber-400/40'
                      : 'bg-white/80 text-stone-500 border border-white/90'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.step}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100/80 text-stone-700 border border-white/90 backdrop-blur-xs">
                      {item.type}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      ⏱ {item.duration}
                    </span>
                    {isNext && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-xs">
                        Recommended Next
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xl leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-stone-500 group-hover:text-amber-800 self-end sm:self-center transition-colors">
                <span>{isCompleted ? 'Review Module' : 'Launch Module'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-700" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
