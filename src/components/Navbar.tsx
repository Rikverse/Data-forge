import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Sliders,
  BookOpen,
  FlaskConical,
  FileText,
  HelpCircle,
  BarChart3,
  Eye,
  Info,
  Layers,
  Compass,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onToggleReducedMotion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  progress,
  onToggleReducedMotion,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const completedCount = Object.values(progress.completedRoutes).filter(Boolean).length;
  const totalRoutes = 11;
  const progressPercent = Math.round((completedCount / totalRoutes) * 100);

  const navItems: { route: AppRoute; label: string; icon: React.FC<{ className?: string }> }[] = [
    { route: '/', label: 'Home', icon: Sparkles },
    { route: '/learn', label: 'Pathway', icon: Compass },
    { route: '/concept', label: 'Concept', icon: BookOpen },
    { route: '/playground', label: 'Playground', icon: Sliders },
    { route: '/experiment', label: 'Experiment', icon: FlaskConical },
    { route: '/bdh', label: 'Dragon Hatchling', icon: Layers },
    { route: '/notebook', label: 'Notebook', icon: FileText },
    { route: '/papers', label: 'Research', icon: BookOpen },
    { route: '/knowledge-check', label: 'Check Thinking', icon: HelpCircle },
    { route: '/progress', label: 'Journey', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full pt-3 px-3 sm:px-6 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 ${
          isScrolled
            ? 'glass-strong shadow-lg shadow-stone-900/5 border border-white/90 py-2.5 px-4 sm:px-6'
            : 'glass-medium shadow-md shadow-stone-900/4 border border-white/80 py-3 px-4 sm:px-6'
        } glass-specular`}
      >
        <div className="flex items-center justify-between">
          {/* Brand & Glass Logo Icon */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-400/25 to-amber-500/30 border border-white/90 backdrop-blur-md flex items-center justify-center text-amber-800 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-amber-500/20 transition-all duration-300 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm sm:text-base tracking-tight group-hover:text-amber-700 transition-colors">
                  ThinkLoop
                </span>
                <span className="hidden sm:inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-300/40 backdrop-blur-sm">
                  Interactive Lab
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-normal">
                See. Change. Understand.
              </span>
            </div>
          </div>

          {/* Desktop Floating Pill Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-stone-900/4 border border-white/60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => onNavigate('/learn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/learn'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Learn
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/concept')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/concept'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Concept
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/experiment')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/experiment'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Experiment
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/playground')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/playground'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Playground
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/bdh')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/bdh' || currentRoute === '/bdh-cq'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              BDH Architecture
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/papers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                currentRoute === '/papers'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-white/90'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Research
            </button>
          </nav>

          {/* Right Actions: Glass Journey Pill & Reduced Motion Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Journey Milestone Pill */}
            <button
              type="button"
              onClick={() => onNavigate('/progress')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/75 hover:bg-white border border-white/90 hover:border-amber-400/50 hover:shadow-sm text-xs transition-all duration-200 cursor-pointer shadow-2xs backdrop-blur-md"
              title="Explore your learning journey"
            >
              <span className="text-stone-700 hidden sm:inline font-medium">Journey</span>
              <div className="w-14 h-2 bg-stone-200/70 rounded-full overflow-hidden hidden sm:block border border-white/60">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
              <span className="font-bold text-amber-700 font-mono">{progressPercent}%</span>
            </button>

            {/* Gentle Motion Toggle */}
            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`p-2 rounded-xl border text-xs transition-all duration-200 cursor-pointer backdrop-blur-md ${
                progress.reducedMotion
                  ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-medium shadow-xs'
                  : 'bg-white/70 border-white/80 text-stone-500 hover:text-stone-900 hover:bg-white shadow-2xs'
              }`}
              title={progress.reducedMotion ? 'Gentle motion active' : 'Toggle gentle motion'}
              aria-label="Toggle gentle motion"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/70 border border-white/80 text-stone-700 hover:bg-white shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Glass Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-stone-200/60 space-y-1.5 animate-fadeIn">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 pb-1">
              Explore ThinkLoop
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentRoute === item.route;
              const isCompleted = progress.completedRoutes[item.route];

              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isCurrent
                      ? 'bg-white/90 text-amber-950 font-semibold border border-amber-200/80 shadow-xs'
                      : 'text-stone-700 hover:bg-white/60 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-amber-600" />
                    <span>{item.label}</span>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      Discovered
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 mt-2 border-t border-stone-200/60 flex justify-between items-center px-3">
              <button
                type="button"
                onClick={() => {
                  onNavigate('/about');
                  setMobileOpen(false);
                }}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About this laboratory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
