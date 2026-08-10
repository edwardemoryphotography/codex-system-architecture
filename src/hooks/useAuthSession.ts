import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { storeUser } from '../lib/auth';
import { isSupabaseConfigured, onAuthStateChange, getSession } from '../lib/supabase';

/**
 * Subscribe to Supabase auth session and upsert `profiles` on sign-in.
 */
export function useAuthSession() {
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
          } catch (error) {
            console.error('Failed to store user profile:', error);
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
        storeUser(nextSession).catch((error) => {
          console.error('Failed to store user profile:', error);
        });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { session, ready, isAuthenticated: Boolean(session) };
}
