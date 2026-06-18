import { useState } from 'react';
import type { EnergyLevel, Task } from '../types';
import { ParkingCard } from './ParkingCard';

export function ParkingLot({
  tasks,
  currentEnergy: _currentEnergy,
  onSelect,
}: {
  tasks: Task[];
  currentEnergy: EnergyLevel;
  onSelect: (task: Task) => void;
}) {
  const [open, setOpen] = useState(false);
  const parked = tasks.filter((t) => t.status === 'Parked');
  const withImages = parked.filter((t) => t.images && t.images.length > 0);

  return (
    <section className="rounded-2xl bg-paper p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <h2 className="font-heading text-lg font-semibold text-ink">🌊 Parking lot</h2>
          <p className="text-sm text-ink-soft">
            {parked.length === 0
              ? 'Nothing parked — your mind is clear.'
              : `${parked.length} idea${parked.length === 1 ? '' : 's'} resting${withImages.length > 0 ? ` · ${withImages.length} with images` : ''}`}
          </p>
        </div>
        <span className="text-ink-soft">{open ? '▲' : '▼'}</span>
      </button>

      {open && parked.length > 0 && (
        <div className="mt-4">
          {/* Image-first masonry-style grid */}
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
            {parked.map((task) => (
              <div key={task.id} className="mb-3 break-inside-avoid">
                <ParkingCard task={task} onClick={() => onSelect(task)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
