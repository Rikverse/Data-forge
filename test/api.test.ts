import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../server';

describe('Backend API Endpoints Integration Test', () => {
  let server: http.Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          baseUrl = `http://127.0.0.1:${addr.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('GET /api/v1/health returns status 200 and all services operational', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.services.experimentEngine, 'operational');
    assert.equal(body.services.bdhService, 'operational');
    assert.equal(body.services.paperService, 'operational');
    assert.equal(body.services.quizService, 'operational');
    assert.ok(typeof body.uptime === 'number');
  });

  it('POST /api/v1/experiment/simulate with valid payload returns simulation output', async () => {
    const payload = {
      reasoningEffort: 14,
      sparsityThreshold: 0.7,
      hebbianRate: 0.05,
      decayFactor: 0.08,
      networkScale: 36,
      inputDemonstrations: 3,
      noiseLevel: 0.05,
    };
    const res = await fetch(`${baseUrl}/api/v1/experiment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.ok(body.data.energy < 0);
    assert.equal(body.data.trajectory.length, 14);
  });

  it('POST /api/v1/experiment/simulate rejects boundary violation (reasoningEffort > 30)', async () => {
    const payload = { reasoningEffort: 99 };
    const res = await fetch(`${baseUrl}/api/v1/experiment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, 'error');
    assert.equal(body.parameter, 'reasoningEffort');
  });

  it('POST /api/v1/experiment/simulate rejects negative sparsityThreshold', async () => {
    const payload = { sparsityThreshold: -0.5 };
    const res = await fetch(`${baseUrl}/api/v1/experiment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, 'error');
    assert.equal(body.parameter, 'sparsityThreshold');
  });

  it('POST /api/v1/experiment/simulate rejects non-number input', async () => {
    const payload = { reasoningEffort: 'twelve' };
    const res = await fetch(`${baseUrl}/api/v1/experiment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, 'error');
  });

  it('GET /api/v1/presets returns preset list', async () => {
    const res = await fetch(`${baseUrl}/api/v1/presets`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.ok(Array.isArray(body.presets));
    assert.ok(body.presets.length >= 4);
  });

  it('GET /api/v1/bdh/architecture returns blueprint with ARC benchmark data', async () => {
    const res = await fetch(`${baseUrl}/api/v1/bdh/architecture`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.equal(body.architecture.arcBenchmark.passRate, '29.5% pass@2');
    assert.equal(body.architecture.arcBenchmark.costPerTaskUSD, 0.0007);
  });

  it('GET /api/v1/papers returns research papers and supports tag search', async () => {
    const allRes = await fetch(`${baseUrl}/api/v1/papers`);
    assert.equal(allRes.status, 200);
    const allBody = await allRes.json();
    assert.ok(allBody.papers.length >= 5);

    const filterRes = await fetch(`${baseUrl}/api/v1/papers?tag=ARC-AGI`);
    assert.equal(filterRes.status, 200);
    const filterBody = await filterRes.json();
    assert.ok(filterBody.papers.length >= 1);
    assert.ok(filterBody.papers.some((p: any) => p.title.includes('Intelligence') || p.title.includes('ARC-AGI')));
  });

  it('GET /api/v1/quiz returns sanitized questions', async () => {
    const res = await fetch(`${baseUrl}/api/v1/quiz`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.ok(body.questions.length >= 5);
  });

  it('POST /api/v1/quiz/evaluate scores submitted answers accurately', async () => {
    const answers = {
      q1: 'opt-a',
      q2: 12,
      q3: 'opt-a',
      q4: 'opt-a',
      q5: 'opt-false',
    };
    const res = await fetch(`${baseUrl}/api/v1/quiz/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.equal(body.score, 5);
    assert.equal(body.passed, true);
  });

  it('POST /api/v1/predict/evaluate compares learner hypothesis against simulation', async () => {
    const payload = {
      prediction: { target: 'convergence', expected: 'settled' },
      params: {
        reasoningEffort: 16,
        sparsityThreshold: 0.65,
        hebbianRate: 0.04,
        decayFactor: 0.08,
        networkScale: 36,
        inputDemonstrations: 3,
        noiseLevel: 0.05,
      },
    };
    const res = await fetch(`${baseUrl}/api/v1/predict/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.equal(typeof body.predictionMatched, 'boolean');
    assert.ok(body.analysis.length > 10);
  });
});
