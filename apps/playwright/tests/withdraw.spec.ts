import { test, expect, Page } from '@playwright/test';

const fillPinInput = async (page: Page, pin: string) => {
  const locators = page.getByLabel(/Please enter OTP character \d+/);
  const count = await locators.count();

  for (let i = 0; i < count; i++) {
    await locators.nth(i).fill(pin[i]);
  }
};

test('login and withdraw', async ({ page }) => {
  await page.goto('/');

  // Fill in pin
  await fillPinInput(page, '1111');
  // Click continue
  await page.getByRole('button', { name: 'Continue' }).click();

  // Click on withdraw menu
  await page.getByRole('button', { name: 'Withdraw' }).click();

  // Fill in amount to withdraw
  await page.getByLabel('Amount:').fill('35');
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Fill in pin
  await fillPinInput(page, '1111');
  // Click confirm
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Summary modal should be visible
  await expect(page.getByText('Summary')).toBeVisible();
  await expect(page.getByText('£5 x')).toHaveText('£5 x 1');
  await expect(page.getByText('£10 x')).toHaveText('£10 x 1');
  await expect(page.getByText('£20 x')).toHaveText('£20 x 1');

  // Close summary modal
  await page.getByRole('button', { name: 'Return to menu' }).click();
  // Modal should be hidden
  await expect(page.getByText('Withdrawal (£300)')).toBeHidden();
});
