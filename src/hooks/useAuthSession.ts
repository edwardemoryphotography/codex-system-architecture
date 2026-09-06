import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { storeUser } from '../lib/auth';
import { isSupabaseConfigured, onAuthStateChange, getSession } from '../lib/supabase';
import { useToast } from './useToast';

/**
 * Subscribe to Supabase auth session and upsert `profiles` on sign-in.
 */
export function useAuthSession() {
  const { error: toastError } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    getSession()
      .then(async (next) => {
        if (cancelled) return;
        setSession(next);
        if (next) {
          try {
            await storeUser(next);
          } catch {
            if (!cancelled) {
              toastError('Could not save profile', 'Signed in, but profile sync failed.');
            }
          }
        }
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const subscription = onAuthStateChange((nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        storeUser(nextSession).catch(() => {
          toastError('Could not save profile', 'Signed in, but profile sync failed.');
        });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [toastError]);

  return { session, ready, isAuthenticated: Boolean(session) };
}
