import type { Bucket, EnergyLevel } from './types';

export type StatusGroup = 'All' | 'In Progress' | 'Parked';

export interface FilterState {
  bucket: 'All' | Bucket;
  energy: 'All' | EnergyLevel;
  dueSoon: boolean;
  statusGroup: StatusGroup;
  search: string;
  client: 'All' | string;
}

export const DEFAULT_FILTERS: FilterState = {
  bucket: 'All',
  energy: 'All',
  dueSoon: false,
  statusGroup: 'All',
  search: '',
  client: 'All',
};

export type SortField = 'priority' | 'deadline' | 'status' | 'title' | 'energyNeeded' | 'client';

export interface SortState {
  field: SortField;
  direction: 'asc' | 'desc';
}

export const DEFAULT_SORT: SortState = { field: 'priority', direction: 'desc' };
