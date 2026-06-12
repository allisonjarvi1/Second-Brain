import type { EnergyLevel, Priority, Status, Task } from '../types';
import type { SortState } from '../types-filters';

const PRIORITY_ORDER: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
const ENERGY_ORDER: Record<EnergyLevel, number> = { High: 3, Medium: 2, Low: 1 };
const STATUS_ORDER: Record<Status, number> = {
  'In Progress': 4,
  'Not Started': 3,
  Waiting: 2,
  Parked: 1,
  Done: 0,
};

export function sortTasks(tasks: Task[], sort: SortState): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let result = 0;
    switch (sort.field) {
      case 'priority':
        result = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'energyNeeded':
        result = ENERGY_ORDER[a.energyNeeded] - ENERGY_ORDER[b.energyNeeded];
        break;
      case 'status':
        result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        break;
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      case 'deadline': {
        if (!a.deadline && !b.deadline) result = 0;
        else if (!a.deadline) return 1;
        else if (!b.deadline) return -1;
        else result = a.deadline.localeCompare(b.deadline);
        break;
      }
      case 'client': {
        if (!a.client && !b.client) result = 0;
        else if (!a.client) return 1;
        else if (!b.client) return -1;
        else result = a.client.localeCompare(b.client);
        break;
      }
    }
    return sort.direction === 'asc' ? result : -result;
  });
  return sorted;
}
