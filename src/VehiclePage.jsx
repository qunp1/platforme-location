import React, { useEffect, useRef } from 'react';
import AnimatedDisclosure from './components/AnimatedDisclosure.jsx';
import { locations, money, prettyDate, quote, validateSearch } from './domain.js';
import { Specs } from './OfferCard.jsx';
import { Button, CarPhoto, Icon, Notice } from './ui.jsx';

export default function VehiclePage({
  vehicle,
  search,
  hasDates,
  resultsUrl,
  Link,
  titleProps,
  onEdit,
  onGallery,
  onRequest,
}) {
  const dateError = hasDates ? validateSearch(search) : null;
  const canRequest = hasDates && !dateError;
  const requestAction = () => (canRequest ? onRequest() : onEdit('dates'));
  const requestLabel = canRequest
    ? 'Préparer ma demande'
    : dateError
      ? 'Modifier mes dates'
      : 'Choisir mes dates';
  const estimate = quote(vehicle, search);
  const bookingBar = useRef(null);
  useEffect(() => {
    const element = bookingBar.current;
    if (!element) return;
    const previous = document.body.style.getPropertyValue('--booking-bar-height');
    const update = () =>
      document.body.style.setProperty(
        '--booking-bar-height',
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      );
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => {
      observer.disconnect();
      if (previous) document.body.style.setProperty('--booking-bar-height', previous);
      else document.body.style.removeProperty('--booking-bar-height');
    };
  }, [Boolean(estimate)]);
  const mobileAmount = money(hasDates && estimate ? estimate.total : vehicle.daily).replace(
    /\s*MAD\s*$/,
    '',
  );
  const category = vehicle.type.includes('places')
    ? vehicle.type
    : `${vehicle.type} · ${vehicle.seats} places`;
  const cancellation = vehicle.cancellation.replace(/\s*Conditions de démonstration\./gi, '');
  return (
    <div className="container vehicle-page listing-detail">
      <div className="vehicle-heading">
        <div>
          <p className="vehicle-eyebrow">
            {category}
            {vehicle.verified === true ? ' · Véhicule vérifié' : ''}
          </p>
          <h1 {...titleProps}>{vehicle.name}</h1>
          <a className="agency-profile-link" href="#agency-profile">
            <span className="agency-mini-avatar" aria-hidden="true">
              {vehicle.agency.slice(0, 1)}
            </span>
            <span>
              Proposé par <strong>{vehicle.agency}</strong>
              <span className="agency-location"> · Agence locale à Nador</span>
            </span>
            <Icon name="chevron" size="small" />
          </a>
        </div>
      </div>
      <div className="vehicle-layout">
        <div className="vehicle-main">
          <div className="vehicle-gallery">
            <button onClick={onGallery} aria-label={`Agrandir la photo de ${vehicle.name}`}>
              <div className="vehicle-image-frame">
                <CarPhoto eager src={vehicle.image} name={vehicle.name} className="vehicle-photo" />
                <span className="gallery-action" aria-hidden="true">
                  <Icon name="expand" size="small" />
                </span>
              </div>
            </button>
          </div>
          <div className="vehicle-specs">
            <Specs car={vehicle} />
          </div>
          <section className="detail-section vehicle-conditions">
            <h2>Ce qu’il faut savoir</h2>
            <p className="conditions-intro">
              Conditions appliquées par l’agence pour la location de ce véhicule.
            </p>
            <dl className="terms-grid">
              <div>
                <dt>
                  <span className="term-icon">
                    <Icon name="car" />
                  </span>
                  Kilométrage inclus
                </dt>
                <dd>{vehicle.mileage} km par jour</dd>
                <dd className="term-note">Au-delà : tarif à confirmer par l’agence</dd>
              </div>
              <div>
                <dt>
                  <span className="term-icon">
                    <Icon name="shield" />
                  </span>
                  Caution remboursable
                </dt>
                <dd>{money(vehicle.deposit)}</dd>
                <dd className="term-note">{vehicle.depositMethod}</dd>
              </div>
              <div>
                <dt>
                  <span className="term-icon">
                    <Icon name="people" />
                  </span>
                  Conducteur
                </dt>
                <dd>{vehicle.age} ans minimum</dd>
                <dd className="term-note">Permis depuis {vehicle.license} ans minimum</dd>
              </div>
              <div>
                <dt>
                  <span className="term-icon">
                    <Icon name="fuel" />
                  </span>
                  Carburant
                </dt>
                <dd>{vehicle.fuelPolicy}</dd>
                <dd className="term-note">Carburant non inclus dans le prix</dd>
              </div>
            </dl>
            <AnimatedDisclosure
              className="detail-disclosure"
              title="Assurance, franchise et annulation"
            >
              <div>
                <p>
                  <strong>{vehicle.insurance}.</strong> La franchise maximale est de{' '}
                  {money(vehicle.excess)}. Elle est distincte de la caution. L’agence précise les
                  garanties et exclusions avant la réservation.
                </p>
                <p>
                  <strong>Annulation.</strong> {cancellation}
                </p>
              </div>
            </AnimatedDisclosure>
          </section>
          <section className="detail-section agency-detail" id="agency-profile">
            <span className="agency-initial" aria-hidden="true">
              {vehicle.agency.slice(0, 1)}
            </span>
            <div>
              <h2>{vehicle.agency}</h2>
              <p className="agency-profile-meta">
                {vehicle.agencyVerified === true ? 'Agence locale vérifiée' : 'Agence locale'} ·
                Nador
              </p>
              <p>
                L’agence gère directement sa flotte, l’entretien des véhicules et la remise des
                clés. Elle confirme les conditions et le lieu de rendez-vous avec vous.
              </p>
            </div>
          </section>
        </div>
        <aside className="quote-panel" id="estimate" aria-label="Votre demande de location">
          <div className="booking-price-header">
            <div className={`booking-daily ${!hasDates ? 'quote-total' : ''}`}>
              <strong>{money(vehicle.daily)}</strong>
              <span>par jour</span>
            </div>
            <span className="acceptance-tag">Acceptation par l’agence</span>
          </div>
          {dateError && (
            <Notice tone="error">{dateError} Choisissez de nouvelles dates pour continuer.</Notice>
          )}
          <h2 className="booking-price-title">Le détail du prix</h2>
          <div className="reservation-controls">
            <button
              className="reservation-location"
              onClick={() => onEdit('place')}
              aria-label="Modifier le lieu de remise"
            >
              <span>
                <span className="reservation-label">Lieu de remise</span>
                <strong>{locations[search.location]}</strong>
              </span>
              <span className="reservation-edit">
                Modifier
                <Icon name="chevron" size="small" />
              </span>
            </button>
            <button
              className="reservation-dates"
              aria-label={hasDates ? 'Modifier les dates du séjour' : 'Choisir les dates du séjour'}
              onClick={() => onEdit('dates')}
            >
              <span>
                <span className="reservation-label">Dates du séjour</span>
                <strong>
                  {hasDates
                    ? `${prettyDate(search.start)} – ${prettyDate(search.end, true)}`
                    : 'Choisir mes dates'}
                </strong>
                {hasDates && estimate && <small>{estimate.days} jours de location</small>}
              </span>
              <Icon name="calendar" size="small" />
            </button>
          </div>
          {estimate ? (
            <>
              {hasDates ? (
                <dl className="quote-lines">
                  <div>
                    <dt>
                      {estimate.days} jours × {money(vehicle.daily)}
                    </dt>
                    <dd>{money(estimate.rental)}</dd>
                  </div>
                  <div>
                    <dt>Frais de remise et retour</dt>
                    <dd>{estimate.delivery ? money(estimate.delivery) : 'Sans frais'}</dd>
                  </div>
                  <div className="quote-line-total quote-total">
                    <dt>Total pour {estimate.days} jours</dt>
                    <dd>{money(estimate.total)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="billing-note">
                  Sélectionnez vos dates pour voir le prix total exact.
                </p>
              )}
              <div className="deposit-box">
                <span>
                  Caution remboursable <small>{vehicle.depositMethod}</small>
                </span>
                <strong>{money(vehicle.deposit)}</strong>
              </div>
              <Button className="button-block booking-request" onClick={requestAction}>
                {requestLabel}
                <Icon name="arrow" size="small" />
              </Button>
              <p className="quote-footnote">
                <Icon name="check" size="small" />
                <span>Aucun paiement immédiat · Confirmation par l’agence</span>
              </p>
            </>
          ) : (
            <Notice tone="error">
              Cette agence ne propose pas cette prise en charge.
              <Button variant="quiet" onClick={() => onEdit('place')}>
                Choisir un autre lieu
              </Button>
              <Link href={resultsUrl} className="text-link">
                Voir les offres compatibles
              </Link>
            </Notice>
          )}
        </aside>
      </div>
      {estimate && (
        <div className="mobile-quote-bar" ref={bookingBar}>
          <div>
            <strong className="booking-amount">
              <span className="booking-amount-number">{mobileAmount}</span>{' '}
              <span className="booking-amount-currency">MAD</span>
            </strong>
            <span>{hasDates ? `Total · ${estimate.days} jours` : 'Par jour'}</span>
          </div>
          <Button onClick={requestAction}>
            {requestLabel}
            <Icon name="arrow" size="small" />
          </Button>
        </div>
      )}
    </div>
  );
}
