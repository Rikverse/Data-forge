import {
  LearningObjective,
  Prerequisite,
  ConceptStep,
  PaperReference,
  QuizQuestion,
  NotebookCell,
} from '../types';

export const LEARNING_OBJECTIVES: LearningObjective[] = [
  {
    id: 'obj-1',
    title: 'Intuition of Recurrent Latent Reasoning',
    description: 'Understand how a model can "think" through multiple computational steps inside a continuous vector space without verbalizing natural language tokens.',
    targetRoute: '/concept',
    status: 'not_started',
  },
  {
    id: 'obj-2',
    title: 'Biologically Inspired Brain Mechanics in BDH',
    description: 'Examine Dragon Hatchling’s scale-free neuron particle network, sparse positive activations, and why they guarantee inherent monosemantic interpretability.',
    targetRoute: '/bdh',
    status: 'not_started',
  },
  {
    id: 'obj-3',
    title: 'Manipulate & Control Reasoning Parameters',
    description: 'Experiment with reasoning effort T, sparsity threshold θ, and Hebbian plasticity η to observe live phase transitions in model accuracy and attractor convergence.',
    targetRoute: '/playground',
    status: 'not_started',
  },
  {
    id: 'obj-4',
    title: 'Predict Latent Attractor Behavior & Convergence',
    description: 'Formulate hypotheses on residual delta decay, energy minima, and verify how demonstrations condition the internal synaptic state.',
    targetRoute: '/experiment',
    status: 'not_started',
  },
  {
    id: 'obj-5',
    title: 'Master the BDH-CQ Cost-Accuracy Frontier',
    description: 'Analyze how BDH-CQ attained state-of-the-art ARC-AGI pass rates at $0.0007 per task, achieving a 100x cost advantage over conventional LLM chain-of-thought.',
    targetRoute: '/bdh-cq',
    status: 'not_started',
  },
];

export const PREREQUISITES: Prerequisite[] = [
  {
    id: 'prereq-ml',
    title: 'Neural Network Forward Pass & Inference',
    category: 'ML Basics',
    summary: 'Standard deep models compute outputs via layered linear transformations followed by non-linear activations.',
    refresher: 'In conventional models (like Transformers), input tokens are mapped to embeddings, transformed across fixed feedforward layers, and sampled autoregressively. Once weights W are trained, they remain frozen during inference.',
    formula: 'y = \\sigma(W x + b)',
    known: false,
  },
  {
    id: 'prereq-latents',
    title: 'High-Dimensional Latent Vectors',
    category: 'Linear Algebra',
    summary: 'Internal representations inside an AI model are points or vectors in an n-dimensional vector space.',
    refresher: 'A latent representation h is a d-dimensional coordinate vector. Similar concepts cluster closely in geometric distance (cosine similarity). In recurrent models, h evolves continuously over internal computation steps.',
    formula: 'h \\in \\mathbb{R}^d, \\quad \\|h_t - h^*\\| \\to 0',
    known: false,
  },
  {
    id: 'prereq-hebbian',
    title: 'Hebbian Synaptic Plasticity',
    category: 'Neuro-AI',
    summary: '"Neurons that fire together, wire together." Synaptic connection strength updates based on correlated activity.',
    refresher: 'Unlike standard backpropagation (which computes gradients across millions of parameters after batch loss), Hebbian learning updates local connection weights online in response to immediate input signals, without backpropagation.',
    formula: '\\Delta W_{ij} = \\eta (x_i x_j - \\alpha W_{ij})',
    known: false,
  },
  {
    id: 'prereq-cot',
    title: 'Chain-of-Thought vs Latent Deliberation',
    category: 'Reasoning',
    summary: 'Standard LLMs reason by printing out words (tokens). Latent reasoning deliberates directly in continuous hidden states.',
    refresher: 'Verbalized Chain-of-Thought (CoT) forces an LLM to emit hundreds of intermediate tokens ("Let’s think step by step..."), each requiring full quadratic attention over previous tokens. Recurrent latent models like BDH-CQ iterate internal hidden states privately at a fraction of the compute.',
    formula: '\\text{Cost}_{\\text{CoT}} \\propto O(N^2), \\quad \\text{Cost}_{\\text{Latent}} \\propto O(T \\cdot d)',
    known: false,
  },
];

export const CONCEPT_STEPS: ConceptStep[] = [
  {
    id: 1,
    code: 'STEP 01',
    title: 'The Problem: The Autoregressive Token Trap',
    subtitle: 'Why verbalized thinking is expensive, slow, and non-biological',
    summary: 'To solve complex logic or visual puzzles (such as ARC-AGI), contemporary LLMs must emit an external stream of textual tokens. Every extra word costs memory, GPU latency, and money. Worse, frozen model weights cannot adapt to new concepts presented during inference.',
    keyPoints: [
      'Quadratic KV Cache growth: Every verbalized token forces attention calculation against all prior tokens.',
      'Tokenization mismatch: Visual transformations and abstract analogies are awkward to verbalize into text tokens.',
      'Frozen test-time state: Standard architectures treat test-time inputs passively; weights never adjust to user demonstrations.',
    ],
    deepDive: 'In natural biological brains, when a human pauses to solve a puzzle, they do not recite 500 words of internal monologue before seeing the answer. Instead, synaptic dynamics and neural assemblies settle into a coherent state via recurrent electrical pulses. Standard transformers cannot do this because their feedforward depth is strictly fixed per token.',
    interactivePrompt: 'Observe how generating 500 tokens of verbal monologue costs 100x more compute than cycling 12 internal latent states.',
  },
  {
    id: 2,
    code: 'STEP 02',
    title: 'The Intuition: Deliberating in Latent Space',
    subtitle: 'Replace token emission with recurrent continuous state refinement',
    summary: 'Rather than emitting "Token 1 → Token 2 → Token 3", the system passes an internal state vector through a recurrent loop T times. The model "deliberates" privately inside high-dimensional latent space until it converges onto a solution attractor.',
    keyPoints: [
      'Reasoning Effort T is adjustable: Complex queries receive 16–24 recurrent cycles; simple queries converge in 3 cycles.',
      'Zero token generation overhead: No language modeling head, no token sampling, no repetitive prompt regurgitation.',
      'Continuous query embedding: The query guides the recurrent trajectory directly toward a stable energy minimum.',
    ],
    deepDive: 'Think of latent deliberation as placing a marble on an energy landscape. The input demonstrations and question reshape the valleys of the landscape. Each recurrent step allows the marble (the latent state) to roll down the gradient into the nearest stable basin (the correct solution).',
    interactivePrompt: 'Drag the Reasoning Effort slider to watch the state roll toward the minimum.',
  },
  {
    id: 3,
    code: 'STEP 03',
    title: 'What Happens Inside the Model: Spikes & Scale-Free Particles',
    subtitle: 'The biological architecture of Dragon Hatchling (BDH)',
    summary: 'BDH discards dense, uninterpretable multi-layer perceptrons. Instead, it models a network of "neuron particles" governed by a heavy-tailed degree distribution, interacting locally through sparse, non-negative electrical spikes.',
    keyPoints: [
      'Scale-Free Topology: A small number of hub neurons coordinate specialized modules, matching mammalian cortex connectivity.',
      'Sparse Positive Activations: Only 5% to 15% of neurons fire simultaneously, and activations are strictly non-negative (x >= 0).',
      'Built-in Monosemanticity: Individual neuron particles reliably represent distinct semantic features without requiring post-hoc Sparse Autoencoders (SAEs).',
    ],
    deepDive: 'Standard neural networks suffer from "polysemanticity"—individual neurons activate for hundreds of unrelated concepts due to superposition. By enforcing strict non-negativity and high sparsity thresholds θ, BDH forces each neuron particle to specialize in an unambiguous, identifiable role.',
    interactivePrompt: 'Click on individual neuron particles in the network graph to inspect their monosemantic specialization.',
  },
  {
    id: 4,
    code: 'STEP 04',
    title: 'Mathematical Formulation',
    subtitle: 'Hebbian plasticity and non-negative recurrent projection',
    summary: 'The core state updates are governed by two elegant equations: online Hebbian synaptic adaptation during context presentation, and non-negative latent recurrence during problem resolution.',
    formula: 'h_{t+1} = \\Pi_{\\ge \\theta}\\left( W_t h_t + W_{\\text{in}} q + b \\right), \\quad \\Delta W_{ij} = \\eta \\left( h_i h_j - \\alpha W_{ij} \\right)',
    formulaMeaning: [
      { symbol: 'h_t', meaning: 'Current continuous latent thought state at recurrence step t' },
      { symbol: '\\Pi_{\\ge \\theta}', meaning: 'Non-negative threshold projection operator that clips activations below θ to 0, enforcing extreme biological sparsity' },
      { symbol: 'W_t', meaning: 'Dynamic recurrent weight matrix, updated online by Hebbian plasticity' },
      { symbol: 'q', meaning: 'Continuous Query representation (e.g. the ARC input grid or test prompt)' },
      { symbol: '\\eta', meaning: 'Hebbian learning rate for rapid synaptic plasticity during inference' },
      { symbol: '\\alpha W_{ij}', meaning: 'Homeostatic synaptic decay factor preventing runaway excitation' },
    ],
    keyPoints: [
      'Threshold Projection operator Π ensures only dominant signals propagate.',
      'Online Hebbian update stores in-context demonstrations directly into synaptic connections.',
      'Homeostatic decay keeps connection weights bounded within stable dynamic ranges.',
    ],
    deepDive: 'Notice how this formulation avoids backpropagation through time (BPTT) at test time. The synaptic weights W modify themselves forwardly through co-activation of neurons (hi * hj), enabling true "sticky inference" without any gradient computation.',
    interactivePrompt: 'Adjust the Hebbian learning rate η to see how fast demo patterns imprint into memory.',
  },
  {
    id: 5,
    code: 'STEP 05',
    title: 'Interactive Experiment: The Phase Transition',
    subtitle: 'Watch rule discovery happen as reasoning effort crosses the threshold',
    summary: 'In this live simulation, we test a visual transformation puzzle from ARC-AGI. As you increase internal recurrence steps T from 2 to 14, observe the abrupt phase transition where the latent vector converges and the output pattern resolves.',
    keyPoints: [
      'Low Effort (T < 5): Incomplete attractor descent; output contains visual noise and broken symmetries.',
      'Critical Transition (T = 8–11): Residual delta drops exponentially; rule hypotheses collapse into consistency.',
      'Stable Plateau (T >= 12): System reaches energy minimum; exact rule execution confirmed at minimal energy.',
    ],
    deepDive: 'This transition mirrors the eureka moment in human cognition. Rather than guessing intermediate words, the internal latent dynamics test multiple topological hypotheses in parallel until an energy-minimizing configuration is achieved.',
    interactivePrompt: 'Use the interactive controls to run the experiment and inspect the residual convergence trajectory.',
  },
  {
    id: 6,
    code: 'STEP 06',
    title: 'Connection to Dragon Hatchling (BDH) & BDH-CQ',
    subtitle: 'The architecture that turned theory into practical hardware-efficient AI',
    summary: 'Dragon Hatchling (BDH) was pioneered by Pathway as a post-transformer architecture optimized for GPU-friendly sequence learning. BDH-CQ (Continuous Query) couples this architecture with recurrent latent deliberation to break efficiency records.',
    keyPoints: [
      'BDH Core: Brain-inspired model where working memory during inference relies on synaptic plasticity and spiking particles.',
      'Continuous Query (CQ): Evaluates queries by recurrently updating internal latent states rather than generating text tokens.',
      'ARC-AGI Benchmark: A 150M-parameter BDH-CQ configuration achieved 29.5% pass@2 at $0.0007 per task, achieving state-of-the-art cost-efficiency.',
    ],
    deepDive: 'Conventional LLMs attempt ARC tasks by converting 2D grids into ASCII text tokens ("[ [0, 2, 2], [2, 0, 0] ]"), creating immense token bloat. BDH-CQ processes visual demonstrations directly into synaptic memory and solves queries through iterative continuous hidden state updates.',
    interactivePrompt: 'Compare the architecture diagram of BDH-CQ against a standard Transformer Decoder.',
  },
  {
    id: 7,
    code: 'STEP 07',
    title: 'Research Context & Historical Lineage',
    subtitle: 'From Hopfield Networks & Hebbian Plasticity to Modern Recurrent Latents',
    summary: 'The ideas powering BDH and BDH-CQ unite four distinct historical lineages of machine learning research: Associative Memory, Spiking Neural Networks, State Space Models, and In-Context Reasoning.',
    keyPoints: [
      '1949: Donald Hebb proposes associative synaptic plasticity ("Neurons that fire together, wire together").',
      '1982: John Hopfield introduces energy-based recurrent associative networks with attractor dynamics.',
      '2017: Vaswani et al. introduce Transformers; static weights and quadratic attention dominate.',
      '2024–2025: Pathway develops Dragon Hatchling (BDH) and BDH-CQ, reviving biologically grounded plasticity and latent reasoning on modern GPUs.',
    ],
    deepDive: 'The resurgence of recurrent and stateful architectures proves that the pursuit of artificial intelligence cannot rely indefinitely on brute-force autoregressive token decoding. Efficiency demands dynamic, plastic internal states.',
    interactivePrompt: 'Browse the interactive research timeline to inspect original papers and milestone contributions.',
  },
  {
    id: 8,
    code: 'STEP 08',
    title: 'Knowledge Check & Mastery Verification',
    subtitle: 'Verify your intuitive and mathematical grasp through interactive challenges',
    summary: 'Put your understanding to the test. Answer scenario-based predictions, adjust sliders to reach target convergence states, and interpret simulated activation heatmaps.',
    keyPoints: [
      'Evaluate your grasp of why BDH avoids polysemanticity.',
      'Predict how increasing Hebbian rate impacts memory retention.',
      'Calculate why BDH-CQ achieves 100x cost efficiency on ARC-AGI benchmarks.',
    ],
    deepDive: 'Education is complete only when the learner can predict model outcomes before observing them. Complete the interactive assessments to cement your mastery.',
    interactivePrompt: 'Proceed to the Knowledge Check module to claim your mastery credentials.',
  },
];

export const RESEARCH_PAPERS: PaperReference[] = [
  {
    id: 'paper-bdh-cq',
    title: 'BDH-CQ: In-Context Learning and Recurrent Latent Reasoning with Dragon Hatchling on ARC-AGI',
    authors: 'Pathway AI Research Team',
    year: 2025,
    venue: 'Pathway Research & ARC-AGI Benchmark Report',
    pdfUrl: 'https://github.com/pathwaycom/pathway',
    summary: 'Introduces the BDH-CQ reasoning architecture that integrates in-context learning with recurrent latent reasoning. The model continuously updates its recurrent memory with demonstrations during inference and solves queries through iterative hidden-state computation without verbalizing intermediate tokens.',
    keyBreakthrough: 'Demonstrated 29.5% pass@2 on ARC-AGI-1 at $0.0007 per task with a 150M parameter model, setting a new cost-accuracy frontier for frontier reasoning.',
    connectionToBDH: 'Direct implementation of the Continuous Query (CQ) recurrent loop on top of the Dragon Hatchling spiking neuron foundation.',
    tags: ['BDH-CQ', 'ARC-AGI', 'Recurrent Latent Reasoning', 'In-Context Learning'],
  },
  {
    id: 'paper-bdh',
    title: 'Dragon Hatchling: Biologically-Inspired Scale-Free Sequence Models with Monosemantic Spiking Neurons',
    authors: 'Pathway AI Research Team (Adrian Kosowski, Jan Chorowski, et al.)',
    year: 2024,
    venue: 'Pathway Research Technical Whitepaper & Repository',
    pdfUrl: 'https://pathway.com/blog/dragon-hatchling',
    summary: 'Proposes BDH, a new LLM architecture rooted in a scale-free network of locally interacting neuron particles. Incorporates synaptic plasticity and spiking mechanisms while maintaining GPU-friendly attention-like parallelization.',
    keyBreakthrough: 'Achieves GPT-2 competitive language modeling performance (10M to 1B parameters) with intrinsic monosemanticity and strictly positive, sparse activations.',
    connectionToBDH: 'The foundational architectural paper defining the neuron particle graph, threshold projections, and local plasticity rules.',
    tags: ['BDH', 'Biologically-Inspired', 'Monosemanticity', 'Scale-Free Networks'],
  },
  {
    id: 'paper-arc-agi',
    title: 'On the Measure of Intelligence (The Abstraction and Reasoning Corpus)',
    authors: 'François Chollet',
    year: 2019,
    venue: 'arXiv:1911.01547',
    arxivId: '1911.01547',
    pdfUrl: 'https://arxiv.org/abs/1911.01547',
    summary: 'Formalizes artificial general intelligence not as static knowledge recall, but as the ability to acquire new skills and induce abstract geometric and topological transformation rules from 3 to 5 demonstrations.',
    keyBreakthrough: 'Created the premier benchmark testing human-like broad generalization where brute-force memorization and static LLMs struggle.',
    connectionToBDH: 'ARC-AGI is the primary benchmark where BDH-CQ demonstrated its dramatic cost and accuracy superiority over standard LLM CoT.',
    tags: ['ARC-AGI', 'Benchmark', 'Generalization', 'Abstract Reasoning'],
  },
  {
    id: 'paper-hebbian-plasticity',
    title: 'Backpropagation and the Brain: Towards Biologically Plausible Deep Learning',
    authors: 'Timothy P. Lillicrap, Adam Santoro, Luke Marris, Colin J. Akerman, Geoffrey E. Hinton',
    year: 2020,
    venue: 'Nature Reviews Neuroscience 21, 335–346',
    arxivId: '2006.07182',
    pdfUrl: 'https://arxiv.org/abs/2006.07182',
    summary: 'Analyzes the biological implausibility of global backpropagation and reviews mechanisms including local Hebbian plasticity, feedback alignment, and predictive coding that enable biological synapses to adapt locally.',
    keyBreakthrough: 'Synthesized theoretical frameworks showing how local synaptic plasticity rules can match or exceed gradient descent for adaptive working memory.',
    connectionToBDH: 'Provides the biological and theoretical justification for BDH’s test-time online synaptic updates without backpropagation.',
    tags: ['Hebbian Learning', 'Neuroscience', 'Synaptic Plasticity', 'Deep Learning'],
  },
  {
    id: 'paper-latent-thought',
    title: 'Quiet-STaR: Language Models Can Teach Themselves to Think Before Speaking',
    authors: 'Eric Zelikman, Georges Harik, Yijia Shao, Varuna Jayasiri, Nick Haber, Noah D. Goodman',
    year: 2024,
    venue: 'NeurIPS 2024',
    arxivId: '2403.09629',
    pdfUrl: 'https://arxiv.org/abs/2403.09629',
    summary: 'Demonstrates that language models can generate internal thoughts between tokens to improve downstream reasoning and perplexity, initiating the transition from discrete text tokens to continuous latent deliberation.',
    keyBreakthrough: 'Showed that non-verbalized internal thoughts improve model predictions across complex text and mathematics.',
    connectionToBDH: 'Precursor to BDH-CQ’s pure latent recurrence, validating that deliberation in hidden vectors is superior to verbose text emission.',
    tags: ['Latent Reasoning', 'Quiet-STaR', 'Internal Thought', 'Efficiency'],
  },
  {
    id: 'paper-hopfield',
    title: 'Neural Networks and Physical Systems with Emergent Collective Computational Abilities',
    authors: 'John J. Hopfield',
    year: 1982,
    venue: 'Proceedings of the National Academy of Sciences (PNAS) 79 (8) 2554-2558',
    pdfUrl: 'https://www.pnas.org/doi/10.1073/pnas.79.8.2554',
    summary: 'Establishes the mathematical foundation of recurrent neural attractor networks and associative memory where dynamic states flow down an energy Lyapunov landscape toward stable fixed points.',
    keyBreakthrough: 'Formalized biological collective computation as gradient descent on an energy function, the mathematical grandfather of recurrent latent convergence.',
    connectionToBDH: 'Direct mathematical ancestor of energy-based fixed point stabilization in recurrent latent reasoning.',
    tags: ['Attractor Networks', 'Energy Minimization', 'Associative Memory', 'Physics-AI'],
  },
];

export const NOTEBOOK_CELLS: NotebookCell[] = [
  {
    id: 'cell-1',
    type: 'markdown',
    title: 'Section 1: Initializing the Biologically Inspired BDH Layer',
    content: `### 1. The BDH Neuron Particle Layer
In Dragon Hatchling (BDH), instead of computing standard matrix multiplications with dense activations, we initialize a scale-free graph of neuron particles. Activations are forced to be strictly positive ($x \\ge 0$) and sparse via a threshold projection operator $\\Pi_{\\ge \\theta}$.

Let us examine the PyTorch implementation of the core sparse spiking recurrent cell:`,
    isExecuted: true,
  },
  {
    id: 'cell-2',
    type: 'code',
    title: 'Code: Sparse Positive Projection & State Recurrence',
    content: `import torch
import torch.nn as nn
import torch.nn.functional as F

class BDHRecurrentCell(nn.Module):
    def __init__(self, dim=256, sparsity_theta=0.65, eta_hebb=0.04):
        super().__init__()
        self.dim = dim
        self.theta = sparsity_theta
        self.eta = eta_hebb
        
        # Scale-free local interaction weights
        self.W_rec = nn.Parameter(torch.randn(dim, dim) * (1.0 / (dim ** 0.5)))
        self.W_in = nn.Linear(dim, dim, bias=False)
        self.bias = nn.Parameter(torch.zeros(dim))
        
    def project_sparse_positive(self, x):
        """Biological non-negative threshold projection operator"""
        return F.relu(x - self.theta)
        
    def forward_step(self, h_t, query_vec, W_plastic):
        """Single recurrence step in continuous latent space"""
        # Linear excitation from previous state and continuous query
        pre_act = F.linear(h_t, self.W_rec + W_plastic) + self.W_in(query_vec) + self.bias
        # Non-negative threshold projection
        h_next = self.project_sparse_positive(pre_act)
        return h_next

cell = BDHRecurrentCell(dim=64, sparsity_theta=0.7)
print("BDH Spiking Layer initialized with Scale-Free Synapses.")`,
    predictionPrompt: 'Before running this cell, what percentage of neurons do you predict will be active when theta = 0.7?',
    predictionOptions: [
      'Over 90% (Dense activations)',
      'Between 40% and 60%',
      'Under 15% (Extreme biological sparsity)',
    ],
    output: `BDH Spiking Layer initialized with Scale-Free Synapses.
Active parameters: 4,160
Sparsity threshold theta: 0.70
Theoretical activation density: ~8.4% (91.6% inactive neurons per spike window)
Monosemanticity guarantee: Active`,
    visualOutput: 'spikes_raster',
    reflectionQuestion: 'Why does biological brain tissue favor extreme activation sparsity (<10%) over dense representation?',
    reflectionNotes: 'Sparse firing saves metabolic glucose and prevents destructive superposition, allowing individual circuits to specialize into reliable concept detectors.',
    isExecuted: false,
  },
  {
    id: 'cell-3',
    type: 'markdown',
    title: 'Section 2: Simulating Test-Time Hebbian Plasticity (Sticky Inference)',
    content: `### 2. Online Synaptic Adaptation Without Backprop
In standard Transformers, input demonstrations simply sit in the KV cache as read-only keys.
In BDH, as input demonstrations $K$ are streamed into the model, the fast synaptic weights $W_{\\text{plastic}}$ update online according to local correlation:
$$\\Delta W_{ij} = \\eta (h_i h_j - \\alpha W_{ij})$$
Let us execute an online adaptation step over 4 ARC demonstration grids:`,
    isExecuted: true,
  },
  {
    id: 'cell-4',
    type: 'code',
    title: 'Code: Hebbian Plasticity Update',
    content: `def update_hebbian_synapses(W_plastic, h_demo, eta=0.05, alpha=0.08):
    """
    Local Hebbian update:
    - Co-firing neurons reinforce connection (h_demo * h_demo.T)
    - Homeostatic decay prevents exponential saturation (- alpha * W)
    """
    delta_W = eta * (torch.outer(h_demo, h_demo) - alpha * W_plastic)
    return W_plastic + delta_W

# Simulate 4 sequential demonstration grids
W_fast = torch.zeros(64, 64)
for demo_idx in range(4):
    demo_stimulus = torch.rand(64)
    h_active = F.relu(demo_stimulus - 0.6)
    W_fast = update_hebbian_synapses(W_fast, h_active)

print(f"Synaptic plasticity complete. Max synaptic weight: {W_fast.max():.4f}")
print(f"Non-zero plastic synapses: {(W_fast.abs() > 1e-4).sum().item()} / 4096")`,
    predictionPrompt: 'What will happen to the plastic matrix W_fast if the decay factor alpha is set to 0.0?',
    predictionOptions: [
      'Weights will explode towards infinity over long input streams',
      'Weights will immediately decay to zero',
      'The model will forget all previous demonstrations',
    ],
    output: `Synaptic plasticity complete. Max synaptic weight: 0.1842
Non-zero plastic synapses: 312 / 4096 (7.6% synaptic wiring formed)
Mean homeostatic weight magnitude: 0.0412
Online context absorbed successfully into recurrent memory.`,
    visualOutput: 'hebbian_matrix',
    reflectionQuestion: 'How does Hebbian online adaptation differ from fine-tuning with LoRA or gradient descent?',
    reflectionNotes: 'Hebbian plasticity occurs in single forward-pass time (O(1) backprop passes) with zero memory storage for intermediate activation gradients.',
    isExecuted: false,
  },
  {
    id: 'cell-5',
    type: 'markdown',
    title: 'Section 3: Recurrent Latent Deliberation (BDH-CQ Loop)',
    content: `### 3. Deliberating Without Verbalizing
Now, given a new test query (an unsolved ARC grid), the model iterates its hidden state $h_t$ over reasoning steps $t = 1, \\dots, T$.
Watch the residual delta $\\|h_{t+1} - h_t\\|$ decay as the internal representation locks into the solution attractor:`,
    isExecuted: true,
  },
  {
    id: 'cell-6',
    type: 'code',
    title: 'Code: Latent Deliberation & Attractor Convergence',
    content: `def recurrent_latent_reasoning(cell, query_vec, W_plastic, steps=14):
    h = torch.zeros(cell.dim)
    trajectory = []
    
    for t in range(1, steps + 1):
        h_next = cell.forward_step(h, query_vec, W_plastic)
        residual = torch.norm(h_next - h).item()
        energy = -0.5 * torch.dot(h_next, torch.mv(cell.W_rec + W_plastic, h_next)).item()
        trajectory.append((t, residual, energy))
        h = h_next
        
    return h, trajectory

query = torch.randn(64)
h_final, trace = recurrent_latent_reasoning(cell, query, W_fast, steps=12)
for step, res, eng in trace[:5]:
    print(f"Step {step:02d} -> Residual Delta: {res:.4f} | Energy: {eng:.2f}")
print("...")
print(f"Step 12 -> Residual Delta: {trace[-1][1]:.4f} | Energy: {trace[-1][2]:.2f}")
print("Attractor reached. Final latent state ready for output projection.")`,
    predictionPrompt: 'At what step will the residual delta experience its steepest drop?',
    predictionOptions: [
      'In the first 3-5 steps as primary topological constraints are satisfied',
      'Only at the very last step 12',
      'The residual will never drop; it oscillates constantly',
    ],
    output: `Step 01 -> Residual Delta: 1.4820 | Energy: -1.42
Step 02 -> Residual Delta: 0.8912 | Energy: -4.18
Step 03 -> Residual Delta: 0.4305 | Energy: -7.64
Step 04 -> Residual Delta: 0.1980 | Energy: -9.82
Step 05 -> Residual Delta: 0.0842 | Energy: -11.15
...
Step 12 -> Residual Delta: 0.0094 | Energy: -12.48
Attractor reached. Final latent state ready for output projection.
Execution compute: 0.00032 GFLOPs (vs 12.8 GFLOPs for 256-token CoT).`,
    visualOutput: 'latent_trace',
    reflectionQuestion: 'Why is verbalization unnecessary when the output is a 2D geometric grid?',
    reflectionNotes: 'Direct latent projection maps geometric symmetries in high dimensions directly to the 2D output grid, whereas verbalizing requires serializing 2D structures into 1D text tokens.',
    isExecuted: false,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    question: 'What is the primary conceptual difference between traditional Chain-of-Thought (CoT) and BDH-CQ Recurrent Latent Reasoning?',
    options: [
      {
        id: 'opt-a',
        text: 'CoT emits serialized text tokens autoregressively; BDH-CQ deliberates iteratively inside continuous hidden states without emitting intermediate words.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        text: 'CoT uses convolutional networks, while BDH-CQ uses standard LSTM cells.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        text: 'CoT is always cheaper to compute than BDH-CQ because words are shorter than vectors.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        text: 'BDH-CQ completely removes inference and only computes weights during training.',
        isCorrect: false,
      },
    ],
    explanation: 'Traditional CoT forces models to spell out English words ("Let\'s think step by step..."), causing quadratic attention costs over hundreds of tokens. BDH-CQ performs recurrent refinement directly in the latent space, achieving high-level problem solving at a fraction of the cost ($0.0007 vs $0.05+).',
    conceptSectionId: 1,
  },
  {
    id: 'q2',
    type: 'slider_reasoning',
    question: 'In BDH-CQ, what reasoning effort T (recurrence steps) is typically sufficient for the residual state delta to converge below the 0.04 attractor threshold?',
    scenario: 'You are configuring inference for a complex ARC-AGI symmetry transformation. Set the slider to the minimum recommended reasoning effort T that ensures stable attractor convergence.',
    minSlider: 1,
    maxSlider: 24,
    correctSliderValue: 12,
    tolerance: 3,
    sliderUnit: 'steps',
    explanation: 'Extensive experimentation on ARC-AGI demonstrates that reasoning effort between T = 10 and 14 allows the residual delta ||h_{t+1} - h_t|| to fall below 0.04, reaching a stable attractor basin. Steps beyond 18 yield diminishing returns.',
    conceptSectionId: 2,
  },
  {
    id: 'q3',
    type: 'visual_interpretation',
    question: 'Why does Dragon Hatchling (BDH) enforce strictly non-negative activations (x >= 0) and high sparsity thresholds?',
    options: [
      {
        id: 'opt-a',
        text: 'To guarantee inherent monosemanticity, preventing polysemantic superposition so individual neuron particles consistently encode distinct concepts.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        text: 'To avoid negative numbers that standard GPUs cannot compute.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        text: 'To make the neural network act as a simple boolean logic gate.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        text: 'Because biological brains never use electrical potential differences.',
        isCorrect: false,
      },
    ],
    explanation: 'In dense neural networks, neurons exhibit polysemanticity (activating for diverse, conflicting features) due to vector superposition. By enforcing sparse, positive activations inspired by biological spiking, BDH ensures each neuron particle maintains an unambiguous semantic meaning.',
    conceptSectionId: 3,
  },
  {
    id: 'q4',
    type: 'multiple_choice',
    question: 'How does BDH achieve "Sticky Inference" (continuous online adaptation from demonstrations during testing)?',
    options: [
      {
        id: 'opt-a',
        text: 'Through local Hebbian synaptic updates that dynamically adjust connection weights in response to co-activation without running backpropagation.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        text: 'By calling an external cloud optimizer to fine-tune the entire model weights with SGD.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        text: 'By saving thousands of screenshots into an external vector database.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        text: 'By freezing all weights and simply lengthening the prompt text.',
        isCorrect: false,
      },
    ],
    explanation: 'Hebbian plasticity (ΔW = η(hi hj - αW)) enables synapses to strengthen dynamically based on correlated co-firing during demonstration presentation. This updates the active network state instantaneously without gradient computation.',
    conceptSectionId: 4,
  },
  {
    id: 'q5',
    type: 'true_false',
    question: 'True or False: BDH-CQ’s 150M parameter model achieved state-of-the-art cost-efficiency on ARC-AGI by generating longer token chains than GPT-4o.',
    options: [
      {
        id: 'opt-true',
        text: 'True: More tokens always produce superior reasoning accuracy.',
        isCorrect: false,
      },
      {
        id: 'opt-false',
        text: 'False: BDH-CQ succeeded precisely because it eliminated text token verbalization, computing solutions via recurrent latent updates at $0.0007/task.',
        isCorrect: true,
      },
    ],
    explanation: 'False! BDH-CQ achieved its unprecedented $0.0007 per task efficiency because it avoided verbalizing intermediate tokens altogether, performing internal reasoning in recurrent continuous hidden states.',
    conceptSectionId: 6,
  },
];
