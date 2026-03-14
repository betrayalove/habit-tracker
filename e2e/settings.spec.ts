import { test, expect } from '@playwright/test';

test.describe('Настройки', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('переключатель темы меняет подпись кнопки', async ({ page }) => {
    await page.goto('/settings');
    const themeBtn = page.getByRole('button', { name: /тёмная тема|светлая тема/i });
    await expect(themeBtn).toBeVisible();
    const textBefore = await themeBtn.textContent();
    await themeBtn.click();
    await expect(themeBtn).not.toHaveText(textBefore || '');
  });

  test('период по умолчанию: Неделя и Месяц переключаются', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: /месяц/i }).click();
    await expect(page.getByRole('button', { name: /месяц/i })).toBeVisible();
    await page.getByRole('button', { name: /неделя/i }).click();
    await expect(page.getByRole('button', { name: /неделя/i })).toBeVisible();
  });
});
