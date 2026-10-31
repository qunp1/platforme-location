import React from 'react';
import { copy } from '../copy.js';
import { usedPhotoRefs } from '../data.js';
import whiteLogo from '../../assets/brand/nadorly-kit-v2/svg/nadorly-horizontal-white.svg';
import credits from '../../assets/credits.json';

export default function SiteFooter({ Link, resultsUrl, path, compactMobile = false }) {
  return (
    <>
      <footer className={`site-footer${compactMobile ? ' site-footer--booking' : ''}`}>
        <div className="container footer-top">
          <div>
            <Link href="/" className="brand-signature" aria-label="Nadorly, accueil">
              <img src={whiteLogo} alt="Nadorly" width="170" height="56" />
            </Link>
            <p>
              À Nador, en toute liberté.
              <br />
              Au quotidien ou en escapade.
            </p>
          </div>
          <nav className="footer-links" aria-label="Votre location">
            <strong>Votre location</strong>
            <Link href={resultsUrl} aria-current={path === '/cars' ? 'page' : undefined}>
              Comparer les offres
            </Link>
            <Link href="/how-it-works" aria-current={path === '/how-it-works' ? 'page' : undefined}>
              Le fonctionnement
            </Link>
            <Link href="/help" aria-current={path === '/help' ? 'page' : undefined}>
              Questions fréquentes
            </Link>
          </nav>
          <nav className="footer-links" aria-label="Les agences">
            <strong>Les agences</strong>
            <Link href="/agency" aria-current={path === '/agency' ? 'page' : undefined}>
              Découvrir Nadorly
            </Link>
            <p>
              Une plateforme pensée pour
              <br />
              les agences locales de Nador.
            </p>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>Nadorly · Démonstration locale</span>
          <span>Français · MAD</span>
          <details className="photo-credits">
            <summary>Crédits photos d’illustration (Licences CC)</summary>
            <ul>
              {credits
                .filter((c) => usedPhotoRefs.has(c.ref))
                .map((c) => (
                  <li key={c.ref}>
                    <a href={c.page} target="_blank" rel="noreferrer">
                      {c.title}
                    </a>{' '}
                    — {c.creator}, <a href={c.licenseUrl}>{c.license}</a>
                  </li>
                ))}
            </ul>
            <p>Photos du modèle, recadrées pour l’affichage. Licences d’origine conservées.</p>
          </details>
        </div>
        <div className="footer-disclaimer">
          <p className="container footer-demo">{copy.demo}</p>
        </div>
      </footer>
      {compactMobile && (
        <footer className="micro-footer" aria-label="Informations essentielles">
          <span>© {new Date().getUTCFullYear()} Nadorly</span>
          <span aria-hidden="true"> · </span>
          <Link href="/help">Aide</Link>
        </footer>
      )}
    </>
  );
}
