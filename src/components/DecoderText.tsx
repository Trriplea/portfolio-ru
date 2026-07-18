import {
  Children,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type DecoderTextProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: ReactNode;
  initialScrambleFrames?: number;
  intervalMs?: number;
  characters?: string;
  restoreScrambleFrames?: number;
};

type DisplayTextState = {
  displayText: string;
  sourceText: string;
};

const DEFAULT_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?+=ÅÄÖØÉÆ';
const ORIGINAL_CHARACTER_CHANCE = 0.18;
const ANIMATION_MEDIA_QUERY =
  '(min-width: 501px) and (hover: hover) and (pointer: fine)';

const getInitialReducedMotionPreference = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getInitialAnimationPreference = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.matchMedia(ANIMATION_MEDIA_QUERY).matches;
};

const getTextFromChildren = (children: ReactNode) => {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }

      return '';
    })
    .join('');
};

const getRandomCharacter = (characters: string[]) => {
  const characterIndex = Math.floor(Math.random() * characters.length);

  return characters[characterIndex] ?? '';
};

const getFrameText = (
  sourceText: string,
  characters: string[],
  fixedCharacterCount: number,
) => {
  return Array.from(sourceText)
    .map((character, characterIndex) => {
      if (character === ' ' || characterIndex < fixedCharacterCount) {
        return character;
      }

      if (Math.random() < ORIGINAL_CHARACTER_CHANCE) {
        return character;
      }

      return getRandomCharacter(characters);
    })
    .join('');
};

export const DecoderText = ({
  characters = DEFAULT_CHARACTERS,
  children,
  className = '',
  initialScrambleFrames = 3,
  intervalMs = 50,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  restoreScrambleFrames = 2,
  tabIndex,
  ...spanProps
}: DecoderTextProps) => {
  const sourceText = useMemo(() => getTextFromChildren(children), [children]);
  const randomCharacters = useMemo(() => Array.from(characters), [characters]);
  const [displayTextState, setDisplayTextState] = useState<DisplayTextState>(
    () => ({
      displayText: sourceText,
      sourceText,
    }),
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotionPreference,
  );
  const [canAnimate, setCanAnimate] = useState(
    getInitialAnimationPreference,
  );
  const canAnimateRef = useRef(canAnimate);
  const intervalRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const sourceTextRef = useRef(sourceText);
  const displayText =
    prefersReducedMotion ||
    !canAnimate ||
    displayTextState.sourceText !== sourceText
      ? sourceText
      : displayTextState.displayText;

  const clearAnimation = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }

    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const finishImmediately = useCallback(() => {
    clearAnimation();
    setDisplayTextState({
      displayText: sourceTextRef.current,
      sourceText: sourceTextRef.current,
    });
  }, [clearAnimation]);

  const startDecode = useCallback(() => {
    clearAnimation();

    if (
      prefersReducedMotionRef.current ||
      !canAnimateRef.current ||
      sourceTextRef.current.length === 0
    ) {
      setDisplayTextState({
        displayText: sourceTextRef.current,
        sourceText: sourceTextRef.current,
      });
      return;
    }

    let frameIndex = 0;

    const renderNextFrame = () => {
      const fixedCharacterCount = Math.max(
        0,
        frameIndex - initialScrambleFrames,
      );

      if (fixedCharacterCount >= sourceTextRef.current.length) {
        finishImmediately();
        return;
      }

      setDisplayTextState({
        displayText: getFrameText(
          sourceTextRef.current,
          randomCharacters,
          fixedCharacterCount,
        ),
        sourceText: sourceTextRef.current,
      });
      frameIndex += 1;
    };

    renderNextFrame();
    intervalRef.current = window.setInterval(renderNextFrame, intervalMs);
  }, [
    clearAnimation,
    finishImmediately,
    initialScrambleFrames,
    intervalMs,
    randomCharacters,
  ]);

  const startRestore = useCallback(() => {
    clearAnimation();

    if (
      prefersReducedMotionRef.current ||
      !canAnimateRef.current ||
      sourceTextRef.current.length === 0
    ) {
      setDisplayTextState({
        displayText: sourceTextRef.current,
        sourceText: sourceTextRef.current,
      });
      return;
    }

    let frameIndex = 0;

    const renderNextFrame = () => {
      const fixedCharacterCount = Math.max(
        0,
        frameIndex - restoreScrambleFrames,
      );

      if (fixedCharacterCount >= sourceTextRef.current.length) {
        finishImmediately();
        return;
      }

      setDisplayTextState({
        displayText: getFrameText(
          sourceTextRef.current,
          randomCharacters,
          fixedCharacterCount,
        ),
        sourceText: sourceTextRef.current,
      });
      frameIndex += 1;
    };

    renderNextFrame();
    intervalRef.current = window.setInterval(renderNextFrame, intervalMs);
  }, [
    clearAnimation,
    finishImmediately,
    intervalMs,
    randomCharacters,
    restoreScrambleFrames,
  ]);

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerEnter?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startDecode();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerLeave?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startRestore();
  };

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    onFocus?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startDecode();
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    onBlur?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startRestore();
  };

  useEffect(() => {
    sourceTextRef.current = sourceText;
    clearAnimation();
  }, [clearAnimation, sourceText]);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;

    if (prefersReducedMotion) {
      clearAnimation();
    }
  }, [clearAnimation, prefersReducedMotion]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  useEffect(() => {
    const animationQuery = window.matchMedia(ANIMATION_MEDIA_QUERY);
    const handleAnimationPreferenceChange = (event: MediaQueryListEvent) => {
      canAnimateRef.current = event.matches;
      setCanAnimate(event.matches);

      if (!event.matches) {
        finishImmediately();
      }
    };

    canAnimateRef.current = animationQuery.matches;
    animationQuery.addEventListener('change', handleAnimationPreferenceChange);

    return () => {
      animationQuery.removeEventListener(
        'change',
        handleAnimationPreferenceChange,
      );
    };
  }, [finishImmediately]);

  useEffect(() => {
    return () => {
      clearAnimation();
    };
  }, [clearAnimation]);

  return (
    <span
      {...spanProps}
      aria-label={spanProps['aria-label'] ?? sourceText}
      className={`relative inline-block cursor-pointer select-text whitespace-nowrap text-inherit focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-zinc-950 ${className}`}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      tabIndex={tabIndex ?? 0}
    >
      <span aria-hidden="true" className="invisible">
        {sourceText}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0 whitespace-nowrap">
        {displayText}
      </span>
    </span>
  );
};
