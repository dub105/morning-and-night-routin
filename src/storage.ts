import type { RoutineData, RoutineTask } from './types';

const STORAGE_KEY = 'routine-manager-data';

const DEFAULT_MORNING: Omit<RoutineTask, 'id'>[] = [
  { text: '起床・布団をたたむ', done: false, order: 0 },
  { text: '顔を洗う・歯磨き', done: false, order: 1 },
  { text: '朝食を食べる', done: false, order: 2 },
  { text: '着替え', done: false, order: 3 },
  { text: '持ち物の確認', done: false, order: 4 },
];

const DEFAULT_NIGHT: Omit<RoutineTask, 'id'>[] = [
  { text: '翌日の持ち物を準備', done: false, order: 0 },
  { text: 'お風呂・シャワー', done: false, order: 1 },
  { text: '歯磨き', done: false, order: 2 },
  { text: 'スマホを充電する', done: false, order: 3 },
  { text: '翌日のスケジュール確認', done: false, order: 4 },
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadData(): RoutineData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefault();
    const data: RoutineData = JSON.parse(raw);

    // 日付が変わっていたらチェックをリセット
    if (data.lastResetDate !== todayString()) {
      data.morning = data.morning.map(t => ({ ...t, done: false }));
      data.night = data.night.map(t => ({ ...t, done: false }));
      data.lastResetDate = todayString();
      saveData(data);
    }
    return data;
  } catch {
    return createDefault();
  }
}

function createDefault(): RoutineData {
  return {
    morning: DEFAULT_MORNING.map(t => ({ ...t, id: generateId() })),
    night: DEFAULT_NIGHT.map(t => ({ ...t, id: generateId() })),
    lastResetDate: todayString(),
  };
}

export function saveData(data: RoutineData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function newTask(text: string, order: number): RoutineTask {
  return { id: generateId(), text, done: false, order };
}
