import type { Task } from '../types';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-paper px-3 py-3 text-center shadow-sm">
      <span className="font-heading text-2xl font-bold text-ink">{value}</span>
      <span className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{label}</span>
    </div>
  );
}

export function Stats({ tasks }: { tasks: Task[] }) {
  const clientWork = tasks.filter((t) => t.bucket === 'Client Work').length;
  const personalIdeas = tasks.filter((t) => t.bucket === 'Personal Idea').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const parked = tasks.filter((t) => t.status === 'Parked').length;

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <StatCard label="Client work" value={clientWork} />
      <StatCard label="Personal ideas" value={personalIdeas} />
      <StatCard label="In progress" value={inProgress} />
      <StatCard label="Parked" value={parked} />
    </div>
  );
}
