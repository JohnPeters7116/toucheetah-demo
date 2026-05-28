import { spawn } from 'node:child_process';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';

function run(cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env, ...opts.env },
    shell: false
  });
  return child;
}

async function isUp() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitUp(ms) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await isUp()) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

let startedServer = false;
let server;

// If a server is already running, reuse it. Otherwise start one.
if (!(await isUp())) {
  startedServer = true;
  // Start the API directly (no watch) so stopping it doesn't fail `npm`.
  server = run('npx', ['tsx', 'src/index.ts'], { env: { FORCE_COLOR: '1' } });

  const ok = await waitUp(20_000);
  if (!ok) {
    server?.kill('SIGTERM');
    process.exitCode = 1;
    throw new Error(`API did not become ready at ${API_BASE_URL}`);
  }
}

const vitest = run('npx', ['vitest', 'run', '--reporter=default'], {
  env: { API_BASE_URL }
});

await new Promise((resolve) => vitest.on('exit', resolve));

if (startedServer) {
  server?.kill('SIGTERM');
  await new Promise((resolve) => server.on('exit', resolve));
}
