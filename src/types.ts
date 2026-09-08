/**
 * Core type definitions for ThinkLoop — See. Change. Understand.
 * Topic: Recurrent Latent Reasoning & Biologically-Inspired Dynamic Memory (BDH / BDH-CQ)
 */

export type AppRoute =
  | '/'
  | '/learn'
  | '/concept'
  | '/playground'
  | '/bdh'
  | '/bdh-cq'
  | '/experiment'
  | '/notebook'
  | '/papers'
  | '/knowledge-check'
  | '/progress'
  | '/about';

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  targetRoute: AppRoute;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Prerequisite {
  id: string;
  title: string;
  category: 'ML Basics' | 'Linear Algebra' | 'Neuro-AI' | 'Reasoning';
  summary: string;
  refresher: string;
  formula?: string;
  known: boolean;
}

export interface SimulationParams {
  reasoningEffort: number; // T: recurrence steps (1 to 24)
  sparsityThreshold: number; // theta: non-negative activation cutoff (0.0 to 0.95)
  hebbianRate: number; // eta: online synaptic plasticity learning rate (0.0 to 0.1)
  decayFactor: number; // alpha: synaptic weight decay / homeostasis (0.01 to 0.2)
  networkScale: number; // N: number of active neuron particles (16 to 128)
  inputDemonstrations: number; // K: in-context demonstrations (1 to 6)
  noiseLevel: number; // perturbation/stochasticity (0 to 0.3)
}

export interface SimulationOutput {
  energy: number;
  convergenceStep: number;
  monosemanticityScore: number;
  passProbability: number;
  activeNeuronsCount: number;
  inferenceCostPerTask: number; // in USD
  latencyMs: number;
  trajectory: { step: number; latentNorm: number; residualDelta: number; entropy: number }[];
  spikes: { id: number; x: number; y: number; rate: number; isSpiking: boolean; concept: string }[];
  gridState: number[][]; // 2D grid for ARC task pattern demonstration
}

export interface ConceptStep {
  id: number;
  code: string; // e.g. "STEP 01"
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: string[];
  formula?: string;
  formulaMeaning?: { symbol: string; meaning: string }[];
  deepDive: string;
  interactivePrompt: string;
}

export interface PaperReference {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  arxivId?: string;
  summary: string;
  keyBreakthrough: string;
  connectionToBDH: string;
  tags: string[];
  pdfUrl?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'prediction' | 'slider_reasoning' | 'visual_interpretation' | 'true_false';
  question: string;
  scenario?: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  correctSliderValue?: number;
  tolerance?: number;
  minSlider?: number;
  maxSlider?: number;
  sliderUnit?: string;
  explanation: string;
  visualHint?: string;
  conceptSectionId: number;
}

export interface NotebookCell {
  id: string;
  type: 'markdown' | 'code';
  title?: string;
  content: string; // text or python-like code
  predictionPrompt?: string;
  predictionOptions?: string[];
  userPrediction?: string;
  output?: string;
  visualOutput?: 'latent_trace' | 'hebbian_matrix' | 'spikes_raster' | 'arc_solution';
  reflectionQuestion?: string;
  reflectionNotes?: string;
  isExecuted: boolean;
}

export interface UserProgress {
  completedRoutes: Record<string, boolean>;
  objectivesCompleted: Record<string, boolean>;
  prerequisitesKnown: Record<string, boolean>;
  quizScores: Record<string, boolean>;
  quizScore?: { score: number; total: number };
  experimentsRunCount: number;
  experimentsCount: number;
  notebookCompletedCells: Record<string, boolean>;
  notebookExecutedCells: string[];
  reducedMotion: boolean;
  lastVisitedRoute: AppRoute;
}
