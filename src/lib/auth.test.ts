import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  getSession: vi.fn(),
  from: vi.fn(),
}));

vi.mock('./supabase', () => ({
  ROUTING_OWNER_EMAIL: 'freddyv@duck.com',
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getUser: mocks.getUser,
      getSession: mocks.getSession,
    },
    from: mocks.from,
  },
}));

import { getCurrentUser, getCurrentUserOrNull, requireOwner, storeUser } from './auth';

function mockProfileQuery(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  mocks.from.mockReturnValue({ select, insert: vi.fn(), update: vi.fn() });
  return { select, eq, maybeSingle };
}

describe('auth helpers', () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.getSession.mockReset();
    mocks.from.mockReset();
  });

  it('returns null when there is no authenticated user', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(getCurrentUserOrNull()).resolves.toBeNull();
  });

  it('maps the auth user and marks the routing owner role', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'freddyv@duck.com',
          user_metadata: { full_name: 'Eddie' },
        },
      },
      error: null,
    });
    mockProfileQuery({ data: null, error: { code: 'PGRST205', message: 'could not find the table' } });

    await expect(getCurrentUser()).resolves.toEqual({
      id: 'user-1',
      email: 'freddyv@duck.com',
      displayName: 'Eddie',
      role: 'owner',
    });
  });

  it('requireOwner rejects non-owner identities', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-2',
          email: 'visitor@example.com',
          user_metadata: {},
        },
      },
      error: null,
    });
    mockProfileQuery({ data: { display_name: 'Visitor', role: 'user' }, error: null });

    await expect(requireOwner()).rejects.toThrow(/admin access required/i);
  });

  it('storeUser inserts a profile on first sign-in', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    mocks.from.mockReturnValue({ select, insert, update: vi.fn() });

    await expect(
      storeUser({
        user: {
          id: 'user-1',
          email: 'freddyv@duck.com',
          user_metadata: { full_name: 'Eddie' },
        },
      } as never),
    ).resolves.toBe('user-1');

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        email: 'freddyv@duck.com',
        display_name: 'Eddie',
        role: 'owner',
      }),
    );
  });
});
