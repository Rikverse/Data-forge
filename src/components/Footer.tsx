import React from 'react';
import { Sparkles, Compass, BookOpen, Layers, FlaskConical, FileText, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-white/80 glass-medium text-stone-600 text-xs backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-400/30 border border-white/90 flex items-center justify-center text-amber-700 shadow-2xs backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="tracking-tight font-semibold">ThinkLoop</span>
                <span className="text-[10px] text-stone-500 font-normal">See. Change. Understand.</span>
              </div>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed max-w-md font-normal">
              An interactive educational laboratory built around the idea that AI research moves faster than static textbooks. Instead of passive reading, you get to touch parameters, observe representations shift, and build lasting physical intuition.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/90 text-[11px] text-stone-700 shadow-2xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Learning Cycle: Curiosity → Discovery → Experimentation → Surprise → Understanding</span>
            </div>
          </div>

          {/* Col 2: Learning Lab Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-semibold text-stone-900 tracking-wider">
              Interactive Lab
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/learn')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Curriculum Pathway</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/concept')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Concept Explainer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/experiment')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Guided Experiment</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/playground')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Sandbox Playground</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/notebook')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Interactive Notebook</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Foundations */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-semibold text-stone-900 tracking-wider">
              Research & Science
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/bdh')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Dragon Hatchling (BDH)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/bdh-cq')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Continuous Query (BDH-CQ)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/papers')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Research Papers & Timeline</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="text-stone-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  <span>Methodology & Philosophy</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-stone-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
            <span>Educational Research Sandbox • Liquid Glass AI Architecture</span>
          </div>
          <div>
            Crafted for curious learners • See it, touch it, understand it.
          </div>
        </div>
      </div>
    </footer>
  );
};
