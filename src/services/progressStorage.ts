import confetti from 'canvas-confetti';
import { UserProgress, AppRoute } from '../types';

const STORAGE_KEY = 'ai_concept_lab_progress_v1';

export const DEFAULT_PROGRESS: UserProgress = {
  completedRoutes: {
    '/': true,
  },
  objectivesCompleted: {},
  prerequisitesKnown: {},
  quizScores: {},
  quizScore: undefined,
  experimentsRunCount: 0,
  experimentsCount: 0,
  notebookCompletedCells: {},
  notebookExecutedCells: [],
  reducedMotion: false,
  lastVisitedRoute: '/',
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}
export const loadUserProgress = loadProgress;

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}
export const saveUserProgress = saveProgress;

export function recordRouteCompleted(route: AppRoute, current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    lastVisitedRoute: route,
    completedRoutes: {
      ...current.completedRoutes,
      [route]: true,
    },
  };
  saveProgress(updated);
  return updated;
}
export const markRouteVisited = recordRouteCompleted;

export function togglePrerequisite(id: string, current: UserProgress): UserProgress {
  const isKnown = !current.prerequisitesKnown[id];
  const updated: UserProgress = {
    ...current,
    prerequisitesKnown: {
      ...current.prerequisitesKnown,
      [id]: isKnown,
    },
  };
  saveProgress(updated);
  return updated;
}
export const togglePrerequisiteKnown = togglePrerequisite;

export function incrementExperimentsRun(current: UserProgress): UserProgress {
  const count = (current.experimentsRunCount || current.experimentsCount || 0) + 1;
  const updated: UserProgress = {
    ...current,
    experimentsRunCount: count,
    experimentsCount: count,
  };
  saveProgress(updated);
  return updated;
}
export const incrementExperimentCount = incrementExperimentsRun;

export function markNotebookCellExecuted(cellId: string, current: UserProgress): UserProgress {
  const executedCells = Array.from(new Set([...(current.notebookExecutedCells || []), cellId]));
  const updated: UserProgress = {
    ...current,
    notebookCompletedCells: {
      ...current.notebookCompletedCells,
      [cellId]: true,
    },
    notebookExecutedCells: executedCells,
  };
  saveProgress(updated);
  return updated;
}
export const markCellExecuted = markNotebookCellExecuted;

export function recordQuizScore(score: number, total: number, current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    quizScore: { score, total },
  };
  saveProgress(updated);
  return updated;
}

export function recordQuizAnswer(questionId: string, isCorrect: boolean, current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    quizScores: {
      ...current.quizScores,
      [questionId]: isCorrect,
    },
  };
  saveProgress(updated);
  return updated;
}

export function toggleReducedMotion(current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    reducedMotion: !current.reducedMotion,
  };
  saveProgress(updated);
  return updated;
}

export function triggerMilestoneCelebration(): void {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
    });
  } catch {
    // Graceful fallback if canvas is not available
  }
}

export function resetProgress(): UserProgress {
  try {
    localStorage.removeItem('ai_concept_lab_bonus_xp');
  } catch {
    // ignore
  }
  saveProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}
export const resetUserProgress = resetProgress;
