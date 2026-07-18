import { useEffect, useRef, type CSSProperties } from 'react';
import { DecoderText } from './DecoderText';

const brandWords = ['ALEKSANDR', 'RYAZANTSEV'] as const;
const desktopScrollDistance = 560;
const mobileScrollDistance = 440;

type ScrollLogoStyle = CSSProperties & {
  '--scroll-logo-scale': number;
  '--scroll-logo-top': string;
  '--scroll-logo-translate-y': string;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const easeInOutCubic = (value: number) => {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
};

const getLogoMetrics = () => {
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth < 768;

  return {
    endScale: isMobile ? 0.34 : 0.24,
    endTop: isMobile ? 18 : 16,
    scrollDistance: isMobile ? mobileScrollDistance : desktopScrollDistance,
    startTop: window.innerHeight * 0.5,
  };
};

const getInitialLogoStyle = (): ScrollLogoStyle => {
  return {
    '--scroll-logo-scale': 1,
    '--scroll-logo-top': '50vh',
    '--scroll-logo-translate-y': '-50%',
  };
};

const getLogoStyle = (scrollY: number, prefersReducedMotion: boolean) => {
  const { endScale, endTop, scrollDistance, startTop } = getLogoMetrics();
  const baseProgress = prefersReducedMotion
    ? 1
    : clamp(scrollY / scrollDistance, 0, 1);
  const progress = easeInOutCubic(baseProgress);
  const currentTop = startTop + (endTop - startTop) * progress;
  const currentScale = 1 + (endScale - 1) * progress;
  const currentTranslateY = -50 + 50 * progress;

  return {
    '--scroll-logo-scale': currentScale,
    '--scroll-logo-top': `${currentTop}px`,
    '--scroll-logo-translate-y': `${currentTranslateY}%`,
  } satisfies ScrollLogoStyle;
};

const applyLogoStyle = (
  element: HTMLElement,
  logoStyle: ScrollLogoStyle,
) => {
  element.style.setProperty(
    '--scroll-logo-scale',
    String(logoStyle['--scroll-logo-scale']),
  );
  element.style.setProperty(
    '--scroll-logo-top',
    logoStyle['--scroll-logo-top'],
  );
  element.style.setProperty(
    '--scroll-logo-translate-y',
    logoStyle['--scroll-logo-translate-y'],
  );
};

export const ScrollLogoHeader = () => {
  const logoRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let frameId: number | null = null;
    let lastPrefersReducedMotion = false;
    let lastScrollY = Number.NaN;
    let lastViewportHeight = Number.NaN;
    let lastViewportWidth = Number.NaN;
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const updateLogoStyleIfNeeded = () => {
      if (!logoRef.current) {
        return;
      }

      const nextPrefersReducedMotion = reducedMotionQuery.matches;
      const nextScrollY = window.scrollY;
      const nextViewportHeight = window.innerHeight;
      const nextViewportWidth = window.innerWidth;

      if (
        nextPrefersReducedMotion === lastPrefersReducedMotion &&
        nextScrollY === lastScrollY &&
        nextViewportHeight === lastViewportHeight &&
        nextViewportWidth === lastViewportWidth
      ) {
        return;
      }

      lastPrefersReducedMotion = nextPrefersReducedMotion;
      lastScrollY = nextScrollY;
      lastViewportHeight = nextViewportHeight;
      lastViewportWidth = nextViewportWidth;
      applyLogoStyle(
        logoRef.current,
        getLogoStyle(nextScrollY, nextPrefersReducedMotion),
      );
    };

    const updateLogoStyle = () => {
      frameId = null;
      updateLogoStyleIfNeeded();
    };

    const requestLogoStyleUpdate = () => {
      updateLogoStyleIfNeeded();

      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateLogoStyle);
      }
    };

    updateLogoStyleIfNeeded();

    window.addEventListener('scroll', requestLogoStyleUpdate, {
      passive: true,
    });
    window.addEventListener('resize', requestLogoStyleUpdate);
    reducedMotionQuery.addEventListener('change', requestLogoStyleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', requestLogoStyleUpdate);
      window.removeEventListener('resize', requestLogoStyleUpdate);
      reducedMotionQuery.removeEventListener('change', requestLogoStyleUpdate);
    };
  }, []);

  return (
    <h1
      aria-label="ALEKSANDR RYAZANTSEV"
      className="scroll-logo-type fixed left-1/2 z-30 m-0 flex w-max max-w-[calc(100vw-32px)] origin-top flex-col items-center text-center text-[clamp(34px,9vw,128px)] leading-[0.9] font-semibold tracking-[-0.03em] uppercase will-change-transform"
      ref={logoRef}
      style={{
        ...getInitialLogoStyle(),
        top: 'var(--scroll-logo-top)',
        transform:
          'translateX(-50%) translateY(var(--scroll-logo-translate-y)) scale(var(--scroll-logo-scale))',
      }}
    >
      {brandWords.map((brandWord) => (
        <DecoderText
          initialScrambleFrames={3}
          intervalMs={70}
          key={brandWord}
          restoreScrambleFrames={2}
        >
          {brandWord}
        </DecoderText>
      ))}
    </h1>
  );
};
