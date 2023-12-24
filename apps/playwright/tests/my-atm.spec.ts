import { test, expect } from '@playwright/test';
test('myATM is up and running', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('myATM');
});
