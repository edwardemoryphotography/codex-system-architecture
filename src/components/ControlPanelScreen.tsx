import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  getSession,
  getWorkspaces,
  isSupabaseConfigured,
  onAuthStateChange,
  persistRouteOwner,
  ROUTING_OWNER_EMAIL,
  signInOwnerWithMagicLink,
} from '../lib/supabase';
import { storeUser } from '../lib/auth';
import type { ExecutionLane, EvidenceKind, RouteProposal, RoutedRequestRecord, Workspace } from '../types';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from './Toast';

const CHIPS: Array<{
  id: string;
  label: string;
  lane: ExecutionLane;
  evidenceKind: EvidenceKind;
}> = [
  { id: 'execute', label: 'Execute now', lane: 'execution', evidenceKind: 'merged_pr' },
  { id: 'research', label: 'Research live', lane: 'research', evidenceKind: 'custom' },
  { id: 'architect', label: 'Architect it', lane: 'architecture', evidenceKind: 'custom' },
  { id: 'ship', label: 'Ship it', lane: 'deployment', evidenceKind: 'live_deployment' },
  { id: 'document', label: 'Document it', lane: 'documentation', evidenceKind: 'published_artifact' },
  { id: 'status', label: 'Check status', lane: 'system_state', evidenceKind: 'confirmed_action' },
];

interface ControlPanelScreenProps {
  isDarkMode?: boolean;
}

export function ControlPanelScreen({ isDarkMode = true }: ControlPanelScreenProps) {
  const toast = useToast();
  const [task, setTask] = useState('');
  const [chip, setChip] = useState<string | null>(null);
  const [repository, setRepository] = useState('');
  const [requiredEvidence, setRequiredEvidence] = useState('');
  const [routing, setRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [lastRoute, setLastRoute] = useState<RoutedRequestRecord | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Holds the idempotency key for the in-progress draft, keyed to a
  // fingerprint of the fields that define it. A retry after an ambiguous
  // failure (lost response, network error) reuses the same key so the
  // server replays the original write instead of creating a duplicate.
  // The key only rotates once the draft materially changes or the route
  // succeeds.
  const draftIdempotency = useRef<{ key: string; fingerprint: string } | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getSession()
      .then(async (next) => {
        setSession(next);
        if (next) {
          try {
            await storeUser(next);
          } catch (error) {
            console.error('Failed to store user profile:', error);
          }
        }
      })
      .catch(() => setSession(null));
    getWorkspaces()
      .then((rows) => setWorkspace(rows[0] ?? null))
      .catch(() => setWorkspace(null));

    const subscription = onAuthStateChange((nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setMagicLinkSent(false);
        storeUser(nextSession).catch((error) => {
          console.error('Failed to store user profile:', error);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const shell = isDarkMode
    ? 'bg-neutral-950 text-neutral-100'
    : 'bg-neutral-50 text-neutral-900';

  const panel = isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const muted = isDarkMode ? 'text-neutral-400' : 'text-neutral-500';
  const chipIdle = isDarkMode
    ? 'bg-neutral-900/80 text-neutral-300 border-neutral-800 active:border-neutral-500'
    : 'bg-white text-neutral-600 border-neutral-200 active:border-neutral-400';
  const chipActive = isDarkMode
    ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
    : 'bg-neutral-900 text-white border-neutral-900';
  const secondaryBtn = isDarkMode
    ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
    : 'bg-white border-neutral-200 text-neutral-700';
  const inputCls = `w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-600 ${panel} ${
    isDarkMode ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400'
  }`;

  const selectedChip = CHIPS.find((c) => c.id === chip) ?? null;

  const handleSendMagicLink = async () => {
    setSendingMagicLink(true);
    try {
      await signInOwnerWithMagicLink();
      setMagicLinkSent(true);
      toast.success('Magic link sent', `Check ${ROUTING_OWNER_EMAIL} to finish signing in.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send magic link';
      toast.error('Sign-in failed', message);
    } finally {
      setSendingMagicLink(false);
    }
  };

  const routeTask = async () => {
    if (!task.trim() || !selectedChip) return;
    setRouteError(null);

    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured', 'Add VITE_SUPABASE_* on Vercel to enable routing.');
      return;
    }
    if (!session) {
      toast.info('Sign in required', `Send a magic link to ${ROUTING_OWNER_EMAIL} below, then try again.`);
      return;
    }
    if (!repository.trim() || !requiredEvidence.trim()) {
      toast.error('Missing details', 'Fill in the repository and what will prove this is done.');
      return;
    }
    if (!workspace) {
      toast.error('No workspace found', 'The Foundry workspace registry is empty — nothing to route into.');
      return;
    }

    setRouting(true);
    try {
      const fingerprint = JSON.stringify([
        workspace.id,
        task.trim(),
        selectedChip.id,
        repository.trim(),
        requiredEvidence.trim(),
      ]);
      if (!draftIdempotency.current || draftIdempotency.current.fingerprint !== fingerprint) {
        draftIdempotency.current = { key: crypto.randomUUID(), fingerprint };
      }

      const proposal: RouteProposal = {
        workspace_id: workspace.id,
        idempotency_key: draftIdempotency.current.key,
        intent: task.trim(),
        task_type: selectedChip.id,
        execution_lane: selectedChip.lane,
        selected_agent: 'unassigned',
        repository: repository.trim(),
        risk: 'medium',
        sensitivity: 'internal',
        required_evidence: requiredEvidence.trim(),
        rationale: `Routed via Codex Control Panel — owner selected "${selectedChip.label}" manually; no automated agent scoring yet.`,
        confidence: 100,
        route_source: 'user',
        evidence_kind: selectedChip.evidenceKind,
      };

      const result = await persistRouteOwner(proposal);
      setLastRoute(result.routedRequest);
      toast.success(
        result.replayed ? 'Already routed' : 'Routed',
        `${selectedChip.label} → ${proposal.repository} (${result.routedRequest.status})`,
      );
      draftIdempotency.current = null;
      setTask('');
      setChip(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to route task';
      setRouteError(message);
      toast.error('Route failed', message);
    } finally {
      setRouting(false);
    }
  };

  const fastExecute = () => {
    if (!task.trim()) return;
    toast.info('Executing here', `${task}\n\nThis is a local reminder only — it does not persist anywhere yet.`);
  };

  const canRoute = Boolean(task.trim() && selectedChip && repository.trim() && requiredEvidence.trim() && !routing);

  return (
    <div className={`relative flex-1 flex flex-col min-h-0 overflow-hidden ${shell}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          isDarkMode
            ? 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_55%)]'
            : 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]'
        }`}
      />

      <div className="relative flex-1 flex flex-col max-w-xl mx-auto w-full min-h-0">
        <div className="flex-1 overflow-y-auto px-4 pt-4 md:px-5 md:pt-8">
          <header className="mb-5 md:mb-8 shrink-0">
            <div className="hidden md:block">
              <h1 className="text-2xl font-semibold tracking-tight">Codex Control Panel</h1>
              <p className={`text-sm mt-1 ${muted}`}>Momentum-first routing</p>
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
            {isSupabaseConfigured && !session && (
              <div className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 ${panel}`}>
                <p className="text-sm">Sign in as owner to route tasks and save personal bookmarks/notes.</p>
                <button
                  type="button"
                  onClick={() => void handleSendMagicLink()}
                  disabled={sendingMagicLink || magicLinkSent}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border disabled:opacity-50 ${secondaryBtn}`}
                >
                  {magicLinkSent ? 'Link sent' : sendingMagicLink ? 'Sending…' : 'Sign in'}
                </button>
              </div>
            )}

            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What needs to move forward?"
              className={`w-full min-h-[132px] md:min-h-[160px] rounded-2xl border p-4 text-base resize-none focus:outline-none focus:border-neutral-600 ${panel} ${isDarkMode ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400'}`}
            />

            <div>
              <p className={`mb-2.5 text-xs uppercase tracking-[0.14em] ${muted}`}>Route</p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {CHIPS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChip(chip === c.id ? null : c.id)}
                    className={`px-3 py-2.5 sm:py-1.5 rounded-2xl sm:rounded-full text-sm border transition text-left sm:text-center ${
                      chip === c.id ? chipActive : chipIdle
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block mb-1.5 text-xs uppercase tracking-[0.14em] ${muted}`}>Repository</label>
                <input
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="e.g. codex-system-architecture"
                  className={inputCls}
                  list="control-panel-repos"
                />
                <datalist id="control-panel-repos">
                  <option value="codex-system-architecture" />
                  <option value="legacy-codex" />
                  <option value="managed-agents-memory" />
                </datalist>
              </div>
              <div>
                <label className={`block mb-1.5 text-xs uppercase tracking-[0.14em] ${muted}`}>
                  What proves it&apos;s done?
                </label>
                <input
                  value={requiredEvidence}
                  onChange={(e) => setRequiredEvidence(e.target.value)}
                  placeholder="PR link, deployed URL…"
                  className={inputCls}
                />
              </div>
            </div>

            <p className={`text-xs ${muted}`}>
              Recorded as medium risk, internal sensitivity, owner-routed — no automated risk
              scoring or agent assignment yet.
            </p>

            {routeError && (
              <p className="text-sm text-red-400" role="alert">{routeError}</p>
            )}

            {lastRoute && (
              <div className={`text-sm rounded-xl border p-3 ${panel}`}>
                <p className="font-medium">Last routed</p>
                <p className={muted}>
                  {lastRoute.execution_lane} → {lastRoute.repository} · {lastRoute.status}
                </p>
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
              disabled={!canRoute}
              onClick={() => void routeTask()}
              className="w-full py-3.5 md:py-4 rounded-2xl bg-white text-neutral-900 font-medium disabled:opacity-30 flex items-center justify-center gap-2"
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
          </div>
        </footer>
      </div>
    </div>
  );
}
