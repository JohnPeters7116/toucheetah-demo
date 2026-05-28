import { beforeAll, describe, expect, test } from 'vitest';

const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:4000';

function uniqEmail() {
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `test_${id}@example.com`;
}

async function mustFetch(path: string, init?: RequestInit) {
  try {
    return await fetch(`${baseUrl}${path}`, init);
  } catch (err) {
    throw new Error(
      `Failed to reach API at ${baseUrl}. Start it with: npm run dev:api\nOriginal error: ${String(err)}`
    );
  }
}

async function waitForApi() {
  const deadline = Date.now() + 15_000;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/health`);
      if (res.ok) return;
      lastErr = new Error(`Health returned ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(
    `API not reachable at ${baseUrl} after 15s. Start it with: npm run dev:api\nLast error: ${String(lastErr)}`
  );
}

describe.sequential('API (localhost)', () => {
  beforeAll(async () => {
    await waitForApi();
  });

  test('GET /health', async () => {
    const res = await mustFetch('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  test('GET /api/products', async () => {
    const res = await mustFetch('/api/products');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThanOrEqual(1);
  });

  test('register -> login -> subscription status', async () => {
    const email = uniqEmail();
    const password = 'password123';

    const reg = await mustFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    expect(reg.status).toBe(201);
    const regBody = await reg.json();
    expect(typeof regBody.token).toBe('string');

    const login = await mustFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    expect(login.status).toBe(200);
    const loginBody = await login.json();
    expect(typeof loginBody.token).toBe('string');

    const sub = await mustFetch('/api/user/subscription', {
      headers: { Authorization: `Bearer ${loginBody.token}` }
    });
    expect(sub.status).toBe(200);
    const subBody = await sub.json();
    expect(subBody.access).toBeTruthy();
    expect(typeof subBody.access.hasLifetimeAccess).toBe('boolean');
  });
});
