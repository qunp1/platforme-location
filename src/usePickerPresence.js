import { useLayoutEffect, useState } from 'react';

export default function usePickerPresence(active, panel) {
  const [retained, setRetained] = useState(active);
  useLayoutEffect(() => {
    const element = panel.current;
    const mobileDates =
      matchMedia('(max-width: 767px)').matches && (active || retained) === 'dates';
    if (active) setRetained(active);
    if (!element || !mobileDates || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!active) setRetained(null);
      return;
    }
    const motion = element.animate(
      active
        ? [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [
            {
              opacity: getComputedStyle(element).opacity,
              transform: getComputedStyle(element).transform,
            },
            { opacity: 0, transform: 'translateY(8px)' },
          ],
      { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    );
    if (!active) motion.onfinish = () => setRetained(null);
    return () => motion.cancel();
  }, [active, panel]);
  return active || retained;
}
