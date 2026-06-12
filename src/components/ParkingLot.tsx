import { useState } from 'react';
import type { EnergyLevel, Task } from '../types';
import { TaskCard } from './TaskCard';

export function ParkingLot({
  tasks,
  currentEnergy,
  onSelect,
}: {
  tasks: Task[];
  currentEnergy: EnergyLevel;
  onSelect: (task: Task) => void;
}) {
  const [open, setOpen] = useState(false);
  const parked = tasks.filter((t) => t.status === 'Parked');

  return (
    <section className="rounded-2xl bg-paper p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <h2 className="font-heading text-lg font-semibold text-ink">🅿️ Parking lot</h2>
          <p className="text-sm text-ink-soft">
            {parked.length === 0
              ? 'Nothing parked — your mind is clear.'
              : `${parked.length} idea${parked.length === 1 ? '' : 's'} resting for later`}
          </p>
        </div>
        <span className="text-ink-soft">{open ? '▲' : '▼'}</span>
      </button>

      {open && parked.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parked.map((task) => (
            <TaskCard key={task.id} task={task} currentEnergy={currentEnergy} onClick={() => onSelect(task)} />
          ))}
        </div>
      )}
    </section>
  );
}
