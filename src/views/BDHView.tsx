import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Brain,
  Zap,
  Activity,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { AppRoute, UserProgress, SimulationParams } from '../types';
import { MathView } from '../components/MathView';
import { NeuralNetworkVisualizer } from '../components/NeuralNetworkVisualizer';
import { runSimulation } from '../services/simulationEngine';

interface BDHViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
}

export const BDHView: React.FC<BDHViewProps> = ({ onNavigate, progress }) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('spiking-particles');
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  const bdhParams: SimulationParams = {
    reasoningEffort: 14,
    sparsityThreshold: 0.68,
    hebbianRate: 0.06,
    decayFactor: 0.08,
    networkScale: 32,
    inputDemonstrations: 4,
    noiseLevel: 0.03,
  };
  const bdhOutput = runSimulation(bdhParams);

  const architectureBlocks = [
    {
      id: 'input-stream',
      name: '1. Input Stimulus & Token Encoding',
      role: 'Maps continuous queries or visual token sequences into normalized vector activations.',
      details: 'Inputs are mapped to high-dimensional embedding vectors x_in in R^d without destructive downsampling. Unlike transformers which treat tokens as discrete isolated symbols, BDH encodes stimuli into continuous current injections.',
      formula: 'I_{\\text{ext}} = W_{\\text{in}} x + b_{\\text{in}}',
    },
    {
      id: 'spiking-particles',
      name: '2. Scale-Free Neuron Particle Network',
      role: 'Biologically grounded modular graph where neuron particles interact via local synapses.',
      details: 'Rather than dense all-to-all matrix multiplication, neurons are connected according to a scale-free power law P(k) ~ k^(-gamma). Highly connected hub neurons coordinate specialized peripheral sub-networks, mirroring mammalian cortex macro-columns.',
      formula: 'P(k) \\propto k^{-\\gamma}, \\quad 2 < \\gamma \\le 3',
    },
    {
      id: 'plastic-synapses',
      name: '3. Dynamic Synaptic Plasticity (Sticky Inference)',
      role: 'Fast synaptic weights update online via Hebbian correlation during test-time presentation.',
      details: 'Working memory during inference does not rely solely on an external KV cache. Instead, local synaptic weights W_plastic continuously strengthen when pre- and post-synaptic neurons fire together, enabling real-time domain adaptation without retraining.',
      formula: '\\Delta W_{ij} = \\eta \\left( x_i x_j - \\alpha W_{ij} \\right)',
    },
    {
      id: 'sparse-projection',
      name: '4. Non-Negative Threshold Projection',
      role: 'Enforces strictly positive, sparse activations to guarantee monosemanticity.',
      details: 'Activations pass through the non-negative threshold projection operator Pi(>= theta). Negative activations are strictly suppressed. Because neurons do not cancel each other out through negative superposition, each neuron particle reliably encodes a distinct semantic concept.',
      formula: '\\Pi_{\\ge \\theta}(z) = \\max(0, z - \\theta)',
    },
    {
      id: 'output-head',
      name: '5. Continuous Latent Output Head',
      role: 'Translates stabilized internal attractor states into final predictions or solved grids.',
      details: 'Once internal recurrent activity settles into a stable energy basin, the final state h* is projected directly into target logits or geometric grids without necessitating verbose intermediate text generation.',
      formula: 'y = \\text{Softmax}(W_{\\text{out}} h^* + b_{\\text{out}})',
    },
  ];

  const currentBlock = architectureBlocks.find((b) => b.id === selectedBlock) || architectureBlocks[1];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>Biologically-Inspired Post-Transformer AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          How Does This Connect to Dragon Hatchling (BDH)?
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl font-normal">
          Dragon Hatchling (BDH) was pioneered by Pathway as an alternative to the brute-force scaling of standard Transformers. By modeling scale-free cortical networks, spiking neuron particles, and synaptic plasticity, BDH unifies dynamic memory with GPU-friendly parallel execution.
        </p>
      </div>

      {/* Interactive Architecture Diagram: INPUT -> BDH COMPONENTS -> PROCESSING -> OUTPUT */}
      <div className="p-6 sm:p-9 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-8 glass-specular">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/50 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-950 font-mono">
              Interactive System Topology
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              BDH End-to-End Processing Architecture
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-normal">
            Click any component block to inspect mechanics
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {architectureBlocks.map((block, idx) => {
            const isSelected = selectedBlock === block.id;
            return (
              <div
                key={block.id}
                onClick={() => setSelectedBlock(block.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'glass-strong border-amber-400 shadow-md bg-amber-500/10'
                    : 'glass-light border-white/80 hover:border-amber-300/80 hover:bg-white/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400 font-mono">
                      STAGE 0{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-xs" />
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 font-display">{block.name}</h3>
                </div>

                <div className="pt-2 border-t border-stone-200/50 text-[11px] text-stone-600 leading-snug font-normal">
                  {block.role}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Component Inspection Panel */}
        <div className="p-6 sm:p-7 rounded-3xl glass-medium border border-amber-300/60 space-y-4 animate-fadeIn shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-xs">
                <Brain className="w-4 h-4 text-amber-700" />
              </span>
              <h3 className="text-base font-bold text-stone-900 font-display">{currentBlock.name}</h3>
            </div>
            <span className="text-xs font-bold text-amber-950 font-mono bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-300/60">Inspecting Component</span>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {currentBlock.details}
          </p>

          <div className="p-4 glass-light rounded-2xl border border-white/90 flex items-center justify-between shadow-2xs">
            <div className="text-xs text-stone-500 font-medium font-mono">Governing Equation:</div>
            <div className="text-sm text-stone-900 font-mono font-bold">
              <MathView formula={currentBlock.formula} displayMode={false} />
            </div>
          </div>
        </div>

        {/* Live Interactive Neural Network & Synaptic Visualizer */}
        <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 shadow-xl space-y-5 glass-specular">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/50 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs uppercase font-bold tracking-wider text-amber-950 font-mono">
                  Live Cortical Simulator
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                Scale-Free Cortical Field & Plastic Synapses in Action
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Explore the biological mesh: test signal injection, observe traveling action potentials, or toggle the Hebbian plasticity matrix.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/playground')}
              className="px-3.5 py-1.5 rounded-xl glass-medium hover:bg-white text-stone-800 border border-white/90 font-semibold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 w-fit"
            >
              <span>Tune Parameters in Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>

          <NeuralNetworkVisualizer
            params={bdhParams}
            output={bdhOutput}
            reducedMotion={progress.reducedMotion}
          />
        </div>
      </div>

      {/* Key Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl glass-strong border border-white/90 space-y-3 shadow-xl glass-specular">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center shadow-xs">
            <Brain className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-display">Biological Cortical Connectivity</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            Mammalian brains do not use dense all-to-all connectivity because it is metabolically prohibitive. BDH introduces scale-free graphs with heavy-tailed degree distributions, allowing modular specialization with minimal synaptic wiring.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-strong border border-white/90 space-y-3 shadow-xl glass-specular">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center shadow-xs">
            <Zap className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-display">Inherent Monosemanticity</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            Standard LLMs require giant post-hoc Sparse Autoencoders (SAEs) to disentangle polysemantic features. BDH achieves monosemanticity natively at training time through strictly positive activations and biological threshold projection.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-strong border border-white/90 space-y-3 shadow-xl glass-specular">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300/60 text-amber-800 flex items-center justify-center shadow-xs">
            <Database className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-display">Sticky Inference (Plastic Memory)</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            Unlike frozen models where context vanishes after the session, BDH’s synaptic weights adapt dynamically to user data via Hebbian updates during inference, building lasting domain expertise without costly full retraining.
          </p>
        </div>
      </div>

      {/* Substantive Technical Deep Dive (Expandable) */}
      <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-white/90 space-y-4 shadow-xl glass-specular">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Technical Deep Dive: Heavy-Tailed Graphs & Non-Negative Linear Algebra
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDeepDiveOpen(!deepDiveOpen)}
            className="text-xs font-semibold text-amber-950 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{deepDiveOpen ? 'Collapse' : 'Expand Deep Dive'}</span>
            {deepDiveOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-stone-600 font-normal">
          A rigorous mathematical and algorithmic exploration of why scale-free neuron particles prevent catastrophic forgetting and guarantee monosemantic features.
        </p>

        {deepDiveOpen && (
          <div className="pt-4 border-t border-stone-200/50 space-y-4 text-xs text-stone-700 leading-relaxed animate-fadeIn font-normal">
            <div className="p-5 glass-light rounded-2xl border border-white/80 space-y-2 shadow-2xs">
              <h4 className="font-bold text-amber-950 font-display">1. Heavy-Tailed Power Law Connectivity</h4>
              <p>
                In standard Transformers, the attention weight matrix A = Softmax(Q K^T / sqrt(d)) has dense rank min(d, N). In contrast, the neuron interaction network in BDH is constrained to a sparse adjacency graph G = (V, E) where node degree k follows P(k) ~ k^(-gamma) with gamma in (2, 3]. This scale-free distribution ensures ultra-small world routing: the average shortest path between any two neuron particles scales as O(log log |V|), allowing signals to integrate across the network in just 2-3 local hops.
              </p>
            </div>

            <div className="p-5 glass-light rounded-2xl border border-white/80 space-y-2 shadow-2xs">
              <h4 className="font-bold text-amber-950 font-display">2. Non-Negative Representation & Monosemanticity</h4>
              <p>
                When activations x are unconstrained in R^d, a single neuron must activate both positively and negatively to represent vectors via linear superposition. BDH restricts all neuron particle activations to the non-negative orthant R_+^d. Combined with the threshold projection Pi(&ge; theta)(z) = max(0, z - theta), this enforces the cone condition: for any two concepts c_1 and c_2, their dot product is strictly non-negative (&lang;c_1, c_2&rang; &ge; 0). This geometric constraint prevents destructive cancellation, forcing neuron particles to align with unique semantic axes.
              </p>
            </div>

            <div className="p-5 glass-light rounded-2xl border border-white/80 space-y-2 shadow-2xs">
              <h4 className="font-bold text-amber-950 font-display">3. Test-Time Plasticity without Backpropagation</h4>
              <p>
                To learn from demonstrations in real-time, BDH maintains a dynamic synaptic state W_plastic(t). The update follows local Hebbian plasticity: dW_ij / dt = eta * x_i * x_j - alpha * W_ij. Because this update relies solely on the co-activation of neighboring particles (x_i and x_j), it is computed in O(|E|) operations on GPU tensor cores without saving forward activations or computing backward gradient graphs.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('/bdh-cq')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer border border-amber-400/40"
              >
                <span>Continue to BDH-CQ Reasoning Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
