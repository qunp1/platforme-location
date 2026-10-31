import { useEffect, useRef } from 'react';

// Keep fixed mobile actions out of transformed ancestors while the page enters.
export default function useRouteEntrance(path) {
  const root = useRef(null),
    previous = useRef(path);
  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const surfaces =
      root.current?.querySelectorAll(
        ':scope > :not(.listing-detail), :scope > .listing-detail > :not(.mobile-quote-bar)',
      ) || [];
    const animations = Array.from(surfaces, (element) =>
      element.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 150, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      ),
    );
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const cancel = () => animations.forEach((animation) => animation.cancel());
    preference.addEventListener('change', cancel);
    return () => {
      cancel();
      preference.removeEventListener('change', cancel);
    };
  }, [path]);
  return root;
}
