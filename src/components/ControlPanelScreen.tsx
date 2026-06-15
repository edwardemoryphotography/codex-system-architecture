import { useState } from 'react';
import { initializeSessionStart, isSupabaseConfigured } from '../lib/supabase';
import type { CodexAction, SessionMode } from '../types';
import { Loader2 } from 'lucide-react';

const CHIPS = [
  { id: 'execute', label: 'Execute now', mode: 'high' as SessionMode },
  { id: 'research', label: 'Research live', mode: 'high' as SessionMode },
  { id: 'architect', label: 'Architect it', mode: 'high' as SessionMode },
  { id: 'ship', label: 'Ship it', mode: 'high' as SessionMode },
  { id: 'document', label: 'Document it', mode: 'low' as SessionMode },
  { id: 'status', label: 'Check status', mode: 'low' as SessionMode },
] as const;

function sessionModeForChip(chipId: string | null): SessionMode {
  const chip = CHIPS.find((c) => c.id === chipId);
  return chip?.mode ?? 'high';
}

interface ControlPanelScreenProps {
  isDarkMode?: boolean;
}

export function ControlPanelScreen({ isDarkMode = true }: ControlPanelScreenProps) {
  const [task, setTask] = useState('');
  const [chip, setChip] = useState<string | null>(null);
  const [routing, setRouting] = useState(false);
  const [routedActions, setRoutedActions] = useState<CodexAction[] | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

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

  const routeTask = async () => {
    if (!task.trim()) return;
    setRouteError(null);

    if (!isSupabaseConfigured) {
      window.alert(
        `Routed (${chip ?? 'auto'}) — Supabase not configured.\n\n${task}\n\nAdd VITE_SUPABASE_* on Vercel to load actions from the database.`
      );
      return;
    }

    setRouting(true);
    try {
      const mode = sessionModeForChip(chip);
      const actions = await initializeSessionStart(mode);
      setRoutedActions(actions);

      const next = actions.find((a) => a.is_next_action) ?? actions[0];
      const lines = actions.length
        ? actions.map((a) => `• ${a.action_title}${a.is_next_action ? ' ← next' : ''}`).join('\n')
        : '(no TODO actions — run migrations / seed on supabase-indigo-paddle)';

      window.alert(
        `Routed: ${chip ?? 'auto'} (${mode})\n\nYour task:\n${task}\n\nSession actions:\n${lines}${
          next ? `\n\nFocus: ${next.action_title}` : ''
        }`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to route task';
      setRouteError(message);
    } finally {
      setRouting(false);
    }
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

          {routeError && (
            <p className="text-sm text-red-400" role="alert">{routeError}</p>
          )}

          {routedActions && routedActions.length > 0 && (
            <ul className={`text-sm space-y-2 rounded-xl border p-3 ${panel}`}>
              {routedActions.map((a) => (
                <li key={a.id} className={a.is_next_action ? 'font-medium' : muted}>
                  {a.action_title}
                  {a.is_next_action ? ' · next' : ''}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-6 flex flex-col gap-3 shrink-0 pb-4">
          <button
            type="button"
            disabled={!task.trim() || routing}
            onClick={() => void routeTask()}
            className="w-full py-4 rounded-2xl bg-white text-neutral-900 font-medium disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {routing && <Loader2 className="w-4 h-4 animate-spin" />}
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
