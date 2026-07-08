import { useEffect } from 'react';
import { CognitionDeck } from './components/cognition/CognitionDeck';
import { CodexAppShell } from './components/CodexAppShell';

function isCognitionRoute(pathname: string) {
  return pathname === '/cognition' || pathname === '/infrastructure';
}

function App() {
  const cognition = isCognitionRoute(window.location.pathname);

  useEffect(() => {
    document.title = cognition
      ? 'Cognition Requires Infrastructure'
      : 'Codex — Knowledge System';
  }, [cognition]);

  return cognition ? <CognitionDeck /> : <CodexAppShell />;
}

export default App;
