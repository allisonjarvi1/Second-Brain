import { useEffect, useState } from 'react';
import type { Task } from '../types';
import {
  BUCKETS,
  ENERGY_EFFECTS,
  ENERGY_LEVELS,
  PRIORITIES,
  STATUSES,
  TASK_TYPES,
} from '../types';

type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  bucket: 'Client Work',
  client: '',
  type: 'Task',
  status: 'Not Started',
  priority: 'Medium',
  deadline: '',
  energyNeeded: 'Medium',
  nextAction: '',
  notes: '',
  source: '',
  energyEffect: 'Neutral',
};

const FIELD = 'w-full rounded-xl border border-lilac-deep/30 bg-paper px-3 py-2 text-sm text-ink focus:border-lilac-deep focus:outline-none';
const LABEL = 'text-xs font-bold tracking-wide text-ink-soft uppercase';

const NEW_CLIENT = '__new__';

export function TaskFormModal({
  task,
  clients,
  onAddClient,
  onSave,
  onDelete,
  onClose,
}: {
  task: Task | null;
  clients: string[];
  onAddClient: (name: string) => void;
  onSave: (draft: TaskDraft) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT);
  const [addingClient, setAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  useEffect(() => {
    if (task) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = task;
      setDraft(rest);
    } else {
      setDraft(EMPTY_DRAFT);
    }
    setAddingClient(false);
    setNewClientName('');
  }, [task]);

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleClientChange(value: string) {
    if (value === NEW_CLIENT) {
      setAddingClient(true);
      setNewClientName('');
    } else {
      update('client', value);
    }
  }

  function confirmNewClient() {
    const trimmed = newClientName.trim();
    if (!trimmed) {
      setAddingClient(false);
      return;
    }
    onAddClient(trimmed);
    update('client', trimmed);
    setAddingClient(false);
    setNewClientName('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onSave(draft);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-xl sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">{task ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={LABEL}>Title</label>
            <input
              className={`${FIELD} mt-1`}
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="What needs doing?"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className={LABEL}>Bucket</label>
              <select className={`${FIELD} mt-1`} value={draft.bucket} onChange={(e) => update('bucket', e.target.value as Task['bucket'])}>
                {BUCKETS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Client</label>
              {addingClient ? (
                <div className="mt-1 flex gap-1">
                  <input
                    className={FIELD}
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        confirmNewClient();
                      }
                    }}
                    placeholder="New client name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={confirmNewClient}
                    className="rounded-xl bg-lilac-deep px-3 text-sm font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select className={`${FIELD} mt-1`} value={draft.client} onChange={(e) => handleClientChange(e.target.value)}>
                  <option value="">No client</option>
                  {(draft.client && !clients.includes(draft.client) ? [draft.client, ...clients] : clients).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value={NEW_CLIENT}>+ Add new client…</option>
                </select>
              )}
            </div>
            <div>
              <label className={LABEL}>Type</label>
              <select className={`${FIELD} mt-1`} value={draft.type} onChange={(e) => update('type', e.target.value as Task['type'])}>
                {TASK_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={LABEL}>Status</label>
              <select className={`${FIELD} mt-1`} value={draft.status} onChange={(e) => update('status', e.target.value as Task['status'])}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Priority</label>
              <select className={`${FIELD} mt-1`} value={draft.priority} onChange={(e) => update('priority', e.target.value as Task['priority'])}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Energy needed</label>
              <select className={`${FIELD} mt-1`} value={draft.energyNeeded} onChange={(e) => update('energyNeeded', e.target.value as Task['energyNeeded'])}>
                {ENERGY_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Deadline</label>
              <input type="date" className={`${FIELD} mt-1`} value={draft.deadline} onChange={(e) => update('deadline', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Next action</label>
            <input className={`${FIELD} mt-1`} value={draft.nextAction} onChange={(e) => update('nextAction', e.target.value)} placeholder="The very next tiny step" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Source</label>
              <input className={`${FIELD} mt-1`} value={draft.source} onChange={(e) => update('source', e.target.value)} placeholder="Where did this come from?" />
            </div>
            <div>
              <label className={LABEL}>Energy effect</label>
              <select className={`${FIELD} mt-1`} value={draft.energyEffect} onChange={(e) => update('energyEffect', e.target.value as Task['energyEffect'])}>
                {ENERGY_EFFECTS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL}>Notes</label>
            <textarea className={`${FIELD} mt-1`} rows={3} value={draft.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything else worth remembering" />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {task && onDelete ? (
              <button type="button" onClick={onDelete} className="text-sm font-semibold text-blush-deep hover:underline">
                Delete task
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-lilac">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-lilac-deep px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lilac-deep/90">
                {task ? 'Save changes' : 'Add task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
