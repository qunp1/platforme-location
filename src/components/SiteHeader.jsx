import React, { useEffect, useRef, useState } from 'react';
import useHeaderVisibility from '../hooks/useHeaderVisibility.js';
import { makeUrl } from '../navigation.js';
import logo from '../../assets/brand/nadorly-horizontal-navy.svg';

export default function SiteHeader({ Link, path, linkSearch }) {
  const headerRef = useRef(null);
  const [atTop, setAtTop] = useState(() => window.scrollY <= 24);
  useEffect(() => {
    setAtTop(window.scrollY <= 24);
    if (path !== '/') return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setAtTop(window.scrollY <= 24);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(frame);
    };
  }, [path]);
  const hidden = useHeaderVisibility(`${path}${location.search}${location.hash}`, headerRef);
  return (
    <header
      className="site-header"
      ref={headerRef}
      data-hidden={hidden}
      data-hero={path === '/' && atTop}
    >
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
