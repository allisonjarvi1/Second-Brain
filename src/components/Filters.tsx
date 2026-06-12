import type { FilterState, StatusGroup } from '../types-filters';
import type { Bucket, EnergyLevel } from '../types';

const BUCKET_OPTIONS: ('All' | Bucket)[] = ['All', 'Client Work', 'Personal Idea'];
const ENERGY_OPTIONS: ('All' | EnergyLevel)[] = ['All', 'Low', 'Medium', 'High'];
const STATUS_OPTIONS: StatusGroup[] = ['All', 'In Progress', 'Parked'];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
        active ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:bg-lilac'
      }`}
    >
      {children}
    </button>
  );
}

export function Filters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-cream p-1">
      <input
        type="search"
        placeholder="Search tasks, clients, notes…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="w-full rounded-xl border border-lilac-deep/30 bg-paper px-4 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-lilac-deep focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-wide text-ink-soft uppercase">Bucket</span>
        {BUCKET_OPTIONS.map((opt) => (
          <Pill key={opt} active={filters.bucket === opt} onClick={() => onChange({ ...filters, bucket: opt })}>
            {opt}
          </Pill>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-wide text-ink-soft uppercase">Energy</span>
        {ENERGY_OPTIONS.map((opt) => (
          <Pill key={opt} active={filters.energy === opt} onClick={() => onChange({ ...filters, energy: opt })}>
            {opt}
          </Pill>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-wide text-ink-soft uppercase">Status</span>
        {STATUS_OPTIONS.map((opt) => (
          <Pill
            key={opt}
            active={filters.statusGroup === opt}
            onClick={() => onChange({ ...filters, statusGroup: opt })}
          >
            {opt}
          </Pill>
        ))}
        <Pill active={filters.dueSoon} onClick={() => onChange({ ...filters, dueSoon: !filters.dueSoon })}>
          Due soon
        </Pill>
      </div>
    </div>
  );
}
