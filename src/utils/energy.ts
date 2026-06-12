import type { EnergyLevel, Task } from '../types';

const LEVEL_VALUE: Record<EnergyLevel, number> = { Low: 1, Medium: 2, High: 3 };

export type EnergyMatch = 'match' | 'stretch' | 'mismatch';

/** How well a task's required energy fits the energy you currently have. */
export function getEnergyMatch(currentEnergy: EnergyLevel, energyNeeded: EnergyLevel): EnergyMatch {
  const diff = Math.abs(LEVEL_VALUE[currentEnergy] - LEVEL_VALUE[energyNeeded]);
  if (diff === 0) return 'match';
  if (diff === 1) return 'stretch';
  return 'mismatch';
}

const PRIORITY_WEIGHT: Record<Task['priority'], number> = { High: 3, Medium: 2, Low: 1 };
const MATCH_WEIGHT: Record<EnergyMatch, number> = { match: 3, stretch: 1, mismatch: -2 };

function deadlineUrgency(deadline: string): number {
  if (!deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 20; // due today or overdue
  if (days <= 2) return 10;
  if (days <= 7) return 5;
  return 0;
}

/** Score a task for "what should I work on today", given the current energy level. */
export function scoreTask(task: Task, currentEnergy: EnergyLevel): number {
  const match = getEnergyMatch(currentEnergy, task.energyNeeded);
  return PRIORITY_WEIGHT[task.priority] * 10 + MATCH_WEIGHT[match] * 5 + deadlineUrgency(task.deadline);
}

/** Pick the best tasks to work on today, given the current energy level. */
export function getTopTasks(tasks: Task[], currentEnergy: EnergyLevel, count = 3): Task[] {
  return tasks
    .filter((t) => t.status !== 'Done' && t.status !== 'Parked')
    .map((t) => ({ task: t, score: scoreTask(t, currentEnergy) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.task);
}

export function isDueSoon(deadline: string, withinDays = 3): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return days <= withinDays;
}

export function isOverdue(deadline: string): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}
