import React from 'react';
import { money, quote } from './domain.js';
import { handover } from './data.js';
import { CarPhoto, Icon } from './ui.jsx';
export const gearLabel = (gear) => (gear === 'auto' ? 'Automatique' : 'Manuelle');
export function Specs({ car }) {
  return (
    <ul className="specs">
      <li>
        <Icon name="gear" size="small" />
        {gearLabel(car.gear)}
      </li>
      <li>
        <Icon name="fuel" size="small" />
        {car.fuel}
      </li>
      <li>
        <Icon name="people" size="small" />
        {car.seats} places
      </li>
      <li>
        <Icon name="bag" size="small" />
        {car.bags} bagages
      </li>
    </ul>
  );
}
function AgencyPhoto({ car }) {
  return (
    <div className="agency-photo-frame">
      <CarPhoto src={car.image} name={car.name} className="offer-photo" />
      <span className="agency-photo-badge">
        {car.agencyVerified === true ? (
          <Icon name="check" size="small" />
        ) : (
          <span className="agency-dot" aria-hidden="true" />
        )}
        <span>{car.agency}</span>
        {car.agencyVerified === true && <span className="sr-only">Agence vérifiée</span>}
      </span>
    </div>
  );
}
export default function OfferCard({ car, search, href, Link, detailed = false, hasDates = true }) {
  const estimate = quote(car, search);
  if (!estimate) return null;
  if (!detailed)
    return (
      <article className="offer-card offer-compact">
        <Link
          href={href}
          className="compact-card-link"
          aria-label={`Découvrir ${car.name}, ${car.agency}`}
        >
          <AgencyPhoto car={car} />
          <div className="compact-card-body">
            <h3>{car.name}</h3>
            <div className="compact-specs">
              <span>{gearLabel(car.gear)}</span>
              <span>{car.fuel}</span>
              <span>{car.seats} places</span>
            </div>
            <div className="compact-price-row">
              <p className="price">
                <strong>{money(hasDates ? estimate.total : car.daily)}</strong>
                <span>
                  {hasDates
                    ? `pour ${estimate.days} jour${estimate.days > 1 ? 's' : ''}`
                    : 'par jour'}
                </span>
              </p>
              <span className="card-action">
                Voir l’offre
                <Icon name="arrow" size="small" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  return (
    <article className={`offer-card ${detailed ? 'offer-row' : ''}`}>
      <Link
        href={href}
        className="offer-photo-link"
        aria-label={`Découvrir ${car.name}, ${car.agency}`}
      >
        <AgencyPhoto car={car} />
      </Link>
      <div className="offer-main">
        <div className="offer-title">
          <p className="vehicle-category">{car.type}</p>
          <h3>
            <Link href={href}>{car.name}</Link>
          </h3>
        </div>
        <Specs car={car} />
        <div className="offer-conditions">
          <span>
            <Icon name="shield" size="small" />
            Caution : {money(car.deposit)}
          </span>
          <span>
            <Icon name="car" size="small" />
            {car.mileage} km / jour inclus
          </span>
          <span>
            <Icon name="fuel" size="small" />
            {car.fuelPolicy}
          </span>
        </div>
        {detailed && (
          <p className="handover-line">
            <Icon name="pin" size="small" />
            {handover(search.location)}
            <span>
              ·{' '}
              {search.location === 'office'
                ? 'Nador centre'
                : search.location === 'port'
                  ? 'Port de Beni Ensar'
                  : 'Aéroport de Nador'}
            </span>
          </p>
        )}
      </div>
      <div className="offer-price">
        <p className="price">
          <strong>{money(hasDates ? estimate.total : car.daily)}</strong>
          <span>
            {hasDates ? `pour ${estimate.days} jour${estimate.days > 1 ? 's' : ''}` : 'par jour'}
          </span>
        </p>
        <p className="small muted">
          {hasDates ? `${money(car.daily)} / jour · ` : ''}
          {estimate.delivery
            ? `${money(estimate.delivery)} de remise et retour ${hasDates ? 'inclus' : 'en supplément'}`
            : 'Remise et retour sans frais'}
        </p>
        <Link href={href} className="button button-primary listing-cta">
          Voir l’offre
          <Icon name="arrow" size="small" />
        </Link>
      </div>
    </article>
  );
}
