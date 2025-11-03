/*
  Simple smoke test:
  - Spawns the server
  - Calls /api/claude with a short prompt
  - Prints result or skips if no ANTHROPIC_API_KEY
*/

const { spawn } = require('child_process');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      // even a 404 means the server is up
      if (res.status) return true;
    } catch (_) {}
    await wait(300);
  }
  return false;
}

(async () => {
  if (!API_KEY) {
    console.log('Skipping smoke test: ANTHROPIC_API_KEY not set');
    process.exit(0);
  }

  const server = spawn(process.execPath, ['claude-server.js'], {
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stdout.on('data', data => process.stdout.write(data));
  server.stderr.on('data', data => process.stderr.write(data));

  const up = await waitForServer();
  if (!up) {
    console.error('Server did not start in time');
    server.kill('SIGTERM');
    process.exit(1);
  }

  try {
    const res = await fetch(`http://localhost:${PORT}/api/claude`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: 'Say hello in 3 words.', max_tokens: 30 })
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('Request failed:', json);
      server.kill('SIGTERM');
      process.exit(1);
    }

    // Anthropic messages response has content array with text
    const text = json?.content?.[0]?.text || JSON.stringify(json).slice(0, 200);
    console.log('Smoke test OK. Sample output:', text);
  } catch (e) {
    console.error('Smoke test error:', e);
    server.kill('SIGTERM');
    process.exit(1);
  }

  server.kill('SIGTERM');
  process.exit(0);
})();
