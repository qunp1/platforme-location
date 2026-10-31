import { useEffect, useState } from 'react';

export default function useHeaderVisibility(routeKey, headerRef) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const scrollPosition = () =>
      Math.max(
        0,
        Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight),
      );
    const overlayOpen = () => document.querySelector('.booking-popover, dialog[open]');
    let previous = scrollPosition();
    let distance = 0;
    let frame = 0;
    setHidden(false);
    const reset = () => {
      previous = scrollPosition();
      distance = 0;
      setHidden(false);
    };
    const update = () => {
      frame = 0;
      const current = scrollPosition();
      const delta = current - previous;
      previous = current;
      if (
        !mobile.matches ||
        current < 80 ||
        headerRef.current?.querySelector(':focus-visible') ||
        overlayOpen()
      ) {
        distance = 0;
        setHidden(false);
        return;
      }
      if (!delta) return;
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (distance > 16) setHidden(true);
      if (distance < -8) setHidden(false);
    };
    const scroll = () => {
      if (!mobile.matches) return;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scroll, { passive: true });
    mobile.addEventListener('change', reset);
    window.addEventListener('resize', reset);
    window.addEventListener('hashchange', reset);
    const overlays = new MutationObserver(() => {
      if (mobile.matches && overlayOpen()) reset();
    });
    overlays.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open'],
    });
    const header = headerRef.current;
    header?.addEventListener('focusin', reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      mobile.removeEventListener('change', reset);
      window.removeEventListener('resize', reset);
      window.removeEventListener('hashchange', reset);
      overlays.disconnect();
      header?.removeEventListener('focusin', reset);
    };
  }, [routeKey, headerRef]);
  return hidden;
}
