import { makeAutoObservable } from 'mobx';
import type { PeriodType, ThemeType } from '@/types';

const STORAGE_KEY = 'habit-tracker-settings';

interface SettingsState {
  period: PeriodType;
  theme: ThemeType;
}

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { period: 'week', theme: 'light' };
    const parsed = JSON.parse(raw);
    return {
      period: parsed.period === 'month' ? 'month' : 'week',
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { period: 'week', theme: 'light' };
  }
}

export class SettingsStore {
  period: PeriodType = 'week';
  theme: ThemeType = 'light';
  storageError: string | null = null;

  constructor() {
    makeAutoObservable(this);
    const loaded = loadSettings();
    this.period = loaded.period;
    this.theme = loaded.theme;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ period: this.period, theme: this.theme }));
      this.storageError = null;
    } catch {
      this.storageError = 'Не удалось сохранить настройки в браузере. Изменения действуют только в этой вкладке.';
    }
  }

  setPeriod(period: PeriodType) {
    this.period = period;
    this.persist();
  }

  setTheme(theme: ThemeType) {
    this.theme = theme;
    this.persist();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.persist();
  }

  resetForTesting() {
    this.period = 'week';
    this.theme = 'light';
  }
}

export const settingsStore = new SettingsStore();
