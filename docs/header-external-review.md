Adversarial review. Find what is wrong with this artifact. Assume the author is overconfident. Look for unstated assumptions, edge cases not handled, hidden coupling, contract violations and failure modes. Do NOT validate or summarize. Find issues, or state explicitly that you cannot find any after thorough examination.

CONTRACT: At widths <=767px, hide the header after deliberate downward scroll beyond 80px; reveal upward. Desktop stays pinned. Resize and route changes reset visibility. Keyboard focus reveals header. Open picker/dialog keeps header visible. Passive/rAF listeners must clean up. CSS uses a transform with reduced-motion fallback.

ARTIFACT:

import { useEffect, useState } from 'react';

export default function useHeaderVisibility(path, headerRef) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    let previous = Math.max(0, window.scrollY);
    let distance = 0;
    let frame = 0;
    setHidden(false);
    const reset = () => {
      previous = Math.max(0, window.scrollY);
      distance = 0;
      setHidden(false);
    };
    const update = () => {
      frame = 0;
      const current = Math.max(0, window.scrollY);
      const delta = current - previous;
      previous = current;
      if (
        !mobile.matches ||
        current < 80 ||
        headerRef.current?.contains(document.activeElement) ||
        document.querySelector('.booking-popover, dialog[open]')
      ) {
        distance = 0;
        setHidden(false);
        return;
      }
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (distance > 16) setHidden(true);
      if (distance < -8) setHidden(false);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scroll, { passive: true });
    mobile.addEventListener('change', reset);
    const header = headerRef.current;
    header?.addEventListener('focusin', reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      mobile.removeEventListener('change', reset);
      header?.removeEventListener('focusin', reset);
    };
  }, [path, headerRef]);
  return hidden;
}


import React, { useRef } from 'react';
import useHeaderVisibility from '../hooks/useHeaderVisibility.js';
import { makeUrl } from '../navigation.js';
import logo from '../../assets/brand/nadorly-horizontal-navy.svg';

export default function SiteHeader({ Link, path, linkSearch }) {
  const headerRef = useRef(null);
  const hidden = useHeaderVisibility(path, headerRef);
  return (
    <header className="site-header" ref={headerRef} data-hidden={hidden}>
      <div className="container header-inner">
        <div className="header-brand">
          <Link href="/" className="brand-signature" aria-label="Nadorly, accueil">
            <img className="brand-logo" src={logo} alt="Nadorly" width="170" height="56" />
          </Link>
          <span className="local-tag">Nador & Oriental</span>
        </div>
        <nav id="primary-navigation" aria-label="Navigation principale" className="header-nav">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
            Accueil
          </Link>
          <Link
            href={makeUrl('/cars', linkSearch)}
            aria-current={path === '/cars' || path.startsWith('/cars/') ? 'page' : undefined}
          >
            Nos voitures
          </Link>
          <Link href="/how-it-works" aria-current={path === '/how-it-works' ? 'page' : undefined}>
            Comment ça marche
          </Link>
          <Link href="/help" aria-current={path === '/help' ? 'page' : undefined}>
            Aide
          </Link>
        </nav>
        <div className="header-end">
          <span className="locale-summary" aria-label="Français, prix en dirhams marocains">
            FR · MAD
          </span>
          <Link
            href="/account/bookings"
            className="button requests-link"
            aria-current={path.startsWith('/account/bookings') ? 'page' : undefined}
          >
            Mes demandes
          </Link>
        </div>
      </div>
    </header>
  );
}
