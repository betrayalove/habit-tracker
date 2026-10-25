import { test, expect } from '@playwright/test';

async function addHabit(page: import('@playwright/test').Page, name = 'Календарь') {
  await page.goto('/habits');
  await page.getByPlaceholder('Название привычки').fill(name);
  await page.getByRole('button', { name: 'Добавить привычку' }).click();
  await page.getByRole('link', { name: 'Главная' }).click();
}

test('Sunday uses the current week and today remains selectable', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-25T12:00:00+05:00'));
  await addHabit(page);
  await expect(page.getByText('19.10 – 25.10', { exact: true })).toBeVisible();
  const days = page.getByRole('group', { name: 'Отметки: Календарь' }).getByRole('button');
  await expect(days).toHaveCount(7);
  await expect(page.getByRole('button', { name: '25.10 не выполнено', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: '25.10 не выполнено', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: '25.10 выполнено', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('month and week share local marks, including at midnight; March includes first Sunday', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-03-16T00:15:00+05:00'));
  await addHabit(page);
  await page.getByRole('button', { name: 'Месяц', exact: true }).click();
  const group = page.getByRole('group', { name: 'Отметки: Календарь' });
  await expect(group.getByRole('button')).toHaveCount(42);
  await expect(group.getByRole('button', { name: '1.3 не выполнено', exact: true })).toBeVisible();
  await expect(group.getByRole('button', { name: '5.4 — будущая дата', exact: true })).toBeDisabled();
  await group.getByRole('button', { name: '16.3 не выполнено', exact: true }).click();
  await page.getByRole('button', { name: 'Неделя', exact: true }).click();
  await expect(group.getByRole('button', { name: '16.3 выполнено', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(group.getByRole('button', { name: '16.3 выполнено', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Статистика', exact: true }).click();
  await expect(page.getByText('Цель на эту неделю: 1/5 — в процессе')).toBeVisible();
});

test('legacy marks are preserved, validated and migrated once with original backups', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-03-16T12:00:00+05:00'));
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'reading', name: 'Старая привычка', color: '#2563eb', icon: '📖', goalPerWeek: 1 }, null]));
    localStorage.setItem('habit-tracker-marks', JSON.stringify({ reading: ['2026-03-15', 'bad'] }));
  });
  await page.reload();
  await expect(page.getByRole('note')).toContainText('Старые отметки перенесены');
  await page.getByRole('button', { name: 'Предыдущий период', exact: true }).click();
  await expect(page.getByRole('button', { name: '15.3 выполнено', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Следующий период', exact: true }).click();
  await page.getByRole('button', { name: '16.3 не выполнено', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: '16.3 выполнено', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('habit-tracker-marks')!))).toEqual({ reading: ['2026-03-15', 'bad'] });
  await page.goto('/stats');
  await expect(page.getByText('Цель на эту неделю: 1/1 — достигнута')).toBeVisible();
});

test('corrupted data and unavailable storage do not crash the app', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('habit-tracker-data-v2', '{broken'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Не удалось прочитать');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  });
  await page.getByRole('link', { name: 'Привычки', exact: true }).click();
  await page.getByPlaceholder('Название привычки').fill('В памяти');
  await page.getByRole('button', { name: 'Добавить привычку', exact: true }).click();
  await expect(page.getByText('📖 В памяти', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Не удалось сохранить');
});

test('direct nested routes and refresh load the production app', async ({ page }) => {
  for (const route of ['/habits', '/stats', '/settings']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
  }
});
