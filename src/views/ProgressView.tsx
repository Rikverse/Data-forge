import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  FileText,
  HelpCircle,
  Layers,
  Brain,
  Download,
  Share2,
  Copy,
  Check,
  Star,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Trophy,
  Flame,
  Printer,
  Edit3,
  X,
  Eye,
  BookOpen,
} from 'lucide-react';
import { AppRoute, UserProgress } from '../types';

interface ProgressViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

interface BadgeItem {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  icon: React.ComponentType<{ className?: string }>;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  historicalFact: string;
  progressText: string;
  actionRoute: AppRoute;
  actionLabel: string;
}

interface TeaserQuestion {
  id: number;
  question: string;
  concept: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
}

const TEASER_QUESTIONS: TeaserQuestion[] = [
  {
    id: 1,
    question: 'Why does BDH-CQ achieve ~$0.0007 inference cost per task on ARC-AGI compared to ~$0.15+ for standard LLM reasoning?',
    concept: 'Zero-Token Latent Deliberation',
    options: [
      { text: 'It compresses all network weights to 1-bit binary values', correct: false },
      { text: 'It deliberates across recurrent latent states without generating thousands of verbal tokens', correct: true },
      { text: 'It skips spatial grid representations and uses lookup tables', correct: false },
    ],
    explanation:
      'Standard LLM "Chain of Thought" verbalizes reasoning step-by-step into hundreds of output tokens (incurring sequential compute and API token billing). BDH-CQ keeps intermediate thinking entirely in continuous latent state vectors ($h_t$), terminating with near-zero inference cost.',
  },
  {
    id: 2,
    question: 'What mathematical property ensures an energy attractor state is reached in Lyapunov recurrent systems?',
    concept: 'Lyapunov Convergence Criterion',
    options: [
      { text: 'The time derivative of the energy function satisfies dE/dt ≤ 0', correct: true },
      { text: 'Backpropagation loss drops below 1e-4', correct: false },
      { text: 'The softmax attention temperature equals zero', correct: false },
    ],
    explanation:
      'In Hopfield and BDH attractor networks, symmetric non-negative weights guarantee that the system energy monotonically declines ($dE/dt \\le 0$). When residual change $\\|h_{t} - h_{t-1}\\| < \\epsilon$, the system has safely settled into a verified solution basin.',
  },
  {
    id: 3,
    question: 'How does biological non-negative threshold projection (θ ≥ 0.4) prevent polysemantic superposition?',
    concept: 'Monosemantic Sparsity',
    options: [
      { text: 'It randomly zeroes out 90% of model layers during test time', correct: false },
      { text: 'It forces activations to align along positive independent axes, preventing vector superposition', correct: true },
      { text: 'It doubles the learning rate for negative weights', correct: false },
    ],
    explanation:
      'Polysemanticity occurs in standard models when neurons share multiple meanings through positive and negative interference. Enforcing non-negativity and an activation threshold $\\theta$ forces each neuron to represent a clean, isolated semantic feature.',
  },
];

export const ProgressView: React.FC<ProgressViewProps> = ({
  onNavigate,
  progress,
  onResetProgress,
}) => {
  // Learner customization
  const [scholarName, setScholarName] = useState<string>(() => {
    return localStorage.getItem('ai_concept_lab_scholar_name') || 'Frontier AI Scholar';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(scholarName);

  // UI state
  const [activeTab, setActiveTab] = useState<'competencies' | 'constellation' | 'quests'>('competencies');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Daily pulse / mini quiz state
  const [activeTeaserIdx, setActiveTeaserIdx] = useState(0);
  const [selectedTeaserOption, setSelectedTeaserOption] = useState<number | null>(null);
  const [teaserAnswered, setTeaserAnswered] = useState(false);
  const [bonusXpEarned, setBonusXpEarned] = useState<number>(() => {
    return parseInt(localStorage.getItem('ai_concept_lab_bonus_xp') || '0', 10);
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setBonusXpEarned(0);
    try {
      localStorage.removeItem('ai_concept_lab_bonus_xp');
    } catch {
      // ignore
    }
    setIsResetModalOpen(false);
    showToast('Progress successfully reset to baseline.');
  };

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#d97706', '#f59e0b', '#10b981', '#0284c7'],
      });
    } catch {
      // Fallback
    }
  };

  // Metrics calculation (exclude landing page to accurately track curriculum modules 0 to 8)
  const routesCount = Object.keys(progress.completedRoutes).filter((r) => r !== '/').length;
  const prereqsCount = Object.values(progress.prerequisitesKnown).filter(Boolean).length;
  const notebookCount = progress.notebookExecutedCells.length;
  const experimentsCount = progress.experimentsRunCount || progress.experimentsCount || 0;
  const quizScoreObj = progress.quizScore;
  const quizScoreText = quizScoreObj ? `${quizScoreObj.score} / ${quizScoreObj.total}` : 'Not taken';
  const quizPercent = quizScoreObj ? Math.round((quizScoreObj.score / quizScoreObj.total) * 100) : 0;

  // XP calculation
  const baseExperiencePoints = useMemo(() => {
    const routeXp = routesCount * 120;
    const prereqXp = prereqsCount * 45;
    const expXp = Math.min(experimentsCount, 10) * 85;
    const nbXp = Math.min(notebookCount, 5) * 110;
    const qzXp = quizScoreObj ? Math.round((quizScoreObj.score / quizScoreObj.total) * 450) : 0;
    return routeXp + prereqXp + expXp + nbXp + qzXp + bonusXpEarned;
  }, [routesCount, prereqsCount, experimentsCount, notebookCount, quizScoreObj, bonusXpEarned]);

  // Rank / Level
  const { currentLevel, rankTitle, nextLevelXp, levelProgressPct } = useMemo(() => {
    if (baseExperiencePoints < 350) {
      return {
        currentLevel: 1,
        rankTitle: 'Neuro-AI Initiate',
        nextLevelXp: 350,
        levelProgressPct: Math.min(100, Math.round((baseExperiencePoints / 350) * 100)),
      };
    } else if (baseExperiencePoints < 850) {
      return {
        currentLevel: 2,
        rankTitle: 'Latent Deliberation Apprentice',
        nextLevelXp: 850,
        levelProgressPct: Math.min(100, Math.round(((baseExperiencePoints - 350) / 500) * 100)),
      };
    } else if (baseExperiencePoints < 1500) {
      return {
        currentLevel: 3,
        rankTitle: 'Dynamic Attractor Specialist',
        nextLevelXp: 1500,
        levelProgressPct: Math.min(100, Math.round(((baseExperiencePoints - 850) / 650) * 100)),
      };
    } else if (baseExperiencePoints < 2200) {
      return {
        currentLevel: 4,
        rankTitle: 'BDH Synaptic Architect',
        nextLevelXp: 2200,
        levelProgressPct: Math.min(100, Math.round(((baseExperiencePoints - 1500) / 700) * 100)),
      };
    } else {
      return {
        currentLevel: 5,
        rankTitle: 'Frontier NeurIPS Scholar',
        nextLevelXp: 2800,
        levelProgressPct: 100,
      };
    }
  }, [baseExperiencePoints]);

  // Badges data
  const badges: BadgeItem[] = [
    {
      id: 'curriculum-navigator',
      name: 'Curriculum Navigator',
      desc: 'Explored 4 or more interactive research modules',
      unlocked: routesCount >= 4,
      icon: Layers,
      rarity: 'Common',
      historicalFact:
        'Interdisciplinary synthesis across neurobiology and machine learning is the core thesis of the NeurIPS Education Track.',
      progressText: `${Math.min(routesCount, 4)} / 4 modules explored`,
      actionRoute: '/learn',
      actionLabel: 'Explore Pathway',
    },
    {
      id: 'hypothesis-tester',
      name: 'Attractor Explorer',
      desc: 'Executed at least 3 custom parameter experiments in the laboratory',
      unlocked: experimentsCount >= 3,
      icon: Sliders,
      rarity: 'Rare',
      historicalFact:
        'John J. Hopfield (1982) demonstrated that associative memories correspond to local energy minima in symmetric neural graphs.',
      progressText: `${Math.min(experimentsCount, 3)} / 3 simulations conducted`,
      actionRoute: '/playground',
      actionLabel: 'Open Sandbox',
    },
    {
      id: 'pytorch-practitioner',
      name: 'Synaptic Coder',
      desc: 'Executed recurrent tensor update code cells in the interactive notebook',
      unlocked: notebookCount >= 3,
      icon: FileText,
      rarity: 'Rare',
      historicalFact:
        'Donald Hebb formulated Hebbian learning in 1949: "Neurons that fire together, wire together" (ΔW = η·x·yᵀ).',
      progressText: `${Math.min(notebookCount, 3)} / 3 code cells run`,
      actionRoute: '/notebook',
      actionLabel: 'Open Notebook',
    },
    {
      id: 'frontier-theorist',
      name: 'Literature Scholar',
      desc: 'Read through the landmark research papers bridging Hopfield to BDH-CQ',
      unlocked: Boolean(progress.completedRoutes['/papers']),
      icon: BookOpen,
      rarity: 'Rare',
      historicalFact:
        'The Pathway AI research group published the Dragon Hatchling (BDH) architecture in 2025, solving lifelong learning without backpropagation.',
      progressText: progress.completedRoutes['/papers'] ? 'Completed' : 'Unvisited',
      actionRoute: '/papers',
      actionLabel: 'Read Papers',
    },
    {
      id: 'foundations-master',
      name: 'Foundations Builder',
      desc: 'Reviewed and verified key neuro-AI mathematical prerequisites',
      unlocked: prereqsCount >= 3,
      icon: ShieldCheck,
      rarity: 'Common',
      historicalFact:
        'Lyapunov stability conditions and non-negative matrix projections form the bedrock of continuous dynamical systems.',
      progressText: `${Math.min(prereqsCount, 3)} / 3 prerequisites verified`,
      actionRoute: '/',
      actionLabel: 'Check Foundations',
    },
    {
      id: 'certified-master',
      name: 'BDH-CQ Certified Master',
      desc: 'Achieved 80% or higher on the rigorous Knowledge Check assessment',
      unlocked: quizScoreObj ? quizScoreObj.score / quizScoreObj.total >= 0.8 : false,
      icon: Award,
      rarity: 'Legendary',
      historicalFact:
        'Continuous Query (CQ) reasoning on the ARC-AGI benchmark represents a breakthrough in resource-efficient broad abstraction.',
      progressText: quizScoreObj ? `${quizScoreObj.score} / ${quizScoreObj.total} correct` : 'Quiz not taken',
      actionRoute: '/knowledge-check',
      actionLabel: 'Take Assessment',
    },
  ];

  // Competency skills data
  const competencies = [
    {
      id: 'recurrence',
      title: 'Recurrent Dynamics & Hopfield Attractors',
      percentage: Math.min(100, Math.round((Boolean(progress.completedRoutes['/concept']) ? 40 : 10) + (experimentsCount > 0 ? 35 : 0) + (quizPercent >= 50 ? 25 : 0))),
      level: experimentsCount >= 2 ? 'Specialist' : 'Apprentice',
      summary: 'Energy landscape convergence ($dE/dt \\le 0$), residual decay tolerances, and basin settling.',
      targetRoute: '/concept' as AppRoute,
    },
    {
      id: 'plasticity',
      title: 'Hebbian Synaptic Plasticity & Homeostasis',
      percentage: Math.min(100, Math.round((Boolean(progress.completedRoutes['/bdh']) ? 40 : 10) + (notebookCount >= 2 ? 35 : 0) + (prereqsCount >= 2 ? 25 : 0))),
      level: notebookCount >= 2 ? 'Practitioner' : 'Developing',
      summary: 'Online synaptic weight updates ($\\Delta W = \\eta x y^T$), decay regularization, and zero-backprop in-context learning.',
      targetRoute: '/bdh' as AppRoute,
    },
    {
      id: 'sparsity',
      title: 'Sparse Projections & Monosemanticity',
      percentage: Math.min(100, Math.round((Boolean(progress.completedRoutes['/experiment']) ? 45 : 10) + (experimentsCount >= 1 ? 30 : 0) + (quizPercent >= 60 ? 25 : 0))),
      level: experimentsCount >= 1 ? 'Specialist' : 'Novice',
      summary: 'Non-negative thresholding ($\\theta$), scale-free cortical graphs, and preventing polysemantic vector superposition.',
      targetRoute: '/experiment' as AppRoute,
    },
    {
      id: 'continuous-query',
      title: 'ARC-AGI Continuous Query Deliberation',
      percentage: Math.min(100, Math.round((Boolean(progress.completedRoutes['/bdh-cq']) ? 50 : 10) + (quizPercent >= 80 ? 50 : 20))),
      level: Boolean(progress.completedRoutes['/bdh-cq']) ? 'Master' : 'Explorer',
      summary: 'Eliminating token verbalization latency, solving novel spatial grid rules, and reaching $0.0007 cost-efficiency.',
      targetRoute: '/bdh-cq' as AppRoute,
    },
    {
      id: 'theory',
      title: 'Frontier Literature & Neuro-AI History',
      percentage: Math.min(100, Math.round((Boolean(progress.completedRoutes['/papers']) ? 55 : 15) + (prereqsCount >= 3 ? 45 : 15))),
      level: Boolean(progress.completedRoutes['/papers']) ? 'Specialist' : 'Developing',
      summary: 'Synthesizing Hopfield (1982), Hebb (1949), Chollet ARC-AGI (2019), and Pathway BDH (2025).',
      targetRoute: '/papers' as AppRoute,
    },
  ];

  // Concept constellation nodes
  const conceptNodes = [
    {
      id: 'hopfield',
      name: 'Hopfield Attractor Basin',
      formula: 'dE/dt \\le 0',
      description: 'The mathematical guarantee that recurrent states settle into stable associative memory attractors without runaway oscillations.',
      route: '/concept' as AppRoute,
      category: 'Recurrent Physics',
    },
    {
      id: 'hebbian',
      name: 'Hebbian Synaptic Imprinting',
      formula: '\\Delta W = \\eta \\cdot x y^T',
      description: 'Online synaptic weight modifications occurring during the forward pass, absorbing demonstrations without backpropagation.',
      route: '/bdh' as AppRoute,
      category: 'Biological Memory',
    },
    {
      id: 'monosemanticity',
      name: 'Non-Negative Sparsity',
      formula: 'h_t = \\max(0, W_{rec} h_{t-1} - \\theta)',
      description: 'Biologically plausible thresholding that forces neurons to fire independently along sparse, human-interpretable feature axes.',
      route: '/experiment' as AppRoute,
      category: 'Interpretability',
    },
    {
      id: 'cq-deliberation',
      name: 'Continuous Query (CQ)',
      formula: '\\text{Cost} \\approx \\$0.0007 / \\text{task}',
      description: 'Decoupling thinking time from output token generation by cycling internally in latent representations.',
      route: '/bdh-cq' as AppRoute,
      category: 'ARC-AGI Architecture',
    },
    {
      id: 'scale-free',
      name: 'Scale-Free Cortical Connectivity',
      formula: 'P(k) \\sim k^{-\\gamma}',
      description: 'Cortical hub topology enabling efficient global communication across sparse clusters with minimal wiring cost.',
      route: '/playground' as AppRoute,
      category: 'Network Topology',
    },
    {
      id: 'arc-broad',
      name: 'Broad Generalization',
      formula: 'G_{broad} = f(K \\le 3 \\text{ demos})',
      description: 'The ability to synthesize unseen spatial and logical transformations on ARC-AGI without retraining.',
      route: '/knowledge-check' as AppRoute,
      category: 'Intelligence Evaluation',
    },
  ];

  // Quests data
  const quests = [
    {
      id: 'q1',
      title: 'Unravel Recurrent Latent Deliberation',
      route: '/concept' as AppRoute,
      completed: Boolean(progress.completedRoutes['/concept']),
      xp: 150,
      desc: 'Step through the 8 visual explainer chapters to build foundational intuition.',
    },
    {
      id: 'q2',
      title: 'Conduct Attractor Basin Experiments',
      route: '/playground' as AppRoute,
      completed: experimentsCount >= 3,
      xp: 200,
      desc: 'Run at least 3 custom parameter adjustments (T, θ, η) in the live sandbox.',
    },
    {
      id: 'q3',
      title: 'Inspect BDH vs Transformer Mechanisms',
      route: '/experiment' as AppRoute,
      completed: Boolean(progress.completedRoutes['/experiment']),
      xp: 150,
      desc: 'Toggle between baseline verbalization and biologically inspired internal recurrence.',
    },
    {
      id: 'q4',
      title: 'Run PyTorch Latent Recurrence Cells',
      route: '/notebook' as AppRoute,
      completed: notebookCount >= 3,
      xp: 250,
      desc: 'Execute real tensor operations implementing online synaptic weight updates.',
    },
    {
      id: 'q5',
      title: 'Explore the Research Literature',
      route: '/papers' as AppRoute,
      completed: Boolean(progress.completedRoutes['/papers']),
      xp: 150,
      desc: 'Study the theoretical bridges connecting Hopfield networks to modern BDH-CQ.',
    },
    {
      id: 'q6',
      title: 'Achieve 80%+ on Mastery Assessment',
      route: '/knowledge-check' as AppRoute,
      completed: quizScoreObj ? quizScoreObj.score / quizScoreObj.total >= 0.8 : false,
      xp: 350,
      desc: 'Test your understanding on multi-stage scenario questions inspired by NeurIPS 2026.',
    },
  ];

  // Certificate metadata
  const certificateId = useMemo(() => {
    let hash = 42;
    for (let i = 0; i < scholarName.length; i++) {
      hash = (hash * 31 + scholarName.charCodeAt(i)) % 99999;
    }
    return `NURIPS-2026-BDH-${hash.toString(16).toUpperCase().padStart(4, '0')}`;
  }, [scholarName]);

  const issuanceDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const handleSaveScholarName = () => {
    if (tempName.trim()) {
      setScholarName(tempName.trim());
      localStorage.setItem('ai_concept_lab_scholar_name', tempName.trim());
    }
    setIsEditingName(false);
    showToast('Scholar profile name updated.');
  };

  const handleCopyCredentials = () => {
    const text = `NeurIPS 2026 AI Concept Lab Certification\nScholar: ${scholarName}\nCredential ID: ${certificateId}\nLevel: ${currentLevel} (${rankTitle})\nIssued: ${issuanceDate}\nVerification: https://neurips2026-education.ai/verify/${certificateId}`;
    navigator.clipboard.writeText(text);
    showToast('Academic verification credentials copied to clipboard!');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleExportPortfolio = () => {
    const data = {
      scholarName,
      certificateId,
      issuanceDate,
      rankTitle,
      currentLevel,
      baseExperiencePoints,
      routesCompleted: progress.completedRoutes,
      experimentsRunCount: experimentsCount,
      notebookCellsExecuted: notebookCount,
      quizScore: progress.quizScore,
      prerequisitesKnown: progress.prerequisitesKnown,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-concept-lab-${scholarName.toLowerCase().replace(/\s+/g, '-')}-portfolio.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Learner portfolio exported as JSON.');
  };

  const handleTeaserOptionClick = (idx: number) => {
    if (teaserAnswered) return;
    setSelectedTeaserOption(idx);
    setTeaserAnswered(true);

    const isCorrect = TEASER_QUESTIONS[activeTeaserIdx].options[idx].correct;
    if (isCorrect) {
      fireCelebration();
      const newBonus = bonusXpEarned + 60;
      setBonusXpEarned(newBonus);
      localStorage.setItem('ai_concept_lab_bonus_xp', newBonus.toString());
      showToast('Correct! +60 Bonus Research XP awarded.');
    }
  };

  const handleNextTeaser = () => {
    setSelectedTeaserOption(null);
    setTeaserAnswered(false);
    setActiveTeaserIdx((prev) => (prev + 1) % TEASER_QUESTIONS.length);
  };

  const currentTeaser = TEASER_QUESTIONS[activeTeaserIdx];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-900/90 text-white text-xs font-bold shadow-2xl border border-white/20 backdrop-blur-md animate-fadeIn no-print">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-6 no-print">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Scholar Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
            Learning Progress & Mastery Status
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Track your experimental discoveries, theoretical mastery, and validated competencies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportPortfolio}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-medium hover:bg-white text-stone-700 border border-white/90 text-xs font-bold cursor-pointer transition-all shadow-2xs hover:shadow-xs"
            title="Download your research progress log as JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            id="btn-open-reset-modal"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-medium hover:bg-rose-50/60 text-stone-600 hover:text-rose-700 border border-white/90 text-xs font-medium cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
            title="Reset your completed modules, experiments, and scores"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* 1. Scholar Identity & Live Experience (XP) Level Bar */}
      <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 shadow-xl glass-specular space-y-6 relative overflow-hidden no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Name */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md border border-amber-400/40 flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveScholarName()}
                      className="text-base sm:text-lg font-bold text-stone-900 border border-amber-400/60 rounded-xl px-2.5 py-1 bg-amber-50/60 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-display"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveScholarName}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="px-2 py-1 text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
                      {scholarName}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setTempName(scholarName);
                        setIsEditingName(true);
                      }}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Edit Scholar Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="text-xs font-bold text-amber-950 bg-amber-500/15 px-3 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs font-mono">
                  Level {currentLevel}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-1.5 font-normal">
                <span className="font-semibold text-stone-800">{rankTitle}</span>
                <span className="text-stone-400">•</span>
                <span className="font-mono text-xs text-amber-900 font-bold">{baseExperiencePoints} Research XP</span>
              </p>
            </div>
          </div>

          {/* Quick Celebration Trigger */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={fireCelebration}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-medium hover:bg-white text-amber-950 border border-amber-300/60 text-xs font-bold cursor-pointer transition-all shadow-2xs hover:shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Celebrate Progress</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-stone-200/50">
          <div className="flex justify-between text-xs font-medium text-stone-600">
            <span>Rank Progress to Next Mastery Level</span>
            <span className="font-mono text-stone-900 font-bold">
              {baseExperiencePoints} / {nextLevelXp} XP ({levelProgressPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-stone-200/60 backdrop-blur-xs rounded-full overflow-hidden border border-white/80 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
        <div
          onClick={() => onNavigate('/learn')}
          className="p-5 rounded-3xl glass-strong border border-white/90 space-y-1 shadow-lg glass-specular cursor-pointer hover:border-amber-400/80 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Modules Visited</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-stone-900">{routesCount} / 8</div>
          <p className="text-[11px] text-stone-500 font-normal">Curriculum engagement</p>
        </div>

        <div
          onClick={() => onNavigate('/playground')}
          className="p-5 rounded-3xl glass-strong border border-white/90 space-y-1 shadow-lg glass-specular cursor-pointer hover:border-amber-400/80 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Simulations Run</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-900">{experimentsCount}</div>
          <p className="text-[11px] text-stone-500 font-normal">Live parameter tests</p>
        </div>

        <div
          onClick={() => onNavigate('/notebook')}
          className="p-5 rounded-3xl glass-strong border border-white/90 space-y-1 shadow-lg glass-specular cursor-pointer hover:border-amber-400/80 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Code Executions</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-stone-900">{notebookCount} / 5</div>
          <p className="text-[11px] text-stone-500 font-normal">PyTorch cells executed</p>
        </div>

        <div
          onClick={() => onNavigate('/knowledge-check')}
          className="p-5 rounded-3xl glass-strong border border-white/90 space-y-1 shadow-lg glass-specular cursor-pointer hover:border-amber-400/80 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Quiz Accuracy</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-950">{quizScoreText}</div>
          <p className="text-[11px] text-stone-500 font-normal">
            {quizScoreObj ? `${quizPercent}% mastery score` : 'Ready to evaluate'}
          </p>
        </div>
      </div>

      {/* 3. Daily Knowledge Pulse / Interactive Mini-Challenge */}
      <div className="p-6 sm:p-7 rounded-3xl glass-strong border border-amber-300/80 shadow-xl glass-specular space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-950 font-bold border border-amber-300/60 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 font-display">
                Quick Frontier Brain Teaser ({activeTeaserIdx + 1} of {TEASER_QUESTIONS.length})
              </h3>
              <p className="text-[11px] text-stone-600 font-normal">Test your immediate conceptual recall and earn +60 Research XP</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextTeaser}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Next Question</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-950 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs">
              {currentTeaser.concept}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-relaxed font-display">
              {currentTeaser.question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {currentTeaser.options.map((opt, idx) => {
              const isSelected = selectedTeaserOption === idx;
              let btnStyle = 'glass-light hover:bg-white text-stone-700 border-white/80';

              if (teaserAnswered) {
                if (opt.correct) {
                  btnStyle = 'bg-emerald-500/15 text-emerald-950 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs';
                } else if (isSelected && !opt.correct) {
                  btnStyle = 'bg-rose-500/15 text-rose-950 border-rose-400 shadow-xs';
                } else {
                  btnStyle = 'glass-light/50 text-stone-400 border-white/60 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTeaserOptionClick(idx)}
                  disabled={teaserAnswered}
                  className={`text-left p-3 rounded-2xl border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span className="font-normal">{opt.text}</span>
                  {teaserAnswered && opt.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {teaserAnswered && (
            <div className="p-3.5 rounded-2xl glass-light border border-amber-300/60 text-xs text-stone-700 space-y-1 animate-fadeIn shadow-2xs">
              <span className="font-bold text-stone-900 font-display">Why this matters:</span>
              <p className="leading-relaxed text-stone-600 font-normal">{currentTeaser.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Interactive Tabs: Competency Matrix / Concept Constellation / Research Quests */}
      <div className="space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-3">
          <div className="flex items-center gap-1.5 p-1 glass-medium rounded-2xl border border-white/80 self-start shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('competencies')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'competencies'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Competency Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('constellation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'constellation'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Concept Constellation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quests'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Research Quests ({quests.filter((q) => q.completed).length}/{quests.length})
            </button>
          </div>

          <span className="text-xs text-stone-500 font-medium font-mono">
            Interactive skill verification & roadmap
          </span>
        </div>

        {/* Tab 1: Competency Breakdown */}
        {activeTab === 'competencies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map((comp) => (
              <div
                key={comp.id}
                className="p-5 rounded-3xl glass-strong border border-white/90 shadow-lg glass-specular space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-950 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 font-mono">
                      {comp.level}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-900">
                      {comp.percentage}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 font-display">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {comp.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="w-full h-2 bg-stone-200/60 backdrop-blur-xs rounded-full overflow-hidden border border-white/80">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${comp.percentage}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(comp.targetRoute)}
                    className="w-full py-2 glass-light hover:bg-white text-stone-800 text-xs font-bold rounded-xl border border-white/90 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Train this Competency</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Concept Constellation */}
        {activeTab === 'constellation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl glass-light border border-amber-300/50 text-xs text-stone-700 shadow-2xs font-normal">
              <span className="font-bold text-amber-950 font-display">Interactive Concept Constellation:</span> Click any principle to inspect its foundational formula, mental model, and direct laboratory sandbox link.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conceptNodes.map((node) => {
                const isSelected = selectedConcept === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedConcept(isSelected ? null : node.id)}
                    className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-3 shadow-lg glass-specular ${
                      isSelected
                        ? 'glass-strong border-amber-400 ring-4 ring-amber-400/20'
                        : 'glass-strong border-white/90 hover:border-amber-300/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-stone-600 glass-light px-2 py-0.5 rounded-full border border-white/80 font-mono">
                        {node.category}
                      </span>
                      <span className="text-xs text-amber-800 font-bold">
                        {isSelected ? 'Active' : 'Inspect'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 font-display">
                      {node.name}
                    </h4>

                    <div className="p-2 glass-light rounded-xl border border-white/80 font-mono text-[11px] text-amber-950 font-bold text-center shadow-2xs">
                      {node.formula}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {node.description}
                    </p>

                    <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(node.route);
                        }}
                        className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Open Lab Module</span>
                        <ArrowRight className="w-3 h-3 text-amber-700" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Research Quests */}
        {activeTab === 'quests' && (
          <div className="space-y-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                onClick={() => onNavigate(quest.route)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg glass-specular group ${
                  quest.completed
                    ? 'glass-strong border-white/90 hover:border-amber-300/80'
                    : 'glass-medium border-white/80 hover:border-amber-300/80'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      quest.completed
                        ? 'bg-emerald-500/15 text-emerald-950 border border-emerald-300/70 shadow-xs'
                        : 'glass-light text-stone-500 border border-white/80'
                    }`}
                  >
                    {quest.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors font-display">
                        {quest.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs">
                        +{quest.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-xl font-normal">
                      {quest.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center text-xs font-bold text-stone-600 group-hover:text-amber-900 transition-colors">
                  <span>{quest.completed ? 'Review Quest' : 'Launch Quest'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-700" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Achievement Trophy Cabinet (Milestone Badges) */}
      <div className="space-y-6 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Achievement Milestones & Trophies
            </h2>
            <p className="text-xs text-stone-500 font-normal">Click any badge to inspect its historical background & criteria</p>
          </div>
          <span className="text-xs font-bold text-amber-950 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-300/60 font-mono backdrop-blur-xs">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBadge(b)}
                className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-lg glass-specular hover:shadow-xl ${
                  b.unlocked
                    ? 'glass-strong border-amber-300/80 hover:border-amber-400'
                    : 'glass-medium border-white/80 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                        b.unlocked
                          ? 'bg-amber-500/20 text-amber-950 border border-amber-300/60'
                          : 'glass-light text-stone-400 border border-white/80'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full glass-light text-stone-600 border border-white/80 font-mono">
                      {b.rarity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-stone-900 font-display">{b.name}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-normal">{b.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-[11px] font-medium">
                  {b.unlocked ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-stone-400 font-medium">Progress: {b.progressText}</span>
                  )}
                  <span className="text-amber-900 font-bold text-[10px]">Inspect &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md animate-fadeIn no-print">
          <div className="glass-strong border border-white/90 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5 glass-specular">
            <div className="flex items-start justify-between border-b border-stone-200/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                    selectedBadge.unlocked
                      ? 'bg-amber-500/20 text-amber-950 border border-amber-300/60'
                      : 'glass-light text-stone-400 border border-white/80'
                  }`}
                >
                  <selectedBadge.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-950 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 font-mono">
                    {selectedBadge.rarity} Badge
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-display mt-0.5">
                    {selectedBadge.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3.5 glass-light rounded-2xl border border-white/80 space-y-1 shadow-2xs">
                <span className="font-bold text-stone-900 font-display">Unlock Requirement:</span>
                <p className="font-normal">{selectedBadge.desc}</p>
                <p className="text-[11px] text-amber-900 font-bold pt-1 font-mono">
                  Status: {selectedBadge.progressText}
                </p>
              </div>

              <div className="p-3.5 glass-light rounded-2xl border border-amber-300/50 space-y-1 shadow-2xs">
                <span className="font-bold text-amber-950 font-display">Historical & Scientific Context:</span>
                <p className="leading-relaxed text-stone-600 font-normal">{selectedBadge.historicalFact}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {selectedBadge.unlocked ? (
                <button
                  type="button"
                  onClick={() => {
                    fireCelebration();
                    showToast('Milestone celebration triggered!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border border-amber-400/40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Confetti</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBadge(null);
                    onNavigate(selectedBadge.actionRoute);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border border-amber-400/40"
                >
                  <span>{selectedBadge.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 glass-medium hover:bg-white text-stone-700 rounded-xl text-xs font-medium cursor-pointer border border-white/80 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Progress Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md animate-fadeIn no-print">
          <div className="glass-strong border border-white/90 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-5 glass-specular">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-300/60 text-rose-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Reset Learning Progress?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  This will reset your completed curriculum modules, executed experiments, notebook code cells, and quiz scores back to baseline (Level 1, 0 XP).
                </p>
              </div>
            </div>

            <div className="p-3.5 glass-light rounded-2xl border border-amber-300/40 text-[11px] text-amber-950 font-normal">
              Your scholar identity name will be preserved, but all achievement milestones and verified competencies will be reset so you can test your knowledge afresh.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="btn-cancel-reset"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 glass-medium hover:bg-white text-stone-700 rounded-xl text-xs font-medium cursor-pointer border border-white/80 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-reset-progress"
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98] border border-rose-400/40 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Printable Academic Certificate of Completion */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              NeurIPS 2026 Academic Credential
            </h2>
            <p className="text-xs text-stone-500 font-normal">
              Personalized certificate reflecting your hands-on verification of BDH-CQ latent reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-medium hover:bg-white text-stone-800 border border-white/90 text-xs font-bold cursor-pointer transition-all shadow-2xs hover:shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCredentials}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] border border-amber-400/40"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Credential</span>
            </button>
          </div>
        </div>

        {/* The Certificate Canvas */}
        <div
          id="academic-certificate-canvas"
          className="print-certificate-only p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFFDF9]/95 via-[#FAF6ED]/95 to-[#F5EFE0]/95 backdrop-blur-md border-2 border-amber-300/80 shadow-xl space-y-8 relative overflow-hidden"
        >
          {/* Subtle Decorative Guilloche/Border */}
          <div className="absolute inset-2 sm:inset-3 border border-amber-400/40 rounded-2xl pointer-events-none" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-950 border border-amber-300 backdrop-blur-xs font-mono">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>NeurIPS 2026 Education Track Inspired • AI Concept Lab</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
              Certificate of Frontier-AI Completion
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-normal">
              This academic credential certifies active participation in interactive hypothesis testing, biological synaptic plasticity, and recurrent latent reasoning.
            </p>
          </div>

          {/* Recipient Name */}
          <div className="text-center space-y-2 relative z-10 py-4 border-y border-amber-300/60">
            <span className="text-xs uppercase font-bold tracking-widest text-stone-500 font-mono">
              PROUDLY CONFERRED UPON
            </span>
            <div className="text-2xl sm:text-4xl font-bold text-stone-900 font-display italic tracking-wide">
              {scholarName}
            </div>
            <p className="text-xs text-stone-600 font-normal">
              Achieved Rank: <strong className="text-stone-900 font-semibold">{rankTitle}</strong> (Level {currentLevel} • {baseExperiencePoints} XP)
            </p>
          </div>

          {/* Verified Competencies Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 relative z-10">
            <div className="flex items-center gap-2 glass-light p-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-normal">Hopfield Energy Landscapes ($dE/dt \le 0$)</span>
            </div>
            <div className="flex items-center gap-2 glass-light p-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-normal">Online Hebbian Synaptic Plasticity ($\Delta W = \eta x y^T$)</span>
            </div>
            <div className="flex items-center gap-2 glass-light p-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-normal">Monosemantic Sparsity Thresholding ($\theta$)</span>
            </div>
            <div className="flex items-center gap-2 glass-light p-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-normal">ARC-AGI Continuous Query ($0.0007 / task)</span>
            </div>
          </div>

          {/* Signatures & Credentials Footer */}
          <div className="pt-4 border-t border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-600 relative z-10">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-mono text-[11px] text-stone-800 font-bold">
                Credential ID: {certificateId}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                Issued on: {issuanceDate}
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic font-bold text-sm text-stone-900">
                AI Concept Lab Academic Committee
              </div>
              <div className="text-[11px] text-amber-900 font-medium font-mono">
                Verified Interactive Educational Submission
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
