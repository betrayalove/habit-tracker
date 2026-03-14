import { test, expect } from '@playwright/test';

test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('заголовок и ссылки навигации видны', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /трекер привычек/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /главная/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /привычки/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /настройки/i })).toBeVisible();
  });

  test('без привычек показывается пустое состояние', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/нет привычек/i)).toBeVisible();
    await expect(page.getByText(/добавьте первую привычку/i)).toBeVisible();
  });

  test('переключатель периода и кнопки назад/вперёд видны', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /неделя/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /месяц/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /предыдущий период/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /следующий период/i })).toBeVisible();
  });

  test('навигация по ссылкам ведёт на нужные страницы', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /привычки/i }).click();
    await expect(page).toHaveURL(/\/habits/);
    await page.getByRole('link', { name: /статистика/i }).click();
    await expect(page).toHaveURL(/\/stats/);
    await page.getByRole('link', { name: /настройки/i }).click();
    await expect(page).toHaveURL(/\/settings/);
    await page.getByRole('link', { name: /главная/i }).click();
    await expect(page).toHaveURL(/\//);
  });
});
