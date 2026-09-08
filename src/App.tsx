import React, { useState, useEffect } from 'react';
import { AppRoute, UserProgress } from './types';
import {
  loadProgress,
  saveProgress,
  recordRouteCompleted,
  togglePrerequisite,
  incrementExperimentsRun,
  markNotebookCellExecuted,
  recordQuizScore,
  resetProgress,
} from './services/progressStorage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiquidBackground } from './components/glass/LiquidBackground';

import { LandingView } from './views/LandingView';
import { LearnPathwayView } from './views/LearnPathwayView';
import { ConceptExplainerView } from './views/ConceptExplainerView';
import { PlaygroundView } from './views/PlaygroundView';
import { BDHView } from './views/BDHView';
import { BDHCQView } from './views/BDHCQView';
import { ExperimentView } from './views/ExperimentView';
import { NotebookView } from './views/NotebookView';
import { PapersView } from './views/PapersView';
import { KnowledgeCheckView } from './views/KnowledgeCheckView';
import { ProgressView } from './views/ProgressView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  // Listen to browser hash or state if needed, or route updates
  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mark as completed in progress tracking
    setProgress((prev) => {
      const updated = recordRouteCompleted(route, prev);
      return updated;
    });
  };

  const handleTogglePrereq = (id: string) => {
    setProgress((prev) => togglePrerequisite(id, prev));
  };

  const handleRunExperiment = () => {
    setProgress((prev) => incrementExperimentsRun(prev));
  };

  const handleExecuteCell = (cellId: string) => {
    setProgress((prev) => markNotebookCellExecuted(cellId, prev));
  };

  const handleRecordQuizScore = (score: number, total: number) => {
    setProgress((prev) => recordQuizScore(score, total, prev));
  };

  const handleResetProgress = () => {
    const fresh = resetProgress();
    setProgress(fresh);
  };

  const handleToggleReducedMotion = () => {
    setProgress((prev) => {
      const updated = { ...prev, reducedMotion: !prev.reducedMotion };
      saveProgress(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen text-[#090D16] flex flex-col selection:bg-amber-500/20 selection:text-[#090D16] relative">
      {/* Global Apple Liquid Glass Ambient Atmosphere */}
      <LiquidBackground reducedMotion={progress.reducedMotion} />

      {/* Floating Glass Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        progress={progress}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LandingView
            onNavigate={handleNavigate}
            progress={progress}
            onTogglePrereq={handleTogglePrereq}
          />
        )}

        {currentRoute === '/learn' && (
          <LearnPathwayView
            onNavigate={handleNavigate}
            progress={progress}
          />
        )}

        {currentRoute === '/concept' && (
          <ConceptExplainerView
            onNavigate={handleNavigate}
            progress={progress}
          />
        )}

        {currentRoute === '/playground' && (
          <PlaygroundView
            onNavigate={handleNavigate}
            progress={progress}
            onRunExperiment={handleRunExperiment}
          />
        )}

        {currentRoute === '/bdh' && (
          <BDHView
            onNavigate={handleNavigate}
            progress={progress}
          />
        )}

        {currentRoute === '/bdh-cq' && (
          <BDHCQView
            onNavigate={handleNavigate}
            progress={progress}
          />
        )}

        {currentRoute === '/experiment' && (
          <ExperimentView
            onNavigate={handleNavigate}
            progress={progress}
            onExperimentComplete={handleRunExperiment}
          />
        )}

        {currentRoute === '/notebook' && (
          <NotebookView
            onNavigate={handleNavigate}
            progress={progress}
            onExecuteCell={handleExecuteCell}
          />
        )}

        {currentRoute === '/papers' && (
          <PapersView
            onNavigate={handleNavigate}
            progress={progress}
          />
        )}

        {currentRoute === '/knowledge-check' && (
          <KnowledgeCheckView
            onNavigate={handleNavigate}
            progress={progress}
            onRecordScore={handleRecordQuizScore}
          />
        )}

        {currentRoute === '/progress' && (
          <ProgressView
            onNavigate={handleNavigate}
            progress={progress}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentRoute === '/about' && (
          <AboutView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
