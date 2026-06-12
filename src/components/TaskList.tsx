import type { EnergyLevel, Task } from '../types';
import type { SortField, SortState } from '../types-filters';
import { Badge } from './Badge';
import { TaskCard } from './TaskCard';
import { getEnergyMatch, isOverdue } from '../utils/energy';
import { formatDeadline } from '../utils/format';
import {
  ENERGY_EFFECT_ICON,
  ENERGY_EFFECT_STYLES,
  ENERGY_MATCH_LABEL,
  ENERGY_MATCH_STYLES,
  ENERGY_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '../utils/styles';

const COLUMNS: { field: SortField; label: string }[] = [
  { field: 'title', label: 'Task' },
  { field: 'client', label: 'Client' },
  { field: 'status', label: 'Status' },
  { field: 'priority', label: 'Priority' },
  { field: 'energyNeeded', label: 'Energy' },
  { field: 'deadline', label: 'Deadline' },
];

export function TaskList({
  tasks,
  currentEnergy,
  sort,
  onSortChange,
  onSelect,
}: {
  tasks: Task[];
  currentEnergy: EnergyLevel;
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onSelect: (task: Task) => void;
}) {
  function toggleSort(field: SortField) {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, direction: 'desc' });
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl bg-paper p-8 text-center text-sm text-ink-soft shadow-sm">
        Nothing here yet. Try adjusting filters or add something new.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} currentEnergy={currentEnergy} onClick={() => onSelect(task)} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-2xl bg-paper shadow-sm sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-lilac">
              {COLUMNS.map((col) => (
                <th key={col.field} className="px-4 py-3 font-heading font-semibold text-ink-soft">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.field)}
                    className="flex items-center gap-1 hover:text-ink"
                  >
                    {col.label}
                    {sort.field === col.field && <span>{sort.direction === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-heading font-semibold text-ink-soft">Energy fit</th>
              <th className="px-4 py-3 font-heading font-semibold text-ink-soft">Next action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const match = getEnergyMatch(currentEnergy, task.energyNeeded);
              const overdue = isOverdue(task.deadline) && task.status !== 'Done';
              return (
                <tr
                  key={task.id}
                  onClick={() => onSelect(task)}
                  className="cursor-pointer border-b border-lilac/60 last:border-0 hover:bg-cream"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{task.title}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {task.bucket === 'Client Work' ? task.client || '—' : 'Personal'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_STYLES[task.status]}>{task.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={PRIORITY_STYLES[task.priority]}>{task.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge className={ENERGY_STYLES[task.energyNeeded]}>{task.energyNeeded}</Badge>
                      <Badge className={ENERGY_EFFECT_STYLES[task.energyEffect]}>
                        {ENERGY_EFFECT_ICON[task.energyEffect]} {task.energyEffect}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {task.deadline ? (
                      <span className={`font-semibold ${overdue ? 'text-blush-deep' : 'text-ink-soft'}`}>
                        {formatDeadline(task.deadline)}
                      </span>
                    ) : (
                      <span className="text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={ENERGY_MATCH_STYLES[match]}>{ENERGY_MATCH_LABEL[match]}</Badge>
                  </td>
                  <td className="px-4 py-3 max-w-[220px] truncate text-ink-soft">{task.nextAction || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
