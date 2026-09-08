import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Sparkles,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';
import { RESEARCH_PAPERS } from '../data/curriculumData';

interface PapersViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
}

export const PapersView: React.FC<PapersViewProps> = ({ onNavigate, progress }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'BDH & Pathway', 'Benchmarks & Reasoning', 'Neuroscience Foundations'];

  const filteredPapers = RESEARCH_PAPERS.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'BDH & Pathway') return p.title.includes('BDH') || p.title.includes('Dragon Hatchling') || p.authors.includes('Pathway');
    if (activeFilter === 'Benchmarks & Reasoning') return p.title.includes('Intelligence') || p.title.includes('Latent Space') || p.tags.includes('ARC-AGI');
    if (activeFilter === 'Neuroscience Foundations') return p.tags.includes('Hebbian Learning') || p.tags.includes('Neuroscience');
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Research Foundations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          Literature & Academic Citations
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl font-normal">
          Tracing the scientific lineage of recurrent latent reasoning from biological synaptic plasticity to François Chollet’s ARC-AGI benchmark and Pathway’s Dragon Hatchling (BDH) & BDH-CQ architectures.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2.5 flex-wrap border-b border-stone-200/60 pb-4">
        <span className="text-xs text-stone-500 flex items-center gap-1.5 mr-2 font-medium font-mono">
          <Filter className="w-3.5 h-3.5 text-amber-600" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeFilter === cat
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 border border-amber-400/40'
                : 'glass-medium text-stone-600 hover:text-stone-900 hover:bg-white border border-white/80'
            }`}
          >
            {cat === 'all' ? 'All Papers' : cat}
          </button>
        ))}
      </div>

      {/* Papers Grid */}
      <div className="space-y-6">
        {filteredPapers.map((paper) => {
          const paperUrl = paper.arxivId
            ? `https://arxiv.org/abs/${paper.arxivId}`
            : paper.pdfUrl || 'https://arxiv.org';

          return (
            <div
              key={paper.id}
              className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 hover:border-amber-400/80 transition-all duration-300 space-y-4 group shadow-xl hover:shadow-2xl glass-specular"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-950 border border-amber-300/60 font-bold font-mono backdrop-blur-xs">
                      {paper.venue}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {paper.year}
                    </span>
                    {paper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-0.5 rounded-full glass-light text-stone-600 border border-white/80 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors font-display">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-normal">{paper.authors}</p>
                </div>

                <a
                  href={paperUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-medium hover:bg-white text-amber-950 border border-amber-300/60 text-xs font-bold transition-all self-start flex-shrink-0 cursor-pointer shadow-xs hover:shadow-md"
                >
                  <span>Read Paper</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                </a>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {paper.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 glass-light rounded-2xl border border-white/80 text-xs space-y-1 shadow-2xs">
                  <div className="text-[11px] font-bold text-stone-900 font-display">
                    Core Breakthrough:
                  </div>
                  <p className="text-stone-600 leading-relaxed font-normal">{paper.keyBreakthrough}</p>
                </div>

                <div className="p-4 glass-light rounded-2xl border border-amber-300/50 text-xs space-y-1 shadow-2xs">
                  <div className="text-[11px] font-bold text-amber-950 font-display">
                    Relevance to BDH & Latent Reasoning:
                  </div>
                  <p className="text-stone-600 leading-relaxed font-normal">{paper.connectionToBDH}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step Banner */}
      <div className="p-7 rounded-3xl glass-strong border border-white/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl glass-specular">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 font-display">Ready to Validate Your Knowledge?</h3>
          <p className="text-xs text-stone-600 font-normal">
            Take the interactive evaluation to test your understanding of BDH, Hebbian learning, and ARC-AGI.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/knowledge-check')}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 border border-amber-400/40"
        >
          <span>Take Knowledge Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
