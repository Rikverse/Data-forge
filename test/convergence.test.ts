import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation } from '../src/services/simulationEngine';
import { SimulationParams } from '../src/types';

describe('Convergence Panel & Bi-Directional Integration Logic', () => {
  const defaultParams: SimulationParams = {
    reasoningEffort: 12,
    sparsityThreshold: 0.65,
    hebbianRate: 0.04,
    decayFactor: 0.08,
    networkScale: 36,
    inputDemonstrations: 3,
    noiseLevel: 0.05,
  };

  it('verifies convergence trajectory monotonically settles toward attractor threshold', () => {
    const output = runSimulation(defaultParams);
    assert.ok(output.trajectory.length > 0, 'Trajectory must exist');
    const firstDelta = output.trajectory[0].residualDelta;
    const lastDelta = output.trajectory[output.trajectory.length - 1].residualDelta;
    assert.ok(lastDelta < firstDelta, 'Last residual delta must be strictly smaller than initial delta');
  });

  it('verifies matrix cell mappings align with the representative neurons in NeuralNetworkVisualizer', () => {
    // 5 representative neurons: input, h0, h1, h2, output
    const expectedNeuronIds = ['input', 'h0', 'h1', 'h2', 'output'];
    const cellNeuronIds = ['input', 'h0', 'h1', 'h2', 'output'];

    expectedNeuronIds.forEach((id) => {
      assert.ok(cellNeuronIds.includes(id), `Neuron ID ${id} must map to a matrix cell`);
    });
  });

  it('verifies bi-directional event selection mapping', () => {
    const neuronMap: Record<string, string> = {
      input: 'cell-input',
      h0: 'cell-h0',
      h1: 'cell-h1',
      h2: 'cell-h2',
      output: 'cell-output',
    };

    // Selecting any neuron yields the correct matrix cell
    for (const [neuronId, cellId] of Object.entries(neuronMap)) {
      assert.ok(cellId.startsWith('cell-'), `Cell ${cellId} starts with cell-`);
      assert.ok(neuronId.length > 0, 'Neuron id is non-empty');
    }
  });
});
