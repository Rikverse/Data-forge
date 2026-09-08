/**
 * Simulation Engine for Recurrent Latent Reasoning & BDH / BDH-CQ Dynamics
 */
import { SimulationParams, SimulationOutput } from '../types';

// Neuron concept dictionary for monosemantic interpretation
const NEURON_CONCEPTS = [
  'Symmetry Axis (Vertical)',
  'Color Inversion Rule',
  'Bounding Box Enclosure',
  'Gravity Shift (Downwards)',
  'Topological Connectivity',
  'Repetition Periodicity',
  'Object Mass Center',
  'Diagonal Reflection',
  'Background Noise Rejection',
  'Sub-goal Completion Marker',
  'Demonstration Affinity Matrix',
  'Hebbian Plasticity Gate',
  'Spatial Boundary Detector',
  'Spike Coincidence Filter',
  'Continuous Query Alignment',
  'Energy Minimum Attractor',
];

/**
 * Executes a simulated run of BDH-CQ recurrent latent reasoning
 */
export function runSimulation(params: SimulationParams): SimulationOutput {
  const {
    reasoningEffort, // T: 1 to 24 steps
    sparsityThreshold, // theta: 0.0 to 0.95
    hebbianRate, // eta: 0.0 to 0.1
    decayFactor, // alpha: 0.01 to 0.2
    networkScale, // N: 16 to 128
    inputDemonstrations, // K: 1 to 6
    noiseLevel,
  } = params;

  // Trajectory simulation
  const trajectory: { step: number; latentNorm: number; residualDelta: number; entropy: number }[] = [];
  let currentLatentNorm = 1.0;
  let prevLatentNorm = 0.0;

  // Compute energy and convergence
  // As reasoning effort increases, latent state settles into an attractor
  for (let t = 1; t <= reasoningEffort; t++) {
    // Diminishing delta represents convergence toward a latent fixed-point
    const decayRate = 0.28 + hebbianRate * 1.5;
    const residualDelta = Math.max(0.002, (1.8 / (1 + t * decayRate)) * (1 + (Math.random() - 0.5) * noiseLevel));
    currentLatentNorm = Math.min(4.5, 1.2 + Math.log(1 + t * 0.4) * (1 - sparsityThreshold * 0.4));
    const entropy = Math.max(0.08, 1.5 - (t / reasoningEffort) * (1.1 + sparsityThreshold * 0.3));

    trajectory.push({
      step: t,
      latentNorm: Number(currentLatentNorm.toFixed(3)),
      residualDelta: Number(residualDelta.toFixed(4)),
      entropy: Number(entropy.toFixed(3)),
    });

    prevLatentNorm = currentLatentNorm;
  }

  // Energy: E(h) drops as reasoning settles into attractor basin
  const finalDelta = trajectory[trajectory.length - 1]?.residualDelta ?? 0.1;
  const energy = Number((-12.5 * (1 - finalDelta) * (1 + inputDemonstrations * 0.15)).toFixed(2));

  // Convergence step: when residualDelta drops below 0.05
  const convIndex = trajectory.findIndex((p) => p.residualDelta < 0.04);
  const convergenceStep = convIndex === -1 ? reasoningEffort : convIndex + 1;

  // Monosemanticity score: promoted by high sparsity threshold and low noise
  const rawMonosemanticity = (sparsityThreshold * 0.65 + (1 - noiseLevel) * 0.25 + (1 / (1 + decayFactor)) * 0.1) * 100;
  const monosemanticityScore = Number(Math.min(99.4, Math.max(15.0, rawMonosemanticity)).toFixed(1));

  // Pass probability on ARC-style task:
  // Scales with reasoning effort up to an optimal plateau, aided by demonstrations and appropriate sparsity
  const effortBonus = Math.min(1.0, (reasoningEffort / 14) * (1.1 - 0.1 * (reasoningEffort > 18 ? (reasoningEffort - 18) * 0.05 : 0)));
  const demoBonus = Math.min(0.35, inputDemonstrations * 0.07);
  const sparsityOptimal = 1 - Math.abs(sparsityThreshold - 0.62) * 1.3;
  const passProbability = Number(Math.min(94.8, Math.max(4.2, (effortBonus * 0.55 + demoBonus + Math.max(0, sparsityOptimal) * 0.2) * 100)).toFixed(1));

  // Active neurons count: percentage of neurons above sparsity threshold
  const activeFraction = Math.max(0.04, 1.0 - sparsityThreshold * 0.88);
  const activeNeuronsCount = Math.round(networkScale * activeFraction);

  // Spikes generation
  const spikes = Array.from({ length: Math.min(36, networkScale) }, (_, i) => {
    // Generate layout on ring/grid
    const angle = (i / Math.min(36, networkScale)) * Math.PI * 2;
    const radius = 90 + ((i % 3) * 25);
    const x = Math.round(150 + Math.cos(angle) * radius);
    const y = Math.round(150 + Math.sin(angle) * radius);
    const isSpiking = (i % Math.ceil(1 / activeFraction)) === 0;
    const rate = isSpiking ? Number((0.4 + Math.random() * 0.6).toFixed(2)) : Number((Math.random() * 0.15).toFixed(2));
    const concept = NEURON_CONCEPTS[i % NEURON_CONCEPTS.length];

    return { id: i, x, y, rate, isSpiking, concept };
  });

  // Inference cost per task:
  // BDH-CQ recurrent step costs ~ $0.00003 per step, whereas LLM CoT verbalization costs ~$0.015 - $0.05
  const baseCost = 0.0002;
  const stepCost = 0.000035;
  const inferenceCostPerTask = Number((baseCost + reasoningEffort * stepCost * (networkScale / 32)).toFixed(5));

  // Latency in milliseconds: ~ 1.2ms per latent step
  const latencyMs = Number((14 + reasoningEffort * 2.8 + (networkScale / 16) * 1.5).toFixed(1));

  // ARC 4x4 Grid State: represents test output evolving toward ground truth as effort increases
  const gridState = generateArcGrid(reasoningEffort, passProbability);

  return {
    energy,
    convergenceStep,
    monosemanticityScore,
    passProbability,
    activeNeuronsCount,
    inferenceCostPerTask,
    latencyMs,
    trajectory,
    spikes,
    gridState,
  };
}

/**
 * Simulates the ARC task grid pattern resolving through recurrent latent reasoning
 */
function generateArcGrid(effort: number, passProb: number): number[][] {
  // Target pattern: 4x4 symmetric cross / diamond with center highlight
  // 0: dark/empty, 1: blue, 2: emerald/target, 3: amber, 4: purple
  const target = [
    [0, 2, 2, 0],
    [2, 3, 3, 2],
    [2, 3, 3, 2],
    [0, 2, 2, 0],
  ];

  if (passProb >= 70 && effort >= 10) {
    return target;
  }

  // Intermediate or noisy grid depending on effort
  const grid: number[][] = [];
  for (let r = 0; r < 4; r++) {
    const row: number[] = [];
    for (let c = 0; c < 4; c++) {
      const correctVal = target[r][c];
      const errorRate = Math.max(0, (100 - passProb) / 100);
      if (Math.random() < errorRate * 0.6) {
        row.push(Math.floor(Math.random() * 4));
      } else {
        row.push(correctVal);
      }
    }
    grid.push(row);
  }
  return grid;
}

export interface PresetExperiment {
  id: string;
  name: string;
  badge: string;
  description: string;
  hypothesis: string;
  recommendedParams: Partial<SimulationParams>;
  takeaway: string;
}

export const PRESET_EXPERIMENTS: PresetExperiment[] = [
  {
    id: 'latent-deliberation',
    name: 'Latent Deliberation Depth (Reasoning Effort T)',
    badge: 'BDH-CQ Core',
    description: 'Observe how increasing internal recurrence steps T allows abstract visual rules to resolve without outputting a single verbal token.',
    hypothesis: 'Beyond T=10, the residual delta converges to zero as the model settles into the correct semantic attractor.',
    recommendedParams: { reasoningEffort: 14, sparsityThreshold: 0.65, hebbianRate: 0.04 },
    takeaway: 'Latent reasoning achieves higher accuracy than shallow passes while avoiding the quadratic cost of generating long chains of natural language words.',
  },
  {
    id: 'monosemantic-sparsity',
    name: 'Sparsity & Non-Negative Projections',
    badge: 'Interpretability',
    description: 'Test the biological constraint of strictly positive, sparse activations versus dense unconstrained representations.',
    hypothesis: 'High sparsity (>0.6) isolates dedicated neuron particles to singular concept invariants (e.g. vertical symmetry).',
    recommendedParams: { reasoningEffort: 10, sparsityThreshold: 0.85, noiseLevel: 0.02 },
    takeaway: 'Sparse positive activations prevent polysemantic superposition, giving BDH built-in monosemantic interpretability without post-hoc SAEs.',
  },
  {
    id: 'sticky-hebbian-memory',
    name: 'Sticky Inference (Online Hebbian Plasticity)',
    badge: 'Continual Learning',
    description: 'Evaluate how synaptic weights adjust dynamically during demonstration presentation (K=5) without weight updates via backprop.',
    hypothesis: 'Demonstrations imprint into fast synaptic states Delta W, allowing instant in-context transfer.',
    recommendedParams: { inputDemonstrations: 5, hebbianRate: 0.08, decayFactor: 0.05 },
    takeaway: 'Synaptic plasticity during inference replaces static KV caches with an active, adaptive neural memory substrate.',
  },
  {
    id: 'cost-frontier',
    name: 'Cost-Accuracy Frontier on ARC-AGI',
    badge: 'Cost Efficiency',
    description: 'Compare the extreme cost-efficiency of BDH-CQ ($0.0007/task) against frontier LLM chain-of-thought ($0.05 - $0.25/task).',
    hypothesis: 'Recurrent latent steps consume orders of magnitude fewer FLOPs than decoding full autoregressive KV blocks.',
    recommendedParams: { reasoningEffort: 12, networkScale: 48 },
    takeaway: 'Reasoning in continuous hidden states unlocks ARC-AGI competitive performance at 1/100th the compute budget.',
  },
];
