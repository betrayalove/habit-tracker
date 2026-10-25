import type { PeriodType } from '@/types';

/** Calendar dates are local civil days, never UTC timestamps. */
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function getDaysForPeriod(period: PeriodType, offset: number, now = new Date()): Date[] {
  const start = period === 'week'
    ? addDays(startOfWeek(now), offset * 7)
    : startOfWeek(new Date(now.getFullYear(), now.getMonth() + offset, 1));
  const end = period === 'week'
    ? addDays(start, 6)
    : addDays(startOfWeek(new Date(now.getFullYear(), now.getMonth() + offset + 1, 0)), 6);
  const days: Date[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  return days;
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return dateKey(new Date(year, month - 1, day)) === value;
}

/** Today's unchecked box does not break yesterday's ongoing streak. */
export function getStreak(doneDates: string[], now = new Date()): number {
  const dates = new Set(doneDates);
  let day = dates.has(dateKey(now)) ? addDays(now, 0) : addDays(now, -1);
  let streak = 0;
  while (dates.has(dateKey(day))) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

export function weeklyProgress(doneDates: string[], now = new Date()): number {
  const start = dateKey(startOfWeek(now));
  const today = dateKey(now);
  return new Set(doneDates.filter((day) => day >= start && day <= today)).size;
}
