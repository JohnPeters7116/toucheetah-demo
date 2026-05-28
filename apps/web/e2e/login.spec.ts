import { test, expect, request } from '@playwright/test';

// A unique email per run so re-runs don't hit duplicate-email errors.
const TEST_EMAIL = `test+${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword1!';

test.beforeAll(async () => {
  const api = await request.newContext({ baseURL: 'http://localhost:4000' });
  const res = await api.post('/api/auth/register', {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });
  if (!res.ok()) {
    throw new Error(`Setup: failed to register test user — ${res.status()} ${await res.text()}`);
  }
});

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    await page.waitForSelector('#email');
  });

  test('happy path — valid credentials redirect to map', async ({ page }) => {
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/#\/map/);
  });

  test('invalid password — shows error message', async ({ page }) => {
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page).toHaveURL(/#\/login/);
  });

  test('invalid email format — browser validation prevents submit', async ({ page }) => {
    await page.fill('#email', 'not-an-email');
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // HTML5 validation fires before fetch — still on /login, no API error shown
    await expect(page).toHaveURL(/#\/login/);
    await expect(page.locator('[role="alert"]')).not.toBeVisible();
  });

  test('empty form submit — browser validation prevents submit', async ({ page }) => {
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/#\/login/);
    await expect(page.locator('[role="alert"]')).not.toBeVisible();
  });

  test('logout — clears session and redirects to login', async ({ page }) => {
    // Log in first
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/#\/map/);

    // Call logout endpoint (no UI button yet)
    await page.evaluate(async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    });

    // Hard reload resets React state; in-memory accessToken is gone
    await page.reload();
    await expect(page).toHaveURL(/#\/login/);
  });
});
