import { settingsStore } from '@/store';

export function usePeriodLabel(periodOffset: number): string {
  const period = settingsStore.period;
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - start.getDay() + 1 + periodOffset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.getDate()}.${start.getMonth() + 1} – ${end.getDate()}.${end.getMonth() + 1}`;
  }
  const month = now.getMonth() + periodOffset;
  const m = ((month % 12) + 12) % 12;
  const y = now.getFullYear() + Math.floor(month / 12);
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  return `${monthNames[m]} ${y}`;
}
