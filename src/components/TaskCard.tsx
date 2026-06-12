import type { EnergyLevel, Task } from '../types';
import { Badge } from './Badge';
import { getEnergyMatch, isOverdue } from '../utils/energy';
import {
  ENERGY_EFFECT_ICON,
  ENERGY_EFFECT_STYLES,
  ENERGY_MATCH_LABEL,
  ENERGY_MATCH_STYLES,
  ENERGY_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '../utils/styles';
import { formatDeadline } from '../utils/format';

export function TaskCard({
  task,
  currentEnergy,
  onClick,
}: {
  task: Task;
  currentEnergy: EnergyLevel;
  onClick: () => void;
}) {
  const match = getEnergyMatch(currentEnergy, task.energyNeeded);
  const overdue = isOverdue(task.deadline) && task.status !== 'Done';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-2 rounded-2xl bg-paper p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-heading font-semibold text-ink">{task.title}</p>
        {task.deadline && (
          <span className={`shrink-0 text-xs font-semibold ${overdue ? 'text-blush-deep' : 'text-ink-soft'}`}>
            {formatDeadline(task.deadline)}
          </span>
        )}
      </div>

      <p className="text-sm text-ink-soft">
        {task.bucket === 'Client Work' ? task.client || 'Client Work' : 'Personal Idea'}
        {task.nextAction ? ` · ${task.nextAction}` : ''}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <Badge className={STATUS_STYLES[task.status]}>{task.status}</Badge>
        <Badge className={PRIORITY_STYLES[task.priority]}>{task.priority} priority</Badge>
        <Badge className={ENERGY_STYLES[task.energyNeeded]}>{task.energyNeeded} energy</Badge>
        <Badge className={ENERGY_MATCH_STYLES[match]}>{ENERGY_MATCH_LABEL[match]}</Badge>
        <Badge className={ENERGY_EFFECT_STYLES[task.energyEffect]}>
          {ENERGY_EFFECT_ICON[task.energyEffect]} {task.energyEffect}
        </Badge>
      </div>
    </button>
  );
}
