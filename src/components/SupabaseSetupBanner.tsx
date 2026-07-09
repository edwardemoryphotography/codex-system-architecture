interface SupabaseSetupBannerProps {
  isDarkMode: boolean;
}

export function SupabaseSetupBanner({ isDarkMode }: SupabaseSetupBannerProps) {
  return (
    <div
      role="alert"
      className={`shrink-0 px-4 py-3 text-sm border-b ${
        isDarkMode
          ? 'bg-amber-950/80 border-amber-800 text-amber-100'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}
    >
      <p className="font-medium">Documents database not connected</p>
      <p className={`mt-1 ${isDarkMode ? 'text-amber-200/90' : 'text-amber-900/80'}`}>
        Add <code className="font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
        <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> (or{' '}
        <code className="font-mono text-xs">VITE_SUPABASE_PUBLISHABLE_KEY</code>) in Vercel →
        Settings → Environment Variables, then redeploy. Control Panel still works below.
      </p>
    </div>
  );
}
