import { useState } from 'react';
import type { Bucket, Task } from '../types';

export function QuickAdd({
  onAdd,
  onOpenFull,
}: {
  onAdd: (draft: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFull: () => void;
}) {
  const [title, setTitle] = useState('');
  const [bucket, setBucket] = useState<Bucket>('Client Work');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      title: trimmed,
      bucket,
      client: '',
      type: bucket === 'Client Work' ? 'Task' : 'Idea',
      status: 'Not Started',
      priority: 'Medium',
      deadline: '',
      energyNeeded: 'Medium',
      nextAction: '',
      notes: '',
      source: '',
      energyEffect: 'Neutral',
      images: [],
    });
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-2xl bg-paper p-3 shadow-sm sm:flex-row sm:items-center">
      <div className="flex gap-1.5">
        {(['Client Work', 'Personal Idea'] as Bucket[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBucket(b)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              bucket === b ? 'bg-lilac-deep text-white' : 'bg-lilac text-ink-soft hover:bg-lilac-deep/30'
            }`}
          >
            {b === 'Client Work' ? '💼 Client' : '💡 Personal'}
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quick add a task or idea…"
        className="flex-1 rounded-xl border border-lilac-deep/30 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-lilac-deep focus:outline-none"
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-full bg-chartreuse-deep px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-chartreuse-deep/90">
          Add
        </button>
        <button
          type="button"
          onClick={onOpenFull}
          className="rounded-full bg-lilac px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-lilac-deep/30"
        >
          Details…
        </button>
      </div>
    </form>
  );
}
