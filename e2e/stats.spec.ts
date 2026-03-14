import { test, expect } from '@playwright/test';

test.describe('Статистика', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('страница открывается, при отсутствии привычек — пустое состояние', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.getByRole('heading', { name: /статистика/i })).toBeVisible();
    await expect(page.getByText(/нет привычек/i)).toBeVisible();
  });

  test('при наличии привычек — выбор в селекте и отображение данных (дни, streak)', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('Привычка для статистики');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await page.goto('/stats');
    await expect(page.getByRole('heading', { name: /статистика/i })).toBeVisible();
    await expect(page.getByText(/выполнено дней|серия|streak/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /привычка для статистики/i })).toBeVisible();
  });
});
