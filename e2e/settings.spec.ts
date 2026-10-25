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
    const themeBtn = page.getByRole('region', { name: 'Тема' }).getByRole('button', { name: /тёмная тема|светлая тема/i });
    await expect(themeBtn).toBeVisible();
    await expect(themeBtn).toHaveAccessibleName('Тёмная тема');
    await themeBtn.click();
    await expect(themeBtn).toHaveAccessibleName('Светлая тема');
    await page.reload();
    await expect(themeBtn).toHaveAccessibleName('Светлая тема');
  });

  test('период по умолчанию: Неделя и Месяц переключаются', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: /месяц/i }).click();
    await expect(page.getByRole('button', { name: /месяц/i })).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.getByRole('button', { name: /месяц/i })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /неделя/i }).click();
    await expect(page.getByRole('button', { name: /неделя/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
