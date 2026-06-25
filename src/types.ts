export type TimeOfDay = 'morning' | 'night';

export interface RoutineTask {
  id: string;
  text: string;
  done: boolean;
  order: number;
}

export interface RoutineData {
  morning: RoutineTask[];
  night: RoutineTask[];
  lastResetDate: string; // YYYY-MM-DD
}
