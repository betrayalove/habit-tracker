import { makeAutoObservable } from 'mobx';
import type { Habit } from '@/types';
import { dateKey, isDateKey } from '@/shared/lib/dates';

const SNAPSHOT_KEY = 'habit-tracker-data-v2';
const READ_ERROR = 'Часть сохранённых данных повреждена и не загружена. Исходная запись сохранена в браузере.';
const STORAGE_ERROR = 'Не удалось сохранить данные в браузере. Освободите место или разрешите localStorage; изменения пока доступны только в этой вкладке.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isHabit(value: unknown): value is Habit {
  return isRecord(value) && typeof value.id === 'string' && value.id.length > 0 && !['__proto__', 'constructor', 'prototype'].includes(value.id)
    && typeof value.name === 'string' && value.name.trim().length > 0
    && typeof value.color === 'string' && /^#[0-9a-f]{6}$/i.test(value.color)
    && typeof value.icon === 'string' && value.icon.length > 0
    && Number.isInteger(value.goalPerWeek) && Number(value.goalPerWeek) >= 1 && Number(value.goalPerWeek) <= 7;
}

export class HabitsStore {
  habits: Habit[] = [];
  marks: Record<string, string[]> = {};
  storageError: string | null = null;
  legacyImported = false;
  private unreadableSnapshot: string | null = null;

  constructor() {
    makeAutoObservable(this);
    try {
      const snapshot = localStorage.getItem(SNAPSHOT_KEY);
      let habits: unknown;
      let marks: unknown;
      if (snapshot) {
        this.unreadableSnapshot = snapshot;
        const parsed: unknown = JSON.parse(snapshot);
        if (!isRecord(parsed) || parsed.version !== 2 || !Array.isArray(parsed.habits) || !isRecord(parsed.marks)) throw new Error('Invalid snapshot');
        habits = parsed.habits;
        marks = parsed.marks;
        this.legacyImported = parsed.legacyImported === true;
      } else {
        const rawHabits = localStorage.getItem('habit-tracker-habits');
        const rawMarks = localStorage.getItem('habit-tracker-marks');
        habits = rawHabits ? JSON.parse(rawHabits) : [];
        try {
          marks = rawMarks ? JSON.parse(rawMarks) : {};
        } catch {
          marks = {};
          this.storageError = READ_ERROR;
        }
        this.legacyImported = rawMarks !== null && isRecord(marks) && Object.keys(marks).length > 0;
      }
      const seen = new Set<string>();
      this.habits = Array.isArray(habits) ? habits.filter(isHabit).filter((habit) => {
        if (seen.has(habit.id)) return false;
        seen.add(habit.id);
        return true;
      }) : [];
      this.marks = Object.fromEntries(this.habits.map((habit) => {
        const values = isRecord(marks) && Object.prototype.hasOwnProperty.call(marks, habit.id) ? marks[habit.id] : [];
        return [habit.id, Array.isArray(values) ? [...new Set(values.filter(isDateKey))].sort() : []];
      }));
      const incomplete = !Array.isArray(habits) || this.habits.length !== habits.length || !isRecord(marks)
        || Object.values(marks).some((values) => !Array.isArray(values) || values.some((value) => !isDateKey(value)));
      if (incomplete) this.storageError = READ_ERROR;
      if (!incomplete) this.unreadableSnapshot = null;
    } catch {
      this.storageError = 'Не удалось прочитать сохранённые данные. Исходная запись сохранена в localStorage; проверьте её перед добавлением новых привычек.';
    }
  }

  private persist() {
    try {
      if (this.unreadableSnapshot !== null) {
        localStorage.setItem(`${SNAPSHOT_KEY}-recovery`, this.unreadableSnapshot);
        this.unreadableSnapshot = null;
      }
      // Legacy keys stay untouched: old UTC-derived dates cannot be shifted reliably.
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ version: 2, habits: this.habits, marks: this.marks, legacyImported: this.legacyImported }));
      this.storageError = null;
    } catch {
      this.storageError = STORAGE_ERROR;
    }
  }

  addHabit(habit: Omit<Habit, 'id'>) {
    const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const entry = { ...habit, name: habit.name.trim(), id };
    if (!isHabit(entry)) return;
    this.habits.push(entry);
    this.marks[id] = [];
    this.persist();
  }

  updateHabit(id: string, patch: Partial<Omit<Habit, 'id'>>) {
    const idx = this.habits.findIndex((habit) => habit.id === id);
    if (idx === -1) return;
    const entry = { ...this.habits[idx], ...patch };
    if (!isHabit(entry)) return;
    this.habits[idx] = entry;
    this.persist();
  }

  removeHabit(id: string) {
    this.habits = this.habits.filter((habit) => habit.id !== id);
    delete this.marks[id];
    this.persist();
  }

  getHabit(id: string): Habit | undefined {
    return this.habits.find((habit) => habit.id === id);
  }

  isDone(habitId: string, date: Date): boolean {
    return (this.marks[habitId] ?? []).includes(dateKey(date));
  }

  toggleDay(habitId: string, date: Date) {
    const key = dateKey(date);
    if (!this.getHabit(habitId) || !isDateKey(key) || key > dateKey(new Date())) return;
    const list = this.marks[habitId] ?? [];
    this.marks[habitId] = list.includes(key) ? list.filter((day) => day !== key) : [...list, key].sort();
    this.persist();
  }

  getDoneDates(habitId: string): string[] {
    return [...(this.marks[habitId] ?? [])];
  }

  clearForTesting() {
    this.habits = [];
    this.marks = {};
    this.storageError = null;
    this.legacyImported = false;
  }
}

export const habitsStore = new HabitsStore();
