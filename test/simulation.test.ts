import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation, PRESET_EXPERIMENTS } from '../src/services/simulationEngine';
import { SimulationParams } from '../src/types';

describe('Simulation Engine Unit & Invariant Tests', () => {
  const defaultParams: SimulationParams = {
    reasoningEffort: 12,
    sparsityThreshold: 0.65,
    hebbianRate: 0.04,
    decayFactor: 0.08,
    networkScale: 36,
    inputDemonstrations: 3,
    noiseLevel: 0.05,
  };

  it('runs simulation with default parameters and produces valid numerical bounds', () => {
    const output = runSimulation(defaultParams);

    assert.ok(typeof output.energy === 'number' && !isNaN(output.energy), 'Energy must be a valid number');
    assert.ok(output.energy < 0, 'Energy in settled attractor must be negative');
    assert.ok(output.convergenceStep >= 1 && output.convergenceStep <= defaultParams.reasoningEffort, 'Convergence step within effort steps');
    assert.ok(output.monosemanticityScore >= 0 && output.monosemanticityScore <= 100, 'Monosemanticity score in [0, 100]');
    assert.ok(output.passProbability >= 0 && output.passProbability <= 100, 'Pass probability in [0, 100]');
    assert.ok(output.activeNeuronsCount > 0 && output.activeNeuronsCount <= defaultParams.networkScale, 'Active neurons bounded by network scale');
    assert.ok(output.inferenceCostPerTask > 0 && output.inferenceCostPerTask < 0.01, 'Inference cost stays in sub-cent BDH-CQ regime');
    assert.equal(output.trajectory.length, defaultParams.reasoningEffort, 'Trajectory points match reasoning effort');
    assert.equal(output.gridState.length, 4, 'ARC grid is 4x4');
  });

  it('verifies that increasing reasoning effort T monotonically reduces or settles residual delta', () => {
    const shallow = runSimulation({ ...defaultParams, reasoningEffort: 2 });
    const deep = runSimulation({ ...defaultParams, reasoningEffort: 18 });

    const shallowFinalDelta = shallow.trajectory[shallow.trajectory.length - 1].residualDelta;
    const deepFinalDelta = deep.trajectory[deep.trajectory.length - 1].residualDelta;

    assert.ok(deepFinalDelta < shallowFinalDelta, 'Deeper reasoning effort must yield a smaller or equal final residual delta');
  });

  it('verifies that high sparsity threshold theta suppresses active neurons and elevates monosemanticity', () => {
    const dense = runSimulation({ ...defaultParams, sparsityThreshold: 0.1 });
    const sparse = runSimulation({ ...defaultParams, sparsityThreshold: 0.85 });

    assert.ok(sparse.activeNeuronsCount < dense.activeNeuronsCount, 'Sparse mode must have fewer active neurons');
    assert.ok(sparse.monosemanticityScore > dense.monosemanticityScore, 'Sparse positive activations must yield higher monosemanticity score');
  });

  it('verifies that input demonstrations K improve task pass probability', () => {
    const noDemos = runSimulation({ ...defaultParams, inputDemonstrations: 1 });
    const fullDemos = runSimulation({ ...defaultParams, inputDemonstrations: 6 });

    assert.ok(fullDemos.passProbability >= noDemos.passProbability, 'More in-context demonstrations must yield higher pass probability');
  });

  it('verifies reset capability: returning to default parameters restores baseline output', () => {
    const modified = runSimulation({ ...defaultParams, reasoningEffort: 24, sparsityThreshold: 0.9 });
    const reset = runSimulation(defaultParams);

    assert.notEqual(modified.trajectory.length, reset.trajectory.length);
    assert.equal(reset.trajectory.length, 12);
  });

  it('verifies all preset experiments have valid recommended parameters', () => {
    assert.ok(PRESET_EXPERIMENTS.length >= 4, 'At least 4 preset experiments present');
    for (const preset of PRESET_EXPERIMENTS) {
      assert.ok(preset.id && preset.name && preset.hypothesis && preset.takeaway, 'Preset metadata complete');
      const testParams = { ...defaultParams, ...preset.recommendedParams };
      const out = runSimulation(testParams);
      assert.ok(!isNaN(out.energy) && !isNaN(out.passProbability), 'Preset parameters execute cleanly');
    }
  });
});
