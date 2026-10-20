'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react';

type SplitTextProps = {
  /** Words are revealed one by one. Use \n to force a new line. */
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** Runs as soon as the component mounts instead of waiting for scroll. */
  playOnMount?: boolean;
  /** Milliseconds of extra delay before the first word. */
  delay?: number;
  /** Milliseconds between words. */
  stagger?: number;
};

/**
 * A tiny, dependency-free text reveal: every word sits in its own mask and
 * slides up with a stagger. The visible text is duplicated for screen readers
 * via aria-label, so the effect never hurts accessibility or search engines,
 * and without JavaScript the words are simply visible.
 */
export function SplitText({
  text,
  as,
  className = '',
  wordClassName = '',
  playOnMount = false,
  delay = 0,
  stagger = 55,
}: SplitTextProps) {
  const Tag = (as ?? 'span') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (playOnMount) {
      const timer = window.setTimeout(() => setShown(true), 40);
      return () => window.clearTimeout(timer);
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [playOnMount]);

  const lines = text.split('\n');
  let wordIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`split-text ${shown ? 'is-shown' : ''} ${className}`}
      aria-label={text.replace(/\n/g, ' ')}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(' ').filter(Boolean);
        return (
          <span className="split-line" key={`line-${lineIndex}`} aria-hidden="true">
            {words.map((word, index) => {
              const current = wordIndex++;
              return (
                <Fragment key={`${word}-${index}`}>
                  <span className="split-word">
                    <span
                      className={`split-word-inner ${wordClassName}`}
                      style={
                        {
                          '--i': current,
                          '--stagger': `${stagger}ms`,
                          '--split-delay': `${delay}ms`,
                        } as CSSProperties
                      }
                    >
                      {word}
                    </span>
                  </span>
                  {index < words.length - 1 ? ' ' : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
