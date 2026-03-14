export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  goalPerWeek: number;
}

export type PeriodType = 'week' | 'month';

export type ThemeType = 'light' | 'dark';
