import { useState } from 'react';
import { initializeSessionStart, isSupabaseConfigured } from '../lib/supabase';
import type { CodexAction, SessionMode } from '../types';
import { ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';
import { ParticleField } from './ParticleField';

const CHIPS = [
  { id: 'execute', label: 'Execute now', mode: 'high' as SessionMode, hint: 'High bandwidth' },
  { id: 'research', label: 'Research live', mode: 'high' as SessionMode, hint: 'Synthesize' },
  { id: 'architect', label: 'Architect it', mode: 'high' as SessionMode, hint: 'Structure' },
  { id: 'ship', label: 'Ship it', mode: 'high' as SessionMode, hint: 'Close the loop' },
  { id: 'document', label: 'Document it', mode: 'low' as SessionMode, hint: 'Stabilize' },
  { id: 'status', label: 'Check status', mode: 'low' as SessionMode, hint: 'Orient' },
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

  const selectedChip = CHIPS.find((c) => c.id === chip);

  return (
    <div
      className={`relative flex-1 flex flex-col min-h-0 overflow-hidden ${
        isDarkMode ? 'codex-atmosphere text-[#eef2f7]' : 'codex-atmosphere-light text-slate-900'
      }`}
    >
      {isDarkMode && (
        <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
          <ParticleField particleCount={48} connectionDistance={120} mouseRadius={160} className="w-full h-full" />
        </div>
      )}

      <div className="codex-grain absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-8 md:py-12">
          <header className="mb-8 md:mb-10 shrink-0 codex-fade-up">
            <p
              className={`font-mono text-[0.68rem] tracking-[0.22em] uppercase mb-4 ${
                isDarkMode ? 'text-codex-cyan/80' : 'text-sky-700'
              }`}
            >
              Session intake · Screen 1
            </p>
            <h1
              className={`font-display text-[clamp(2.4rem,6vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.04em] text-balance ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Codex
            </h1>
            <p
              className={`mt-3 max-w-md text-base md:text-lg leading-relaxed ${
                isDarkMode ? 'text-white/55' : 'text-slate-600'
              }`}
            >
              Momentum-first routing for nonlinear minds. Name what needs to move — the system holds the rest.
            </p>
            <div
              className={`mt-5 h-px w-24 codex-shimmer-line rounded-full ${
                isDarkMode ? 'opacity-80' : 'opacity-50'
              }`}
              aria-hidden="true"
            />
          </header>

          <section className="flex-1 flex flex-col gap-6 min-h-0">
            <div className="codex-fade-up-delay-1">
              <label
                htmlFor="codex-task"
                className={`block font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-2.5 ${
                  isDarkMode ? 'text-white/40' : 'text-slate-500'
                }`}
              >
                What needs to move forward?
              </label>
              <textarea
                id="codex-task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="A decision, a ship, a thread that keeps slipping…"
                className={`w-full min-h-[148px] md:min-h-[168px] rounded-2xl border p-4 md:p-5 text-base leading-relaxed resize-none transition-all duration-300 focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus:border-codex-cyan/40 focus:ring-codex-cyan/20 shadow-codex-panel'
                    : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-200 shadow-lg shadow-slate-200/50'
                }`}
              />
            </div>

            <div className="codex-fade-up-delay-2">
              <p
                className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase mb-3 ${
                  isDarkMode ? 'text-white/40' : 'text-slate-500'
                }`}
              >
                Route intent
                {selectedChip && (
                  <span className={isDarkMode ? 'text-codex-cyan/70' : 'text-sky-600'}>
                    {' '}
                    · {selectedChip.hint}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {CHIPS.map((c) => {
                  const active = chip === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChip(active ? null : c.id)}
                      className={`px-3.5 py-2 rounded-full text-sm border transition-all duration-200 ${
                        active
                          ? isDarkMode
                            ? 'bg-codex-cyan/15 border-codex-cyan/45 text-codex-cyan shadow-codex-glow'
                            : 'bg-sky-600 border-sky-600 text-white shadow-md'
                          : isDarkMode
                            ? 'bg-white/[0.03] border-white/10 text-white/65 hover:border-white/25 hover:text-white/90'
                            : 'bg-white/70 border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {routeError && (
              <p className="text-sm text-red-400 codex-fade-up" role="alert">
                {routeError}
              </p>
            )}

            {routedActions && routedActions.length > 0 && (
              <ul
                className={`text-sm space-y-2.5 rounded-2xl border p-4 codex-fade-up ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/10'
                    : 'bg-white/80 border-slate-200'
                }`}
              >
                {routedActions.map((a) => (
                  <li
                    key={a.id}
                    className={`flex items-start gap-2 ${
                      a.is_next_action
                        ? isDarkMode
                          ? 'text-codex-cyan font-medium'
                          : 'text-sky-700 font-medium'
                        : isDarkMode
                          ? 'text-white/50'
                          : 'text-slate-500'
                    }`}
                  >
                    {a.is_next_action ? (
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {a.action_title}
                      {a.is_next_action ? ' · next' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <footer className="mt-8 flex flex-col gap-3 shrink-0 codex-fade-up-delay-3">
            <button
              type="button"
              disabled={!task.trim() || routing}
              onClick={() => void routeTask()}
              className={`group w-full py-4 rounded-2xl font-medium disabled:opacity-30 flex items-center justify-center gap-2.5 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white text-codex-ink hover:bg-codex-cyan hover:shadow-codex-glow'
                  : 'bg-slate-900 text-white hover:bg-sky-700 shadow-lg'
              }`}
            >
              {routing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
              Route Task
            </button>
            <button
              type="button"
              disabled={!task.trim()}
              onClick={fastExecute}
              className={`w-full py-3.5 rounded-2xl border font-medium disabled:opacity-30 flex items-center justify-center gap-2 transition-all duration-200 ${
                isDarkMode
                  ? 'bg-transparent border-white/12 text-white/70 hover:border-codex-amber/40 hover:text-codex-amber'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-800'
              }`}
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Fast Execute Here
            </button>
            <p
              className={`text-center font-mono text-[0.62rem] tracking-[0.14em] uppercase pt-1 ${
                isDarkMode ? 'text-white/25' : 'text-slate-400'
              }`}
            >
              Infrastructure for cognition · not another todo list
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
