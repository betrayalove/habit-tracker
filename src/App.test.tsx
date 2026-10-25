import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { App } from './App';
import { LIGHT_THEME } from './styles/theme';
import { habitsStore, settingsStore } from './store';

function renderWithProviders(ui: React.ReactElement) {
  return render(<ThemeProvider theme={LIGHT_THEME}>{ui}</ThemeProvider>);
}

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  habitsStore.clearForTesting();
  settingsStore.resetForTesting();
});

describe('MainPage', () => {
  it('рендерит заголовок и переключатель периода', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /трекер привычек/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /неделя/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /месяц/i })).toBeInTheDocument();
  });

  it('при отсутствии привычек показывает пустое состояние', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/нет привычек/i)).toBeInTheDocument();
  });

  it('при наличии привычек рендерит сетку по дням', () => {
    habitsStore.addHabit({ name: 'Чтение', color: '#2563eb', icon: '📖', goalPerWeek: 5 });
    renderWithProviders(<App />);
    expect(screen.getByText(/чтение/i)).toBeInTheDocument();
  });
});

describe('PeriodSwitcher', () => {
  it('переключение периода меняет отображаемый период', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    const monthBtn = screen.getByRole('button', { name: /месяц/i });
    await user.click(monthBtn);
    expect(settingsStore.period).toBe('month');
  });
});

describe('HabitForm', () => {
  it('сабмит формы добавляет привычку в список', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    await user.click(screen.getByRole('link', { name: /привычки/i }));
    await user.type(await screen.findByPlaceholderText(/название привычки/i), 'Бег');
    await user.click(screen.getByRole('button', { name: /добавить привычку/i }));
    expect(habitsStore.habits).toHaveLength(1);
    expect(habitsStore.habits[0].name).toBe('Бег');
  });
});

describe('Settings', () => {
  it('настройки сохраняют тему в сторе', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    await user.click(screen.getByRole('link', { name: /настройки/i }));
    await user.click(within(await screen.findByRole('region', { name: 'Тема' })).getByRole('button', { name: /тёмная тема/i }));
    expect(settingsStore.theme).toBe('dark');
  });
});
