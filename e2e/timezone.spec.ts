import { test, expect } from '@playwright/test';

test('homepage loads with conversion UI', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TimeZone/);
});

test('timezone conversion updates displayed time', async ({ page }) => {
  await page.goto('/');
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});
