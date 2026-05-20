import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const SW_MIGRATION_KEY = 'codex-sw-migrated-v2';

async function prepareServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  if (!sessionStorage.getItem(SW_MIGRATION_KEY)) {
    sessionStorage.setItem(SW_MIGRATION_KEY, '1');
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key.startsWith('codex-cache-')).map((key) => caches.delete(key))
    );
    await navigator.serviceWorker.register('/sw.js');
    window.location.reload();
    return;
  }

  await navigator.serviceWorker.register('/sw.js');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

void prepareServiceWorker();
