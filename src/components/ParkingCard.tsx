import type { Task } from '../types';

export function ParkingCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const hasImage = task.images && task.images.length > 0;

  if (hasImage) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group relative w-full overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md"
        style={{ aspectRatio: '4/3' }}
      >
        <img
          src={task.images[0]}
          alt={task.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        {/* Additional images strip */}
        {task.images.length > 1 && (
          <div className="absolute top-2 right-2 flex gap-1">
            {task.images.slice(1, 3).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-10 w-10 rounded-lg object-cover ring-2 ring-white/60"
              />
            ))}
            {task.images.length > 3 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink/50 text-xs font-bold text-white ring-2 ring-white/60">
                +{task.images.length - 3}
              </div>
            )}
          </div>
        )}
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
          <p className="font-heading font-semibold text-white leading-snug">{task.title}</p>
          {task.notes && (
            <p className="mt-0.5 text-xs text-white/80 line-clamp-2">{task.notes}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.nextAction && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                → {task.nextAction}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-2 rounded-2xl border-2 border-dashed border-lilac-deep/30 bg-paper p-4 text-left shadow-sm transition-all hover:border-lilac-deep/60 hover:shadow-md"
    >
      <p className="font-heading font-semibold text-ink">{task.title}</p>
      {task.notes && <p className="text-sm text-ink-soft line-clamp-2">{task.notes}</p>}
      {task.nextAction && (
        <p className="text-xs text-ink-soft">→ {task.nextAction}</p>
      )}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="rounded-full bg-lilac px-2 py-0.5 text-xs font-semibold text-lilac-deep">
          {task.priority}
        </span>
        <span className="ml-auto text-xs text-ink-soft/60">Tap to add image</span>
      </div>
    </button>
  );
}
