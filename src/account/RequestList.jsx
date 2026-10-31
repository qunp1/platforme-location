import React from 'react';
import { api } from '../api.js';
import { Button, Icon } from '../ui.jsx';
import { locations, money, prettyDate } from '../domain.js';
const statuses = {
  requested: 'En attente de l’agence',
  awaiting_payment: 'Acceptée · paiement à venir',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  declined: 'Refusée',
  cancelled: 'Annulée',
  expired: 'Expirée',
};
const progress = ['requested', 'awaiting_payment', 'confirmed', 'completed'];
const milestones = [
  'Demande envoyée',
  'Accord de l’agence',
  'Réservation confirmée',
  'Location terminée',
];
export default function RequestList({ path, requests, busy, run, setUser, setRequests }) {
  const selected = path.split('/')[3];
  const visible = selected ? requests.filter((r) => r.id === selected) : requests;
  return (
    <>
      <p>
        Une demande ne confirme pas une réservation. Aucun paiement n’est disponible dans cette
        première étape.
      </p>
      {visible.length ? (
        visible.map((r) => (
          <article className="request-record" key={r.id}>
            <span className="tag request-status" data-status={r.status}>
              {statuses[r.status] || 'Statut à confirmer'}
            </span>
            <h2>{r.quote.vehicle}</h2>
            <p>{r.quote.agency}</p>
            <p>
              {prettyDate(r.start_date, true)} – {prettyDate(r.end_date, true)} ·{' '}
              {locations[r.location]}
            </p>
            <p>
              <strong>{money(r.total)}</strong> · Caution séparée : {money(r.quote.deposit)}
            </p>
            <p className="small">Référence : {r.id}</p>
            {progress.includes(r.status) && (
              <ol className="request-timeline" aria-label="Avancement de votre demande">
                {milestones.map((milestone, index) => (
                  <li
                    key={milestone}
                    data-complete={index < progress.indexOf(r.status)}
                    aria-current={index === progress.indexOf(r.status) ? 'step' : undefined}
                  >
                    <span aria-hidden="true">
                      {index < progress.indexOf(r.status) ? (
                        <Icon name="check" size="small" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    {milestone}
                  </li>
                ))}
              </ol>
            )}
            <details>
              <summary>Conditions enregistrées</summary>
              <p>
                {r.quote.days} jours × {money(r.quote.daily)} · Remise : {money(r.quote.delivery)}
              </p>
              <p>
                {r.quote.terms.insurance}. {r.quote.terms.mileage} km/jour. {r.quote.terms.age} ans
                minimum, permis depuis {r.quote.terms.license} ans. {r.quote.terms.cancellation}
              </p>
            </details>
            {!selected && (
              <a className="text-link" href={`/account/bookings/${encodeURIComponent(r.id)}`}>
                Voir le récapitulatif <Icon name="arrow" size="small" />
              </a>
            )}
            {selected && (
              <Button variant="secondary" onClick={() => window.print()}>
                Imprimer le récapitulatif
              </Button>
            )}
          </article>
        ))
      ) : (
        <p>
          {selected
            ? 'Cette demande est introuvable ou ne vous appartient pas.'
            : 'Vous n’avez pas encore de demande.'}
        </p>
      )}
      <a href="/cars">Comparer les voitures</a>
      <Button
        variant="quiet"
        pending={busy}
        onClick={() =>
          run(async () => {
            await api('/auth/sign-out', {});
            setUser(null);
            setRequests([]);
          })
        }
      >
        Me déconnecter de tous les appareils
      </Button>
    </>
  );
}
