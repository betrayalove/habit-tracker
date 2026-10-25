import { addDays, dateKey, getDaysForPeriod, getStreak, isDateKey, startOfWeek, weeklyProgress } from './dates';

describe('local calendar dates', () => {
  it('keeps Sunday in the current Monday-based week', () => {
    expect(dateKey(startOfWeek(new Date(2026, 9, 25, 23)))).toBe('2026-10-19');
    expect(getDaysForPeriod('week', 0, new Date(2026, 9, 25)).map(dateKey))
      .toEqual(['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25']);
  });
  it('includes first Sunday and complete final week of a month', () => {
    const days = getDaysForPeriod('month', 0, new Date(2026, 2, 16));
    expect(dateKey(days[0])).toBe('2026-02-23');
    expect(days.map(dateKey)).toContain('2026-03-01');
    expect(dateKey(days[days.length - 1])).toBe('2026-04-05');
    expect(days).toHaveLength(42);
  });
  it('handles year, leap-day and DST boundaries without UTC conversion', () => {
    expect(dateKey(startOfWeek(new Date(2027, 0, 1)))).toBe('2026-12-28');
    expect(dateKey(addDays(new Date(2024, 1, 28), 1))).toBe('2024-02-29');
    expect(dateKey(addDays(new Date(2026, 2, 29), 1))).toBe('2026-03-30');
    expect(dateKey(new Date(2026, 2, 16, 0))).toBe(dateKey(new Date(2026, 2, 16, 23)));
    expect(isDateKey('2026-02-30')).toBe(false);
  });
  it('counts a streak through yesterday until today is completed', () => {
    const now = new Date(2026, 2, 16);
    expect(getStreak(['2026-03-14', '2026-03-15'], now)).toBe(2);
    expect(getStreak(['2026-03-14', '2026-03-15', '2026-03-16', '2026-03-16'], now)).toBe(3);
    expect(getStreak(['2026-03-14', '2026-03-17'], now)).toBe(0);
  });
  it('counts only unique completed days in the current week, through today', () => {
    expect(weeklyProgress(['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-20', '2026-10-26'], new Date(2026, 9, 25))).toBe(2);
  });
});
