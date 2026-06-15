import { useEffect, useMemo, useRef, useState } from 'react';

import {
  cognitionSlides,
  sectionRail,
} from '../../content/cognitionDeck';
import {
  clampSlideIndex,
  getProgressPercent,
  getVisualStateForSlide,
} from '../../lib/cognitionState';
import type { CognitionSlide } from '../../types/cognition';
import '../../styles/cognition.css';
import { CognitionBackground } from './CognitionBackground';

const SLIDE_TRANSITION_MS = 420;

interface RenderedSlide {
  slide: CognitionSlide;
  phase: 'current' | 'enter' | 'exit';
}

function formatSlideNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return Boolean(
    target.closest(
      'button, input, select, textarea, summary, a[href], [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"]',
    ),
  );
}

export function CognitionDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [renderedSlides, setRenderedSlides] = useState<RenderedSlide[]>([
    { slide: cognitionSlides[0], phase: 'current' },
  ]);
  const totalSlides = cognitionSlides.length;
  const previousIndexRef = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);

  const currentSlide = cognitionSlides[currentIndex];
  const progress = getProgressPercent(currentIndex, totalSlides);
  const visualState = getVisualStateForSlide(currentSlide);

  const counterText = useMemo(() => {
    return `${formatSlideNumber(currentIndex)} / ${formatSlideNumber(totalSlides - 1)}`;
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (
        event.key === 'ArrowRight' ||
        event.key === ' ' ||
        event.code === 'Space' ||
        event.key === 'Spacebar'
      ) {
        event.preventDefault();
        setCurrentIndex((index) => clampSlideIndex(index + 1, totalSlides));
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentIndex((index) => clampSlideIndex(index - 1, totalSlides));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalSlides]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previousIndexRef.current === currentIndex) {
      return;
    }

    previousIndexRef.current = currentIndex;

    const nextSlide = cognitionSlides[currentIndex];

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setRenderedSlides((slides) => {
      const activeSlide = slides[slides.length - 1]?.slide ?? nextSlide;

      if (activeSlide.id === nextSlide.id) {
        return [{ slide: nextSlide, phase: 'current' }];
      }

      return [
        { slide: activeSlide, phase: 'exit' },
        { slide: nextSlide, phase: 'enter' },
      ];
    });

    transitionTimeoutRef.current = window.setTimeout(() => {
      setRenderedSlides([{ slide: nextSlide, phase: 'current' }]);
      transitionTimeoutRef.current = null;
    }, SLIDE_TRANSITION_MS);
  }, [currentIndex]);

  return (
    <main
      className="cognition-deck"
      aria-label="Cognition deck"
      data-state={visualState}
    >
      <CognitionBackground state={visualState} />

      <div className="cognition-deck__chrome">
        <div className="cognition-deck__chrome-top">
          <a className="cognition-deck__codex-link" href="/">
            Back to Codex
          </a>
        </div>

        <div
          className="cognition-deck__progress"
          aria-label="Deck progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          role="progressbar"
        >
          <div
            className="cognition-deck__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <nav className="cognition-deck__sections" aria-label="Deck sections">
          {sectionRail.map(({ section, label }) => (
            <span
              key={section}
              className={
                section === currentSlide.section
                  ? 'cognition-deck__section cognition-deck__section--active'
                  : 'cognition-deck__section'
              }
            >
              {label}
            </span>
          ))}
        </nav>
      </div>

      <section className="cognition-deck__stage" aria-live="polite">
        {renderedSlides.map(({ slide, phase }) => (
          <article
            key={slide.id}
            aria-hidden={phase === 'exit'}
            className={`cognition-deck__slide cognition-deck__slide--${phase}`}
          >
            <p className="cognition-deck__eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p className="cognition-deck__body">{slide.body}</p>
            {slide.kicker ? (
              <p className="cognition-deck__kicker">{slide.kicker}</p>
            ) : null}
          </article>
        ))}
      </section>

      <footer className="cognition-deck__footer">
        <div className="cognition-deck__controls">
          <button
            aria-label="Previous slide"
            type="button"
            onClick={() =>
              setCurrentIndex((index) => clampSlideIndex(index - 1, totalSlides))
            }
          >
            Previous slide
          </button>
          <button
            aria-label="Next slide"
            type="button"
            onClick={() =>
              setCurrentIndex((index) => clampSlideIndex(index + 1, totalSlides))
            }
          >
            Next slide
          </button>
        </div>

        <p className="cognition-deck__counter">{counterText}</p>
      </footer>
    </main>
  );
}

export default CognitionDeck;
