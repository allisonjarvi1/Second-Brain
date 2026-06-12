import type { EnergyLevel, Task } from '../types';
import { getTopTasks } from '../utils/energy';
import { TaskCard } from './TaskCard';

export function TopThree({
  tasks,
  currentEnergy,
  onSelect,
}: {
  tasks: Task[];
  currentEnergy: EnergyLevel;
  onSelect: (task: Task) => void;
}) {
  const top = getTopTasks(tasks, currentEnergy, 3);

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-lg font-semibold text-ink">✨ Top 3 for today</h2>
        <p className="text-sm text-ink-soft">Picked to match your current energy and what's most pressing.</p>
      </div>
      {top.length === 0 ? (
        <div className="rounded-2xl bg-paper p-6 text-center text-sm text-ink-soft shadow-sm">
          Nothing on your plate right now. Add a task or check your parking lot for something to revive.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((task) => (
            <TaskCard key={task.id} task={task} currentEnergy={currentEnergy} onClick={() => onSelect(task)} />
          ))}
        </div>
      )}
    </section>
  );
}
