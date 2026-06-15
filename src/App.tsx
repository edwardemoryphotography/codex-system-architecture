import { CognitionDeck } from './components/cognition/CognitionDeck';
import { CodexAppShell } from './components/CodexAppShell';

function isCognitionRoute(pathname: string) {
  return pathname === '/cognition' || pathname === '/infrastructure';
}

function App() {
  return isCognitionRoute(window.location.pathname) ? (
    <CognitionDeck />
  ) : (
    <CodexAppShell />
  );
}

export default App;
