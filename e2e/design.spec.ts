import { writeFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const themes = {
  light: { background: 'rgb(248, 250, 252)', text: 'rgb(15, 23, 42)', surface: 'rgb(255, 255, 255)' },
  dark: { background: 'rgb(2, 6, 23)', text: 'rgb(226, 232, 240)', surface: 'rgb(15, 23, 42)' },
} as const;
const routes = { main: '/', habits: '/habits', stats: '/stats', settings: '/settings' };

for (const [viewportName, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
  for (const theme of ['light', 'dark'] as const) {
    for (const [name, route] of Object.entries(routes)) {
      test(`design ${viewportName} ${theme} ${name}`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        await page.clock.setFixedTime(new Date('2026-10-25T12:00:00+05:00'));
        await page.goto('/');
        await page.evaluate((savedTheme) => {
          localStorage.setItem('habit-tracker-settings', JSON.stringify({ theme: savedTheme, period: 'week' }));
          localStorage.setItem('habit-tracker-data-v2', JSON.stringify({
            version: 2,
            habits: [
              { id: 'reading', name: 'Чтение 20 минут', icon: '📖', color: '#2563eb', goalPerWeek: 5 },
              { id: 'walking', name: 'Прогулка на свежем воздухе', icon: '🏃', color: '#7c3aed', goalPerWeek: 4 },
              { id: 'long', name: 'ОченьДлинноеНазваниеПривычкиБезПробеловДляПроверкиПереноса', icon: '💧', color: '#16a34a', goalPerWeek: 7 },
            ],
            marks: { reading: ['2026-10-19', '2026-10-21', '2026-10-24', '2026-10-25'], walking: ['2026-10-24'], long: [] },
          }));
        }, theme);
        await page.goto(route);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.evaluate(async () => { await document.fonts.load('400 16px Inter', 'Привычки Habits'); await document.fonts.ready; });
        await expect(page.locator('body')).toHaveCSS('background-color', themes[theme].background);
        await expect(page.locator('body')).toHaveCSS('color', themes[theme].text);
        await expect(page.locator('body')).toHaveCSS('font-size', '16px');
        await expect(page.locator('body')).toHaveCSS('line-height', '25.6px');
        expect(await page.evaluate(() => document.fonts.check('16px Inter'))).toBe(true);
        await expect(page.locator('main')).toHaveCSS('padding-left', viewportName === 'mobile' ? '16px' : '32px');

        if (name === 'habits') {
          const input = page.getByRole('textbox', { name: 'Название привычки' });
          await input.focus();
          await input.fill('Новая привычка');
          await expect(input).toHaveCSS('background-color', themes[theme].surface);
          const number = page.getByRole('spinbutton');
          await expect(number).toHaveCSS('color', themes[theme].text);
          await expect(number).toHaveCSS('background-color', themes[theme].surface);
          const cta = page.getByRole('button', { name: 'Добавить привычку', exact: true });
          await expect(cta).toHaveCSS('background-color', 'rgb(37, 99, 235)');
          await expect(cta).toHaveCSS('color', 'rgb(255, 255, 255)');
        }
        if (name === 'stats') {
          await expect(page.getByRole('combobox')).toHaveCSS('color', themes[theme].text);
          await expect(page.getByRole('combobox')).toHaveCSS('background-color', themes[theme].surface);
        }
        if (name === 'main') {
          const days = page.getByRole('group', { name: 'Отметки: Чтение 20 минут' }).getByRole('button');
          const positions = await days.evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().top));
          expect(new Set(positions).size).toBe(1);
          const columns = await days.evaluateAll((buttons) => buttons.map((button) => Math.round(button.getBoundingClientRect().left)));
          const otherColumns = await page.getByRole('group', { name: 'Отметки: Прогулка на свежем воздухе' }).getByRole('button').evaluateAll((buttons) => buttons.map((button) => Math.round(button.getBoundingClientRect().left)));
          expect(otherColumns).toEqual(columns);
          await page.screenshot({ path: testInfo.outputPath('week.png'), fullPage: true });
          await page.getByRole('button', { name: 'Месяц', exact: true }).click();
          await expect(days).toHaveCount(35);
        }

        const report = await page.evaluate(() => {
          const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
          const luminance = (rgb: number[]) => rgb.slice(0, 3).map((value) => {
            const normalized = value / 255;
            return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
          }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
          const failures: { text: string; ratio: number; required: number; foreground: string; background: string }[] = [];
          let minRatio = Infinity;
          const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            const element = node.parentElement;
            const text = node.textContent?.trim() ?? '';
            if (!element || !/[\p{L}\p{N}]/u.test(text) || !element.getBoundingClientRect().width || element.closest(':disabled, option, script, style')) continue;
            const style = getComputedStyle(element);
            let ancestor: Element | null = element;
            let background = 'rgb(255, 255, 255)';
            while (ancestor) {
              const color = getComputedStyle(ancestor).backgroundColor;
              const values = parse(color);
              if (values.length === 3 || values[3] === 1) { background = color; break; }
              ancestor = ancestor.parentElement;
            }
            const lightness = [luminance(parse(style.color)), luminance(parse(background))].sort((a, b) => a - b);
            const ratio = (lightness[1] + 0.05) / (lightness[0] + 0.05);
            const required = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700) ? 3 : 4.5;
            minRatio = Math.min(minRatio, ratio);
            if (ratio < required) failures.push({ text, ratio, required, foreground: style.color, background });
          }
          return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, minRatio, failures };
        });
        await writeFile(testInfo.outputPath('metrics.json'), JSON.stringify(report, null, 2));
        await testInfo.attach('contrast-and-overflow', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
        expect(report.scrollWidth).toBeLessThanOrEqual(report.width);
        expect(report.failures).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
      });
    }
  }
}
