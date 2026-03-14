import { makeAutoObservable } from 'mobx';
import type { Habit } from '@/types';

const STORAGE_KEY = 'habit-tracker-habits';
const MARKS_KEY = 'habit-tracker-marks';

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadMarks(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(MARKS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function saveMarks(marks: Record<string, string[]>) {
  localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
}

function dateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class HabitsStore {
  habits: Habit[] = [];
  marks: Record<string, string[]> = {};

  constructor() {
    makeAutoObservable(this);
    this.habits = loadHabits();
    this.marks = loadMarks();
  }

  private persistHabits() {
    saveHabits(this.habits);
  }

  private persistMarks() {
    saveMarks(this.marks);
  }

  addHabit(habit: Omit<Habit, 'id'>) {
    const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.habits.push({ ...habit, id });
    this.marks[id] = [];
    this.persistHabits();
    this.persistMarks();
  }

  updateHabit(id: string, patch: Partial<Omit<Habit, 'id'>>) {
    const idx = this.habits.findIndex((h) => h.id === id);
    if (idx === -1) return;
    this.habits[idx] = { ...this.habits[idx], ...patch };
    this.persistHabits();
  }

  removeHabit(id: string) {
    this.habits = this.habits.filter((h) => h.id !== id);
    const { [id]: _, ...rest } = this.marks;
    this.marks = rest;
    this.persistHabits();
    this.persistMarks();
  }

  getHabit(id: string): Habit | undefined {
    return this.habits.find((h) => h.id === id);
  }

  isDone(habitId: string, date: Date): boolean {
    const key = dateString(date);
    return (this.marks[habitId] ?? []).includes(key);
  }

  toggleDay(habitId: string, date: Date) {
    const key = dateString(date);
    const list = this.marks[habitId] ?? [];
    const has = list.includes(key);
    if (has) {
      this.marks[habitId] = list.filter((d) => d !== key);
    } else {
      this.marks[habitId] = [...list, key];
    }
    this.persistMarks();
  }

  getDoneDates(habitId: string): string[] {
    return this.marks[habitId] ?? [];
  }

  clearForTesting() {
    this.habits = [];
    this.marks = {};
  }
}

export const habitsStore = new HabitsStore();
