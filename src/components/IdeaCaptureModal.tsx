import { useRef, useState } from 'react';
import type { Task } from '../types';
import { BUCKETS, ENERGY_EFFECTS, ENERGY_LEVELS, PRIORITIES, STATUSES, TASK_TYPES } from '../types';

type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

const FIELD =
  'w-full rounded-xl border border-lilac-deep/30 bg-paper px-3 py-2 text-sm text-ink focus:border-lilac-deep focus:outline-none';
const LABEL = 'text-xs font-bold tracking-wide text-ink-soft uppercase';

const IDEA_DEFAULTS: TaskDraft = {
  title: '',
  bucket: 'Personal Idea',
  client: '',
  type: 'Idea',
  status: 'Parked',
  priority: 'Medium',
  deadline: '',
  energyNeeded: 'Medium',
  nextAction: '',
  notes: '',
  source: 'Idea capture',
  energyEffect: 'Neutral',
  images: [],
};

function isValidBucket(v: unknown): v is Task['bucket'] {
  return BUCKETS.includes(v as Task['bucket']);
}
function isValidType(v: unknown): v is Task['type'] {
  return TASK_TYPES.includes(v as Task['type']);
}
function isValidStatus(v: unknown): v is Task['status'] {
  return STATUSES.includes(v as Task['status']);
}
function isValidPriority(v: unknown): v is Task['priority'] {
  return PRIORITIES.includes(v as Task['priority']);
}
function isValidEnergyLevel(v: unknown): v is Task['energyNeeded'] {
  return ENERGY_LEVELS.includes(v as Task['energyNeeded']);
}
function isValidEnergyEffect(v: unknown): v is Task['energyEffect'] {
  return ENERGY_EFFECTS.includes(v as Task['energyEffect']);
}

function mergeDraft(raw: Record<string, unknown>): TaskDraft {
  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    bucket: isValidBucket(raw.bucket) ? raw.bucket : IDEA_DEFAULTS.bucket,
    client: typeof raw.client === 'string' ? raw.client : '',
    type: isValidType(raw.type) ? raw.type : IDEA_DEFAULTS.type,
    status: isValidStatus(raw.status) ? raw.status : IDEA_DEFAULTS.status,
    priority: isValidPriority(raw.priority) ? raw.priority : IDEA_DEFAULTS.priority,
    deadline: typeof raw.deadline === 'string' ? raw.deadline : '',
    energyNeeded: isValidEnergyLevel(raw.energyNeeded) ? raw.energyNeeded : IDEA_DEFAULTS.energyNeeded,
    nextAction: typeof raw.nextAction === 'string' ? raw.nextAction : '',
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    source: typeof raw.source === 'string' ? raw.source : IDEA_DEFAULTS.source,
    energyEffect: isValidEnergyEffect(raw.energyEffect) ? raw.energyEffect : IDEA_DEFAULTS.energyEffect,
    images: Array.isArray(raw.images) ? (raw.images as string[]).filter((x) => typeof x === 'string') : [],
  };
}

export function IdeaCaptureModal({
  onAdd,
  onClose,
}: {
  onAdd: (draft: TaskDraft) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'dump' | 'json'>('dump');

  // Dump tab state
  const [dumpText, setDumpText] = useState('');
  const [dumpMessage, setDumpMessage] = useState('');

  // JSON tab state
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonMessage, setJsonMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDumpSubmit() {
    const lines = dumpText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    for (const line of lines) {
      onAdd({ ...IDEA_DEFAULTS, title: line });
    }
    setDumpMessage(`${lines.length} idea${lines.length === 1 ? '' : 's'} added to parking lot!`);
    setDumpText('');
    setTimeout(() => {
      onClose();
    }, 1200);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText((ev.target?.result as string) ?? '');
      setJsonError('');
      setJsonMessage('');
    };
    reader.readAsText(file);
    // reset so same file can be re-selected
    e.target.value = '';
  }

  function handleJsonImport() {
    setJsonError('');
    setJsonMessage('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError('Invalid JSON — please check the format and try again.');
      return;
    }
    if (!Array.isArray(parsed)) {
      setJsonError('Expected a JSON array at the top level: [ { "title": "..." }, … ]');
      return;
    }
    let count = 0;
    for (const item of parsed) {
      if (typeof item !== 'object' || item === null) continue;
      const draft = mergeDraft(item as Record<string, unknown>);
      if (!draft.title.trim()) continue;
      onAdd(draft);
      count++;
    }
    if (count === 0) {
      setJsonError('No valid tasks found. Each object needs at least a non-empty "title" field.');
      return;
    }
    setJsonMessage(`${count} task${count === 1 ? '' : 's'} imported!`);
    setJsonText('');
    setTimeout(() => {
      onClose();
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-xl sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">📸 Capture Ideas</h2>
          <button type="button" onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mb-5 flex gap-2 rounded-full bg-paper p-1">
          <button
            type="button"
            onClick={() => setTab('dump')}
            className={`flex-1 rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === 'dump'
                ? 'bg-lilac font-semibold text-lilac-deep'
                : 'font-medium text-ink-soft hover:text-ink'
            }`}
          >
            Dump text
          </button>
          <button
            type="button"
            onClick={() => setTab('json')}
            className={`flex-1 rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === 'json'
                ? 'bg-lilac font-semibold text-lilac-deep'
                : 'font-medium text-ink-soft hover:text-ink'
            }`}
          >
            Import JSON
          </button>
        </div>

        {/* Dump tab */}
        {tab === 'dump' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={LABEL}>Your ideas</label>
              <textarea
                className={`${FIELD} mt-1`}
                rows={8}
                value={dumpText}
                onChange={(e) => {
                  setDumpText(e.target.value);
                  setDumpMessage('');
                }}
                placeholder="One idea per line, or just stream of consciousness…"
                autoFocus
              />
              <p className="mt-1 text-xs text-ink-soft">Each non-empty line becomes a separate task in your parking lot.</p>
            </div>

            {dumpMessage && (
              <p className="rounded-xl bg-chartreuse-deep/20 px-4 py-2 text-sm font-semibold text-ink">
                ✓ {dumpMessage}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-lilac"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDumpSubmit}
                disabled={!dumpText.trim()}
                className="rounded-full bg-chartreuse-deep px-5 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-chartreuse-deep/90 disabled:opacity-40"
              >
                Create tasks
              </button>
            </div>
          </div>
        )}

        {/* JSON tab */}
        {tab === 'json' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={LABEL}>JSON array</label>
              <textarea
                className={`${FIELD} mt-1 font-mono text-xs`}
                rows={10}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError('');
                  setJsonMessage('');
                }}
                placeholder={`[\n  { "title": "My idea", "notes": "Some detail", "bucket": "Personal Idea" },\n  { "title": "Another one" }\n]`}
              />
              <p className="mt-1 text-xs text-ink-soft">
                Paste a JSON array of task objects. Only <code className="rounded bg-paper px-1">title</code> is required — everything else uses sensible defaults.
              </p>
            </div>

            <div>
              <label className={LABEL}>Or load from file</label>
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-lilac-deep/30 bg-paper px-4 py-2 text-sm font-semibold text-ink-soft hover:border-lilac-deep hover:text-ink"
                >
                  Choose .json file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {jsonText && (
                  <span className="text-xs text-ink-soft">{jsonText.length} characters loaded</span>
                )}
              </div>
            </div>

            {jsonError && (
              <p className="rounded-xl border border-blush-deep/30 bg-blush/20 px-4 py-2 text-sm text-blush-deep">
                {jsonError}
              </p>
            )}

            {jsonMessage && (
              <p className="rounded-xl bg-chartreuse-deep/20 px-4 py-2 text-sm font-semibold text-ink">
                ✓ {jsonMessage}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-lilac"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJsonImport}
                disabled={!jsonText.trim()}
                className="rounded-full bg-lilac-deep px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lilac-deep/90 disabled:opacity-40"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
