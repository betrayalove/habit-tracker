import { test, expect } from '@playwright/test';

test.describe('Список привычек', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('добавление привычки: ввод названия и сабмит — привычка в списке', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('Чтение 20 минут');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await expect(page.getByText('Чтение 20 минут')).toBeVisible();
  });

  test('на главной после добавления привычки видна сетка с ячейками по дням', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('Пробежка');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await page.getByRole('link', { name: /главная/i }).click();
    await expect(page.getByText('Пробежка')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Отметки: Пробежка' }).getByRole('button')).toHaveCount(7);
  });

  test('клик по ячейке дня ставит и снимает галочку выполнения', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('Для отметок');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await page.goto('/');
    const firstCell = page.getByRole('button', { name: /выполнено|не выполнено/i }).first();
    await firstCell.click();
    await expect(firstCell).toHaveText('✓');
    await firstCell.click();
    await expect(firstCell).not.toHaveText('✓');
  });

  test('редактирование: Изменить подставляет данные, Сохранить обновляет название', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('Для редактирования');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await page.getByRole('button', { name: /изменить/i }).first().click();
    const input = page.getByPlaceholder(/название привычки/i);
    await expect(input).not.toBeEmpty();
    await input.fill('Обновлённая привычка');
    await page.getByRole('button', { name: /сохранить/i }).click();
    await expect(page.getByText('Обновлённая привычка')).toBeVisible();
  });

  test('удаление: кнопка Удалить убирает привычку из списка', async ({ page }) => {
    await page.goto('/habits');
    await page.getByPlaceholder(/название привычки/i).fill('На удаление');
    await page.getByRole('button', { name: /добавить привычку/i }).click();
    await expect(page.getByText('На удаление')).toBeVisible();
    await page.getByRole('button', { name: /удалить/i }).first().click();
    await expect(page.getByText('На удаление')).not.toBeVisible();
  });
});
