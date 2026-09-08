import React from 'react';
import {
  Brain,
  Sparkles,
  BookOpen,
  Award,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { AppRoute } from '../types';

interface AboutViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <Brain className="w-3.5 h-3.5 text-amber-700" />
          <span>Educational Pedagogy & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          About ThinkLoop
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
          <strong>See. Change. Understand.</strong> Inspired by the <strong>NeurIPS 2026 Education Track</strong>: transforming dense frontier AI research papers into interactive visual experiments where mathematical concepts click.
        </p>
      </div>

      {/* The Core Problem Statement */}
      <div className="p-7 sm:p-8 rounded-3xl glass-strong border border-amber-300/80 space-y-4 shadow-xl glass-specular">
        <span className="text-xs uppercase font-bold tracking-wider text-amber-950 font-mono">
          The Problem Statement
        </span>
        <blockquote className="text-sm sm:text-base text-stone-800 italic border-l-3 border-amber-500 pl-4 py-1 leading-relaxed font-normal">
          &ldquo;AI research moves faster than the material used to teach it. Ideas often appear across many papers before there is a clear, reusable way to learn them. The NeurIPS 2026 Education Track was built around this gap: contributors should distill emerging AI ideas into accessible resources such as interactive demos, notebooks, code, short videos, slides, lecture notes, animations, and visual explanations. The learner should not simply read or watch. The learner must interact with the system, change something meaningful, and observe the concept behaving.&rdquo;
        </blockquote>
      </div>

      {/* The Educational Philosophy */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 font-display">Our Pedagogical Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl glass-strong border border-white/90 space-y-2 shadow-lg glass-specular">
            <div className="text-xs font-bold text-amber-950 font-display">1. Active Hypothesizing Over Passive Reading</div>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Reading about energy attractors in a 40-page PDF rarely imparts physical intuition. Requiring learners to predict when a model will stabilize before adjusting a slider creates cognitive engagement and memorable mental models.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-strong border border-white/90 space-y-2 shadow-lg glass-specular">
            <div className="text-xs font-bold text-stone-900 font-display">2. Real Mathematical Substrate</div>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              We reject cosmetic toy simulations that decouple visuals from equations. In this laboratory, when you change the sparsity threshold or reasoning effort, the actual differential equations and Hebbian matrices update mathematically.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-strong border border-white/90 space-y-2 shadow-lg glass-specular">
            <div className="text-xs font-bold text-amber-900 font-display">3. Frontier Focus: Beyond Frozen Transformers</div>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Standard curriculum stops at attention heads and backpropagation. ThinkLoop tackles the frontier: Dragon Hatchling (BDH), online Hebbian synaptic plasticity, and recurrent latent deliberation on the ARC-AGI benchmark.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-strong border border-white/90 space-y-2 shadow-lg glass-specular">
            <div className="text-xs font-bold text-stone-800 font-display">4. Progressive Disclosure</div>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Concepts unfold step-by-step with interactive toggles, avoiding cognitive overload. Advanced users can expand rigorous technical deep dives on scale-free cortical networks without cluttering beginner intuition.
            </p>
          </div>
        </div>
      </div>

      {/* Sources, Credits & Citations */}
      <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 space-y-4 shadow-xl glass-specular">
        <h3 className="text-base font-bold text-stone-900 font-display">Research Credits & Acknowledgments</h3>
        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          This educational application builds upon theoretical insights, codebases, and published papers from:
        </p>

        <ul className="space-y-2.5 text-xs text-stone-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong className="text-stone-900 font-semibold">Pathway AI Research:</strong> For pioneering the Dragon Hatchling (BDH) architecture and BDH-CQ continuous query reasoning systems.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong className="text-stone-900 font-semibold">François Chollet:</strong> For creating the Abstraction and Reasoning Corpus (ARC-AGI) and establishing principled definitions of broad generalization.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong className="text-stone-900 font-semibold">John J. Hopfield:</strong> For foundational formulations of associative neural memory and Lyapunov energy attractors (1982).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong className="text-stone-900 font-semibold">NeurIPS 2026 Education Track:</strong> For creating the academic forum dedicated to closing the gap between frontier AI research velocity and public understanding.
            </span>
          </li>
        </ul>
      </div>

      {/* Back to learning CTA */}
      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="text-xs text-stone-500 hover:text-stone-800 font-medium cursor-pointer transition-colors"
        >
          &larr; Return to Home
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/concept')}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 border border-amber-400/40"
        >
          <span>Start the 8-Step Concept Explainer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
