import { HabitsStore } from './HabitsStore';
import { SettingsStore } from './SettingsStore';

const habit = { id: 'reading', name: 'Чтение', color: '#2563eb', icon: '📖', goalPerWeek: 5 };
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

it('imports valid legacy data without guessing old date shifts or modifying the backup', () => {
  const raw = JSON.stringify({ reading: ['2026-03-15', '2026-03-15', 'invalid', '2026-02-30'], bad: null });
  localStorage.setItem('habit-tracker-habits', JSON.stringify([habit, null, {}, { ...habit, id: 'bad', goalPerWeek: -1 }]));
  localStorage.setItem('habit-tracker-marks', raw);
  const store = new HabitsStore();
  expect(store.habits).toHaveLength(1);
  expect(store.getDoneDates('reading')).toEqual(['2026-03-15']);
  expect(store.legacyImported).toBe(true);
  store.toggleDay('reading', new Date(2026, 2, 16, 0));
  expect(store.isDone('reading', new Date(2026, 2, 16, 12))).toBe(true);
  expect(localStorage.getItem('habit-tracker-marks')).toBe(raw);
  expect(new HabitsStore().getDoneDates('reading')).toEqual(['2026-03-15', '2026-03-16']);
});

it('survives malformed localStorage and preserves unreadable snapshots before replacing them', () => {
  localStorage.setItem('habit-tracker-data-v2', '{broken');
  const store = new HabitsStore();
  expect(store.habits).toEqual([]);
  expect(store.storageError).toBeTruthy();
  store.addHabit(habit);
  expect(localStorage.getItem('habit-tracker-data-v2-recovery')).toBe('{broken');
});

it('ignores unknown habits and future days and persists deletion', () => {
  const store = new HabitsStore();
  store.addHabit(habit);
  const id = store.habits[0].id;
  store.toggleDay('missing', new Date(2026, 2, 16));
  store.toggleDay(id, new Date(2099, 0, 1));
  expect(store.getDoneDates(id)).toEqual([]);
  store.removeHabit(id);
  expect(new HabitsStore().habits).toEqual([]);
});

it('reports write failure without crashing or losing the in-memory change', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota exceeded'); });
  const store = new HabitsStore();
  expect(() => store.addHabit(habit)).not.toThrow();
  expect(store.habits).toHaveLength(1);
  expect(store.storageError).toMatch(/не удалось сохранить/i);
  const settings = new SettingsStore();
  expect(() => settings.toggleTheme()).not.toThrow();
  expect(settings.storageError).toBeTruthy();
});

it('salvages valid habits even if legacy marks contain malformed JSON', () => {
  localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
  localStorage.setItem('habit-tracker-marks', '{broken');
  const store = new HabitsStore();
  expect(store.habits).toHaveLength(1);
  expect(store.getDoneDates('reading')).toEqual([]);
  expect(store.storageError).toBeTruthy();
  store.toggleDay('reading', new Date(2026, 2, 16));
  expect(localStorage.getItem('habit-tracker-marks')).toBe('{broken');
});

it('backs up a partially corrupt v2 snapshot before persisting salvaged records', () => {
  const snapshot = JSON.stringify({ version: 2, habits: [habit, null], marks: { reading: ['2026-03-15', 'bad'] } });
  localStorage.setItem('habit-tracker-data-v2', snapshot);
  const store = new HabitsStore();
  expect(store.habits).toHaveLength(1);
  expect(store.storageError).toBeTruthy();
  store.toggleDay('reading', new Date(2026, 2, 16));
  expect(localStorage.getItem('habit-tracker-data-v2-recovery')).toBe(snapshot);
});
