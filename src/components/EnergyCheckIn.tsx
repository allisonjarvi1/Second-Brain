import type { EnergyLevel } from '../types';

const OPTIONS: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: 'Low', emoji: '🌙', label: 'Low' },
  { level: 'Medium', emoji: '🌤️', label: 'Medium' },
  { level: 'High', emoji: '⚡', label: 'High' },
];

export function EnergyCheckIn({
  currentEnergy,
  onChange,
}: {
  currentEnergy: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-paper p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-heading text-base font-semibold text-ink">How's your energy right now?</p>
        <p className="text-sm text-ink-soft">We'll surface tasks that fit how you're feeling.</p>
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.level}
            type="button"
            onClick={() => onChange(opt.level)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              currentEnergy === opt.level
                ? 'bg-lilac-deep text-white shadow-sm'
                : 'bg-lilac text-ink-soft hover:bg-lilac-deep/30'
            }`}
          >
            <span className="text-base">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
