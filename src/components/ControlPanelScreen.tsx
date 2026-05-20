import { useState } from 'react';

const CHIPS = [
  { id: 'execute', label: 'Execute now' },
  { id: 'research', label: 'Research live' },
  { id: 'architect', label: 'Architect it' },
  { id: 'ship', label: 'Ship it' },
  { id: 'document', label: 'Document it' },
  { id: 'status', label: 'Check status' },
] as const;

interface ControlPanelScreenProps {
  isDarkMode?: boolean;
}

export function ControlPanelScreen({ isDarkMode = true }: ControlPanelScreenProps) {
  const [task, setTask] = useState('');
  const [chip, setChip] = useState<string | null>(null);

  const shell = isDarkMode
    ? 'bg-neutral-950 text-neutral-100'
    : 'bg-neutral-50 text-neutral-900';

  const panel = isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const muted = isDarkMode ? 'text-neutral-400' : 'text-neutral-500';
  const chipIdle = isDarkMode
    ? 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600'
    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400';
  const chipActive = isDarkMode
    ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
    : 'bg-neutral-900 text-white border-neutral-900';
  const secondaryBtn = isDarkMode
    ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
    : 'bg-white border-neutral-200 text-neutral-700';

  const routeTask = () => {
    if (!task.trim()) return;
    window.alert(`Routed: ${chip ?? 'auto'}\n\n${task}`);
  };

  const fastExecute = () => {
    if (!task.trim()) return;
    window.alert(`Executing here:\n\n${task}`);
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${shell}`}>
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-5 py-8 min-h-0">
        <header className="mb-8 shrink-0">
          <h1 className="text-2xl font-semibold tracking-tight">Codex Control Panel</h1>
          <p className={`text-sm mt-1 ${muted}`}>Momentum-first routing</p>
        </header>

        <section className="flex-1 flex flex-col gap-6 min-h-0">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to move forward?"
            className={`w-full min-h-[160px] rounded-2xl border p-4 text-base resize-none focus:outline-none focus:border-neutral-600 ${panel} ${isDarkMode ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400'}`}
          />

          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChip(chip === c.id ? null : c.id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  chip === c.id ? chipActive : chipIdle
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-3 shrink-0 pb-4">
          <button
            type="button"
            disabled={!task.trim()}
            onClick={routeTask}
            className="w-full py-4 rounded-2xl bg-white text-neutral-900 font-medium disabled:opacity-30"
          >
            Route Task
          </button>
          <button
            type="button"
            disabled={!task.trim()}
            onClick={fastExecute}
            className={`w-full py-3 rounded-2xl border font-medium disabled:opacity-30 ${secondaryBtn}`}
          >
            Fast Execute Here
          </button>
        </footer>
      </div>
    </div>
  );
}