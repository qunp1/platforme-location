import React from 'react';
import { Icon } from '../ui.jsx';
import { makeUrl } from '../navigation.js';

export default function TravelGuides({ Link, search = {} }) {
  return (
    <section className="arrival-guides" aria-labelledby="arrival-guides-heading">
      <div className="arrival-intro">
        <h2 id="arrival-guides-heading">Votre arrivée, simplement.</h2>
        <p>Depuis l’aéroport ou le port, préparez le premier kilomètre de votre séjour.</p>
      </div>
      <div className="arrival-options">
        <article id="airport-guide">
          <Icon name="plane" />
          <div>
            <h3>Aéroport Nador Al Aroui (NDR)</h3>
            <p>
              Choisissez la remise à l’aéroport. L’agence vous confirme le point de rendez-vous et
              les éventuels frais avant votre arrivée.
            </p>
            <Link
              className="button button-secondary"
              href={makeUrl('/cars', { ...search, location: 'airport' })}
            >
              Voir les offres à l’aéroport <Icon name="arrow" size="small" />
            </Link>
          </div>
        </article>
        <article id="port-guide">
          <Icon name="anchor" />
          <div>
            <h3>Port de Beni Ensar</h3>
            <p>
              Préparez votre arrivée en ferry. Convenez du lieu exact de remise et de retour avec
              l’agence qui accepte votre demande.
            </p>
            <Link
              className="button button-secondary"
              href={makeUrl('/cars', { ...search, location: 'port' })}
            >
              Voir les offres au port <Icon name="arrow" size="small" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
