export type Bucket = 'Client Work' | 'Personal Idea';

export type TaskType =
  | 'Task'
  | 'Idea'
  | 'Project'
  | 'Admin'
  | 'Research'
  | 'Creative'
  | 'Meeting'
  | 'Other';

export type Status = 'Not Started' | 'In Progress' | 'Waiting' | 'Parked' | 'Done';

export type Priority = 'High' | 'Medium' | 'Low';

export type EnergyLevel = 'High' | 'Medium' | 'Low';

export type EnergyEffect = 'Boost' | 'Drain' | 'Neutral';

export interface Task {
  id: string;
  title: string;
  bucket: Bucket;
  client: string;
  type: TaskType;
  status: Status;
  priority: Priority;
  deadline: string; // ISO date string, '' if none
  energyNeeded: EnergyLevel;
  nextAction: string;
  notes: string;
  source: string;
  energyEffect: EnergyEffect;
  createdAt: string;
  updatedAt: string;
}

export const BUCKETS: Bucket[] = ['Client Work', 'Personal Idea'];
export const TASK_TYPES: TaskType[] = [
  'Task',
  'Idea',
  'Project',
  'Admin',
  'Research',
  'Creative',
  'Meeting',
  'Other',
];
export const STATUSES: Status[] = ['Not Started', 'In Progress', 'Waiting', 'Parked', 'Done'];
export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
export const ENERGY_LEVELS: EnergyLevel[] = ['High', 'Medium', 'Low'];
export const ENERGY_EFFECTS: EnergyEffect[] = ['Boost', 'Drain', 'Neutral'];
