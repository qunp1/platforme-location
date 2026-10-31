import React from 'react';
import { Icon } from '../ui.jsx';

export default function MobileDock({ Link, path, resultsUrl }) {
  const destinations = [
    ['/', 'Accueil', 'home', path === '/'],
    [resultsUrl, 'Voitures', 'search', path === '/cars' || path.startsWith('/cars/')],
    [
      '/account/bookings',
      'Demandes',
      'bag',
      path.startsWith('/account') || path === '/requests/new',
    ],
    ['/help', 'Aide', 'help', path === '/help'],
  ];
  return (
    <nav className="mobile-dock" aria-label="Navigation mobile">
      {destinations.map(([href, label, icon, current]) => (
        <Link key={label} href={href} aria-current={current ? 'page' : undefined}>
          <Icon name={icon} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
