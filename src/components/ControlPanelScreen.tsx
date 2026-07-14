import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react';

import { initializeSessionStart, isSupabaseConfigured } from '../lib/supabase';
import type { CodexAction, SessionMode } from '../types';

const CHIPS = [
  { id: 'execute', label: 'Execute now', mode: 'high' as SessionMode, hint: 'High energy' },
  { id: 'research', label: 'Research live', mode: 'high' as SessionMode, hint: 'High energy' },
  { id: 'architect', label: 'Architect it', mode: 'high' as SessionMode, hint: 'High energy' },
  { id: 'ship', label: 'Ship it', mode: 'high' as SessionMode, hint: 'High energy' },
  { id: 'document', label: 'Document it', mode: 'low' as SessionMode, hint: 'Low energy' },
  { id: 'status', label: 'Check status', mode: 'low' as SessionMode, hint: 'Low energy' },
] as const;

const LAUNCH_PADS = [
  {
    path: '/codex/personal_os',
    label: 'Personal OS',
    blurb: 'Mind, energy, operating patterns',
    accent: 'from-teal-500/20 to-cyan-500/5',
  },
  {
    path: '/codex/artistic_systems',
    label: 'Artistic Systems',
    blurb: 'Photography ops + creative AI',
    accent: 'from-rose-500/20 to-orange-500/5',
  },
  {
    path: '/codex/neuro',
    label: 'Neuro',
    blurb: 'EEG, WHOOP, adaptive models',
    accent: 'from-violet-500/20 to-blue-500/5',
  },
  {
    path: '/codex/council',
    label: 'Council',
    blurb: 'Roles, protocols, reasoning',
    accent: 'from-amber-500/20 to-yellow-500/5',
  },
] as const;

function sessionModeForChip(chipId: string | null): SessionMode {
  const chip = CHIPS.find((c) => c.id === chipId);
  return chip?.mode ?? 'high';
}

interface ControlPanelScreenProps {
  isDarkMode?: boolean;
  onSelectDocument?: (path: string) => void;
  onOpenGraph?: () => void;
}

export function ControlPanelScreen({
  isDarkMode = true,
  onSelectDocument,
  onOpenGraph,
}: ControlPanelScreenProps) {
  const [task, setTask] = useState('');
  const [chip, setChip] = useState<string | null>(null);
  const [routing, setRouting] = useState(false);
  const [routedActions, setRoutedActions] = useState<CodexAction[] | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [executedFlash, setExecutedFlash] = useState<string | null>(null);
  const [sessionNote, setSessionNote] = useState<string | null>(null);

  const shell = isDarkMode
    ? 'bg-neutral-950 text-neutral-100'
    : 'bg-neutral-50 text-neutral-900';

  const panel = isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200';
  const muted = isDarkMode ? 'text-neutral-400' : 'text-neutral-500';
  const chipIdle = isDarkMode
    ? 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/80'
    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50';
  const chipActive = isDarkMode
    ? 'bg-neutral-100 text-neutral-900 border-neutral-100 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
    : 'bg-neutral-900 text-white border-neutral-900';
  const secondaryBtn = isDarkMode
    ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50';

  const selectedChip = useMemo(
    () => CHIPS.find((item) => item.id === chip) ?? null,
    [chip],
  );

  const readiness = task.trim().length === 0 ? 0 : Math.min(100, Math.round((task.trim().length / 80) * 100));

  const routeTask = async () => {
    if (!task.trim()) return;
    setRouteError(null);
    setExecutedFlash(null);
    setSessionNote(null);

    if (!isSupabaseConfigured) {
      setRoutedActions(null);
      setSessionNote(
        `Routed as ${chip ?? 'auto'} in offline mode. Add VITE_SUPABASE_* to load live actions.`,
      );
      return;
    }

    setRouting(true);
    try {
      const mode = sessionModeForChip(chip);
      const actions = await initializeSessionStart(mode);
      setRoutedActions(actions);
      const next = actions.find((a) => a.is_next_action) ?? actions[0];
      setSessionNote(
        next
          ? `Session primed on ${mode} mode. Next focus: ${next.action_title}`
          : `Session primed on ${mode} mode.`,
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
    setExecutedFlash(task.trim());
    setSessionNote('Fast execute locked locally. Keep moving.');
  };

  return (
    <div className={`relative flex-1 flex flex-col min-h-0 overflow-hidden ${shell}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          isDarkMode
            ? 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.08),transparent_40%)]'
            : 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]'
        }`}
      />

      <div className="relative flex-1 flex flex-col max-w-2xl mx-auto w-full min-h-0">
        <div className="flex-1 overflow-y-auto px-4 pt-4 md:px-5 md:pt-8">
          <header className="mb-5 md:mb-7 shrink-0 codex-enter">
            <div className="hidden md:block">
              <p className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] ${muted}`}>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Session console
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Codex Control Panel</h1>
              <p className={`text-sm mt-2 leading-relaxed ${muted}`}>
                Capture momentum, choose a route, then jump into the territory that holds the work.
              </p>
            </div>
            <div className="md:hidden">
              <p className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] ${muted}`}>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Momentum-first
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">What needs to move?</h1>
              <p className={`text-sm mt-1.5 leading-relaxed ${muted}`}>
                Capture the next move, pick a route, then ship it.
              </p>
            </div>
          </header>

          <section className="flex flex-col gap-5 md:gap-6 pb-4">
            <div className={`codex-enter-delayed rounded-2xl border p-3 ${panel}`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className={`text-xs uppercase tracking-[0.14em] ${muted}`}>Launch pads</p>
                {onOpenGraph && (
                  <button
                    type="button"
                    onClick={onOpenGraph}
                    className={`codex-press codex-focus-ring inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border ${
                      isDarkMode
                        ? 'border-white/10 text-neutral-300 hover:bg-white/5'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Open graph
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LAUNCH_PADS.map((pad) => (
                  <button
                    key={pad.path}
                    type="button"
                    onClick={() => onSelectDocument?.(pad.path)}
                    className={`codex-press codex-focus-ring text-left rounded-2xl border p-3.5 bg-gradient-to-br ${pad.accent} ${
                      isDarkMode
                        ? 'border-white/10 hover:border-white/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{pad.label}</p>
                        <p className={`text-xs mt-1 ${muted}`}>{pad.blurb}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 mt-0.5 ${muted}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`relative rounded-2xl border overflow-hidden ${panel}`}>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What needs to move forward?"
                className={`w-full min-h-[132px] md:min-h-[150px] bg-transparent p-4 text-base resize-none focus:outline-none ${
                  isDarkMode ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400'
                }`}
              />
              <div
                className={`flex items-center justify-between gap-3 px-4 py-2.5 border-t text-xs ${
                  isDarkMode ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400'
                }`}
              >
                <span>{selectedChip ? `${selectedChip.label} · ${selectedChip.hint}` : 'Auto route'}</span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-1.5 w-16 rounded-full overflow-hidden"
                    style={{ background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                  >
                    <span
                      className="block h-full rounded-full bg-sky-400 transition-all duration-300"
                      style={{ width: `${readiness}%` }}
                    />
                  </span>
                  {task.trim().length} chars
                </span>
              </div>
            </div>

            <div>
              <p className={`mb-2.5 text-xs uppercase tracking-[0.14em] ${muted}`}>Route</p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {CHIPS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChip(chip === c.id ? null : c.id)}
                    className={`codex-press codex-focus-ring px-3 py-2.5 sm:py-2 rounded-2xl sm:rounded-full text-sm border text-left sm:text-center ${
                      chip === c.id ? chipActive : chipIdle
                    }`}
                  >
                    <span className="block">{c.label}</span>
                    <span
                      className={`block text-[10px] mt-0.5 uppercase tracking-[0.12em] ${
                        chip === c.id
                          ? isDarkMode
                            ? 'text-neutral-600'
                            : 'text-neutral-300'
                          : muted
                      }`}
                    >
                      {c.mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {routeError && (
              <p className="text-sm text-red-400 codex-enter" role="alert">
                {routeError}
              </p>
            )}

            {sessionNote && (
              <div
                className={`codex-enter rounded-2xl border px-3.5 py-3 text-sm flex items-start gap-2.5 ${
                  isDarkMode
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{sessionNote}</p>
              </div>
            )}

            {executedFlash && (
              <div className={`codex-enter rounded-2xl border p-3.5 ${panel}`}>
                <p className={`text-xs uppercase tracking-[0.14em] mb-2 ${muted}`}>Executing now</p>
                <p className="text-sm leading-relaxed">{executedFlash}</p>
              </div>
            )}

            {routedActions && routedActions.length > 0 && (
              <div className={`codex-enter rounded-2xl border overflow-hidden ${panel}`}>
                <div className={`px-3.5 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  <p className="text-sm font-medium">Session queue</p>
                  <span className={`text-xs ${muted}`}>{routedActions.length} actions</span>
                </div>
                <ul className="divide-y divide-neutral-800/80">
                  {routedActions.map((action, index) => (
                    <li
                      key={action.id}
                      className={`px-3.5 py-3 flex items-start gap-3 ${
                        action.is_next_action
                          ? isDarkMode
                            ? 'bg-white/5'
                            : 'bg-neutral-50'
                          : ''
                      }`}
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          action.is_next_action
                            ? 'bg-sky-400 text-slate-950'
                            : isDarkMode
                              ? 'bg-neutral-800 text-neutral-400'
                              : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={action.is_next_action ? 'font-medium' : muted}>
                          {action.action_title}
                        </p>
                        {action.is_next_action && (
                          <p className="text-xs mt-1 text-sky-300">Next action</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <footer
          className={`shrink-0 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-5 md:pb-6 border-t backdrop-blur-xl ${
            isDarkMode ? 'border-neutral-800/80 bg-neutral-950/90' : 'border-neutral-200/80 bg-neutral-50/90'
          }`}
        >
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={!task.trim() || routing}
              onClick={() => void routeTask()}
              className="codex-press codex-focus-ring w-full py-3.5 md:py-4 rounded-2xl bg-white text-neutral-900 font-medium disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {routing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Route Task
            </button>
            <button
              type="button"
              disabled={!task.trim()}
              onClick={fastExecute}
              className={`codex-press codex-focus-ring w-full py-3 rounded-2xl border font-medium disabled:opacity-30 ${secondaryBtn}`}
            >
              Fast Execute Here
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
