# Cognition Requires Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working version of the cinematic cognition experience inside the existing Vite/React app, including the new narrative deck, mapped atmospheric states, and basic automated coverage for navigation/state behavior.

**Architecture:** Replace the current root experience with a dedicated cognition deck composed of small focused modules: content data, a testable state/navigation layer, a cinematic background renderer, and a deck shell that orchestrates transitions and input. Keep the initial build DOM/CSS/canvas-based so the emotional model is proven before introducing a heavier rendering stack.

**Tech Stack:** Vite, React, TypeScript, Tailwind base styles, custom CSS, canvas animation, Vitest, React Testing Library, jsdom

---

## File structure

**Create**

- `docs/superpowers/plans/2026-05-15-cognition-requires-infrastructure-build.md` — implementation plan
- `src/types/cognition.ts` — slide, section, and state type definitions
- `src/content/cognitionDeck.ts` — deck copy/content data for the 4-act experience
- `src/lib/cognitionState.ts` — pure helpers for section/state lookup, navigation bounds, and progress
- `src/lib/cognitionState.test.ts` — unit tests for pure cognition state helpers
- `src/test/setup.ts` — testing-library matchers and cleanup
- `src/components/cognition/CognitionBackground.tsx` — atmospheric canvas and visual state rendering
- `src/components/cognition/CognitionDeck.tsx` — main deck shell, navigation, and slide composition
- `src/components/cognition/CognitionDeck.test.tsx` — interaction tests for rendering and navigation
- `src/styles/cognition.css` — cinematic experience styles and animations

**Modify**

- `package.json` — add test dependencies and scripts
- `vite.config.ts` — add test configuration for jsdom
- `src/App.tsx` — swap current app shell for the cognition experience entry point
- `src/index.css` — keep Tailwind base/utilities and import any global resets needed for the experience
- `index.html` — update metadata/title/description for the new experience

---

### Task 1: Add test harness and pure cognition-state module

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/types/cognition.ts`
- Create: `src/lib/cognitionState.ts`
- Create: `src/lib/cognitionState.test.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Add test dependencies and scripts**

Update `package.json` to add:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Configure Vite test environment**

Update `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 3: Write the failing unit tests for cognition state helpers**

Create `src/lib/cognitionState.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { clampSlideIndex, getProgressPercent, getStateForSection } from './cognitionState';

describe('cognitionState', () => {
  it('maps sections to visual states', () => {
    expect(getStateForSection('recognition')).toBe('signal');
    expect(getStateForSection('mismatch')).toBe('fragmentation');
    expect(getStateForSection('translation')).toBe('stabilization');
    expect(getStateForSection('invitation')).toBe('proof');
  });

  it('clamps slide indices within deck bounds', () => {
    expect(clampSlideIndex(-1, 16)).toBe(0);
    expect(clampSlideIndex(7, 16)).toBe(7);
    expect(clampSlideIndex(24, 16)).toBe(15);
  });

  it('returns 0 when total is invalid', () => {
    expect(clampSlideIndex(3, 0)).toBe(0);
    expect(clampSlideIndex(3, -4)).toBe(0);
  });

  it('computes progress as a percentage', () => {
    expect(getProgressPercent(0, 16)).toBe(6.25);
    expect(getProgressPercent(7, 16)).toBe(50);
    expect(getProgressPercent(15, 16)).toBe(100);
  });

  it('returns 0 progress when total is invalid', () => {
    expect(getProgressPercent(3, 0)).toBe(0);
    expect(getProgressPercent(3, -4)).toBe(0);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- src/lib/cognitionState.test.ts`

Expected: FAIL with module or export errors because `cognitionState.ts` does not exist yet

- [ ] **Step 5: Write minimal type and helper implementation**

Create `src/types/cognition.ts`:

```ts
export type DeckSection = 'recognition' | 'mismatch' | 'translation' | 'invitation';

export type CognitiveVisualState =
  | 'signal'
  | 'throughput'
  | 'fragmentation'
  | 'stabilization'
  | 'recursion'
  | 'proof';

export interface CognitionSlide {
  id: string;
  section: DeckSection;
  eyebrow: string;
  title: string;
  body: string;
  kicker?: string;
}
```

Create `src/lib/cognitionState.ts`:

```ts
import type { CognitiveVisualState, DeckSection } from '../types/cognition';

const sectionStateMap: Record<DeckSection, CognitiveVisualState> = {
  recognition: 'signal',
  mismatch: 'fragmentation',
  translation: 'stabilization',
  invitation: 'proof',
};

export function getStateForSection(section: DeckSection): CognitiveVisualState {
  return sectionStateMap[section];
}

export function clampSlideIndex(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), total - 1);
}

export function getProgressPercent(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Number((((index + 1) / total) * 100).toFixed(2));
}
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/lib/cognitionState.test.ts`

Expected: PASS with 3 tests passing

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts src/types/cognition.ts src/lib/cognitionState.ts src/lib/cognitionState.test.ts src/test/setup.ts
git commit -m "test: add cognition state harness"
```

---

### Task 2: Build the deck content and interaction shell

**Files:**
- Create: `src/content/cognitionDeck.ts`
- Create: `src/components/cognition/CognitionDeck.tsx`
- Create: `src/components/cognition/CognitionDeck.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing interaction tests**

Create `src/components/cognition/CognitionDeck.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CognitionDeck } from './CognitionDeck';

describe('CognitionDeck', () => {
  it('renders the opening thesis and counter', () => {
    render(<CognitionDeck />);

    expect(screen.getByRole('heading', { name: /cognition requires infrastructure/i })).toBeInTheDocument();
    expect(screen.getByText(/01 \/ 16/i)).toBeInTheDocument();
  });

  it('advances to the next slide from the next button', () => {
    render(<CognitionDeck />);

    fireEvent.click(screen.getByRole('button', { name: /next slide/i }));

    expect(screen.getByRole('heading', { name: /this is not a discipline problem/i })).toBeInTheDocument();
    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
  });

  it('responds to keyboard navigation', () => {
    render(<CognitionDeck />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/cognition/CognitionDeck.test.tsx`

Expected: FAIL because `CognitionDeck` and deck content do not exist yet

- [ ] **Step 3: Create the deck content data**

Create `src/content/cognitionDeck.ts` with 16 slide objects covering the approved 4-act structure:

```ts
import type { CognitionSlide } from '../types/cognition';

export const cognitionSlides: CognitionSlide[] = [
  {
    id: 'cover',
    section: 'recognition',
    eyebrow: 'Act I · Recognition',
    title: 'Cognition Requires Infrastructure',
    body: 'A cinematic systems documentary about nonlinear cognition, creative overload, and the support structures required to turn vision into reality.',
    kicker: 'Some minds do not need more shame. They need better continuity systems.',
  },
  {
    id: 'configuration',
    section: 'recognition',
    eyebrow: 'The Configuration',
    title: 'This is not a discipline problem.',
    body: 'Some minds generate architectures, systems, stories, and abstractions faster than ordinary execution environments can stabilize them.',
  }
  // ...continue through 16 approved slides
];

export const sectionLabels = [
  { id: 'recognition', label: 'Recognition' },
  { id: 'mismatch', label: 'Mismatch' },
  { id: 'translation', label: 'Translation' },
  { id: 'invitation', label: 'Invitation' },
] as const;
```

- [ ] **Step 4: Implement the minimal deck shell**

Create `src/components/cognition/CognitionDeck.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { cognitionSlides, sectionLabels } from '../../content/cognitionDeck';
import { clampSlideIndex, getProgressPercent, getStateForSection } from '../../lib/cognitionState';
import { CognitionBackground } from './CognitionBackground';
import '../../styles/cognition.css';

export function CognitionDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = cognitionSlides[currentIndex];
  const progress = getProgressPercent(currentIndex, cognitionSlides.length);
  const visualState = useMemo(() => getStateForSection(currentSlide.section), [currentSlide.section]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        setCurrentIndex((value) => clampSlideIndex(value + 1, cognitionSlides.length));
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((value) => clampSlideIndex(value - 1, cognitionSlides.length));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="cognition-app">
      <CognitionBackground state={visualState} />
      <div className="cognition-progress" style={{ width: `${progress}%` }} />
      <aside className="cognition-sections">
        {sectionLabels.map((section) => (
          <span
            key={section.id}
            className={section.id === currentSlide.section ? 'is-active' : ''}
          >
            {section.label}
          </span>
        ))}
      </aside>
      <section className="cognition-stage">
        <p className="cognition-eyebrow">{currentSlide.eyebrow}</p>
        <h1>{currentSlide.title}</h1>
        <p className="cognition-body">{currentSlide.body}</p>
        {currentSlide.kicker ? <p className="cognition-kicker">{currentSlide.kicker}</p> : null}
      </section>
      <nav className="cognition-nav" aria-label="Slide navigation">
        <button aria-label="Previous slide" onClick={() => setCurrentIndex((value) => clampSlideIndex(value - 1, cognitionSlides.length))}>Previous</button>
        <span>{String(currentIndex + 1).padStart(2, '0')} / {String(cognitionSlides.length).padStart(2, '0')}</span>
        <button aria-label="Next slide" onClick={() => setCurrentIndex((value) => clampSlideIndex(value + 1, cognitionSlides.length))}>Next</button>
      </nav>
    </main>
  );
}
```

- [ ] **Step 5: Replace the app entry**

Update `src/App.tsx`:

```tsx
import { CognitionDeck } from './components/cognition/CognitionDeck';

function App() {
  return <CognitionDeck />;
}

export default App;
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/components/cognition/CognitionDeck.test.tsx src/lib/cognitionState.test.ts`

Expected: PASS with deck rendering and navigation tests green

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/content/cognitionDeck.ts src/components/cognition/CognitionDeck.tsx src/components/cognition/CognitionDeck.test.tsx
git commit -m "feat: add cognition deck shell"
```

---

### Task 3: Add cinematic background, styling, and document metadata

**Files:**
- Create: `src/components/cognition/CognitionBackground.tsx`
- Create: `src/styles/cognition.css`
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Write the failing test for section-to-state integration**

Extend `src/components/cognition/CognitionDeck.test.tsx` with:

```tsx
it('updates the stage state when the slide section changes', () => {
  render(<CognitionDeck />);

  fireEvent.click(screen.getByRole('button', { name: /next slide/i }));

  expect(screen.getByRole('main')).toHaveAttribute('data-state', 'signal');
});
```

Then add another assertion after advancing into a mismatch slide:

```tsx
fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
fireEvent.click(screen.getByRole('button', { name: /next slide/i }));

expect(screen.getByRole('main')).toHaveAttribute('data-state', 'fragmentation');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/cognition/CognitionDeck.test.tsx`

Expected: FAIL because the deck shell does not yet expose or update `data-state`

- [ ] **Step 3: Implement the background renderer and state hook-up**

Create `src/components/cognition/CognitionBackground.tsx` with a canvas animation that accepts:

```ts
interface CognitionBackgroundProps {
  state: 'signal' | 'throughput' | 'fragmentation' | 'stabilization' | 'recursion' | 'proof';
}
```

Behavior:

- signal: slow drift, sparse connections
- throughput: lateral pressure and a narrowing band
- fragmentation: jitter, noise, asymmetry, warmer colors
- stabilization: orbital coherence around a center
- recursion: layered ring structures
- proof: reduced motion, calmer green/cyan grid feel

Update `CognitionDeck.tsx` so `<main>` exposes `data-state={visualState}` and renders `<CognitionBackground state={visualState} />`.

- [ ] **Step 4: Implement the cinematic styles**

Create `src/styles/cognition.css` with:

- root palette variables for cyan, violet, amber, red, text, border, background
- full-screen stage layout
- premium typography using `Syne`, `DM Sans`, and `DM Mono`
- restrained progress bar and section rail
- slide entrance/exit transitions
- responsive behavior for narrow screens
- state-aware styling using selectors like `[data-state='fragmentation']`

Update `src/index.css` to remain:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
}
```

- [ ] **Step 5: Update document metadata**

Update `index.html`:

```html
<title>Cognition Requires Infrastructure</title>
<meta
  name="description"
  content="A cinematic systems documentary about nonlinear cognition, creative overload, and the architecture required to turn vision into reality."
/>
<meta property="og:title" content="Cognition Requires Infrastructure" />
<meta property="og:description" content="A cinematic systems documentary about nonlinear cognition, creative overload, and the architecture required to turn vision into reality." />
<meta name="twitter:title" content="Cognition Requires Infrastructure" />
<meta name="twitter:description" content="A cinematic systems documentary about nonlinear cognition, creative overload, and the architecture required to turn vision into reality." />
```

- [ ] **Step 6: Run tests and build verification**

Run:

```bash
npm test -- src/components/cognition/CognitionDeck.test.tsx src/lib/cognitionState.test.ts
npm run build
```

Expected:

- tests PASS
- Vite build completes with exit code 0

- [ ] **Step 7: Commit**

```bash
git add index.html src/index.css src/styles/cognition.css src/components/cognition/CognitionBackground.tsx src/components/cognition/CognitionDeck.tsx src/components/cognition/CognitionDeck.test.tsx
git commit -m "feat: add cinematic cognition presentation"
```

---

## Self-review

### Spec coverage

- **Narrative spine:** covered by `src/content/cognitionDeck.ts`
- **Transfer principles:** covered by slide plan/content task
- **Visual and motion philosophy:** covered by `CognitionBackground` and `cognition.css`
- **Repository constraints:** addressed by staying inside Vite/React and deferring heavier rendering stacks
- **Prototype-first scope:** first build proves the deck shell, state model, and atmospheric language without overcommitting to WebGL

### Placeholder scan

No `TODO`, `TBD`, or "implement later" placeholders should remain in the plan. The only intentionally open area is exact final copy inside the 16 slide objects, which must be written from the approved design spec during Task 2.

### Type consistency

- `DeckSection` values match content, helper, and component usage
- `CognitiveVisualState` values match background prop usage
- `data-state` values match helper output and CSS selectors

