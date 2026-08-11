import type { Session, User } from '@supabase/supabase-js';

import { ROUTING_OWNER_EMAIL, isSupabaseConfigured, supabase } from './supabase';

export type AppRole = 'owner' | 'user';

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  role: AppRole;
}

function isMissingRelationError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === 'PGRST205' || /could not find the table/i.test(error.message ?? '');
}

function mapIdentity(user: User, profile?: { display_name?: string | null; role?: string | null } | null): AuthUser {
  const role: AppRole =
    profile?.role === 'user' || profile?.role === 'owner'
      ? profile.role
      : user.email?.toLowerCase() === ROUTING_OWNER_EMAIL.toLowerCase()
        ? 'owner'
        : 'user';

  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      profile?.display_name ??
      (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null) ??
      user.email ??
      null,
    role,
  };
}

/** Current session identity, or null when signed out / Supabase unset. */
export async function getCurrentUserOrNull(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError && !isMissingRelationError(profileError)) {
    throw profileError;
  }

  return mapIdentity(data.user, profile);
}

/** Require an authenticated app user. Throws when missing. */
export async function getCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUserOrNull();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

export async function requireOwner(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (user.role !== 'owner' && user.email?.toLowerCase() !== ROUTING_OWNER_EMAIL.toLowerCase()) {
    throw new Error('Admin access required');
  }
  return user;
}

/**
 * Upsert the signed-in auth identity into `profiles` on first sign-in.
 * Call after a successful session is established (magic-link callback).
 */
export async function storeUser(session?: Session | null): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const activeSession =
    session ??
    (await supabase.auth.getSession()).data.session ??
    null;

  if (!activeSession?.user) {
    throw new Error('Not authenticated');
  }

  const identity = activeSession.user;
  const now = new Date().toISOString();
  const displayName =
    (typeof identity.user_metadata?.full_name === 'string' && identity.user_metadata.full_name) ||
    identity.email ||
    'Owner';
  const role: AppRole =
    identity.email?.toLowerCase() === ROUTING_OWNER_EMAIL.toLowerCase() ? 'owner' : 'user';

  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', identity.id)
    .maybeSingle();

  if (existingError && !isMissingRelationError(existingError)) {
    throw existingError;
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('profiles')
      .update({
        email: identity.email ?? null,
        display_name: displayName,
        updated_at: now,
      })
      .eq('id', identity.id);

    if (error && !isMissingRelationError(error)) throw error;
    return identity.id;
  }

  const { error } = await supabase.from('profiles').insert({
    id: identity.id,
    email: identity.email ?? null,
    display_name: displayName,
    role,
    created_at: now,
    updated_at: now,
  });

  if (error && !isMissingRelationError(error)) throw error;
  return identity.id;
}
