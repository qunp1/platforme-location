import { browserUrl } from '../navigation.js';
import React from 'react';
import { Button, Notice } from '../ui.jsx';
import { locations, money, prettyDate, validateSearch } from '../domain.js';

export default function RequestReview({ vehicle, estimate, search, submit, busy }) {
  return !vehicle || !estimate || validateSearch(search) ? (
    <Notice tone="error">
      Choisissez une offre et des dates valides avant de préparer votre demande.{' '}
      <a href={browserUrl('/cars')}>Voir les voitures</a>
    </Notice>
  ) : (
    <>
      <p className="small muted">Offre fictive · Démonstration · Aucun paiement</p>
      <ol className="review-steps" aria-label="Préparer votre demande">
        <li>Votre offre</li>
        <li aria-current="step">Vos coordonnées</li>
        <li>Réponse de l’agence</li>
      </ol>
      <h2>{vehicle.name}</h2>
      <p>
        {vehicle.agency} · {locations[search.location]}
      </p>
      <p>
        {prettyDate(search.start, true)} – {prettyDate(search.end, true)}
      </p>
      <dl className="quote-lines">
        <div>
          <dt>
            {estimate.days} jours × {money(vehicle.daily)}
          </dt>
          <dd>{money(estimate.rental)}</dd>
        </div>
        <div>
          <dt>Remise et retour</dt>
          <dd>{money(estimate.delivery)}</dd>
        </div>
        <div>
          <dt>Total estimé</dt>
          <dd>{money(estimate.total)}</dd>
        </div>
        <div>
          <dt>Caution séparée</dt>
          <dd>{money(vehicle.deposit)}</dd>
        </div>
      </dl>
      <p className="small">
        Facturation par jour calendaire. {vehicle.mileage} km/jour. {vehicle.age} ans minimum,
        permis depuis {vehicle.license} ans. {vehicle.insurance}. Franchise :{' '}
        {money(vehicle.excess)}. Carburant : {vehicle.fuelPolicy}. Caution : {vehicle.depositMethod}
        . {vehicle.cancellation}
      </p>
      <form className="account-form" onSubmit={submit}>
        <label className="field">
          Nom du conducteur
          <input name="contactName" autoComplete="name" minLength={2} maxLength={100} required />
        </label>
        <label className="field">
          Téléphone
          <input name="phone" type="tel" autoComplete="tel" pattern="[+0-9 ()-]{6,30}" required />
        </label>
        <label className="terms-checkbox">
          <input name="terms" type="checkbox" required />
          J’ai lu les conditions de cette offre. Je comprends que cette demande attend l’acceptation
          de l’agence et ne confirme aucune réservation.
        </label>
        <Button pending={busy}>Envoyer ma demande</Button>
      </form>
    </>
  );
}
