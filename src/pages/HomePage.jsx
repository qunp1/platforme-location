import React from 'react';
import Questions from '../Questions.jsx';
import SearchForm from '../SearchForm.jsx';
import OfferCard from '../OfferCard.jsx';
import CatalogError from '../components/CatalogError.jsx';
import TravelGuides from '../components/TravelGuides.jsx';
import { Button, EmptyState, Icon, Skeletons } from '../ui.jsx';
import { locations, prettyDate, quote } from '../domain.js';
import { makeUrl } from '../navigation.js';
import { copy } from '../copy.js';
import heroScene from '../../assets/nador-coastal-arrival.webp';

export default function HomePage({
  data,
  search,
  titleRef,
  displaySearch,
  navigate,
  hasDates,
  linkSearch,
  Link,
  offerUrl,
  setModal,
}) {
  const featured = ['sandero', 'clio', 'duster', 'logan', '3008', 'jogger']
    .map((id) => data.cars.find((car) => car.id === id))
    .filter((car) => car && quote(car, search));
  return (
    <>
      <section className="home-hero home-simple mediterranean-hero">
        <div className="hero-visual">
          <img className="hero-backdrop" src={heroScene} alt="" fetchPriority="high" />
        </div>

        <div className="container hero-inner hero-stage">
          <div className="hero-top">
            <div className="hero-copy">
              <h1 {...titleRef}>
                Louez à Nador.
                <br />
                <em>En toute liberté.</em>
              </h1>
              <p className="hero-description">Accédez en direct aux offres des loueurs de Nador.</p>
            </div>
          </div>
          <SearchForm
            search={displaySearch}
            horizontal
            onApply={(value) => navigate(makeUrl('/cars', value))}
          />
        </div>
      </section>
      <div className="container trust-strip" aria-label="Une location en toute clarté">
        <span>
          <Icon name="pin" />
          Agences locales de Nador
        </span>
        <span>
          <Icon name="shield" />
          Caution affichée à l’avance
        </span>
        <span>
          <Icon name="check" />
          Frais de remise détaillés
        </span>
        <span>
          <Icon name="people" />
          L’agence valide votre demande
        </span>
      </div>
      <section className="container home-offers section-space">
        <div className="section-heading">
          <div>
            <h2>Nos voitures à Nador</h2>
            <p className="section-subtitle">
              Les offres en direct de nos agences partenaires à Nador.
            </p>
          </div>
          <Link href={makeUrl('/cars', linkSearch)} className="text-link">
            Voir le catalogue
          </Link>
        </div>
        {hasDates && (
          <div className="selection-context">
            <span>
              <Icon name="calendar" size="small" />
              {prettyDate(search.start)} – {prettyDate(search.end)}
            </span>
            <span>{locations[search.location]}</span>
            <Button variant="quiet" onClick={() => setModal('search')}>
              Changer mes dates
            </Button>
          </div>
        )}
        {data.status === 'loading' ? (
          <Skeletons />
        ) : data.status === 'error' ? (
          <CatalogError retry={data.retry} />
        ) : featured.length ? (
          <div className="offer-grid">
            {featured.map((car) => (
              <OfferCard
                key={car.id}
                car={car}
                search={search}
                hasDates={hasDates}
                href={offerUrl(car)}
                Link={Link}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Choisissez votre prise en charge"
            action={
              <Link href={makeUrl('/cars', linkSearch)} className="button button-primary">
                Voir les voitures
              </Link>
            }
          >
            Les agences proposent des lieux de retrait différents.
          </EmptyState>
        )}
        <p className="catalog-caption">
          {hasDates
            ? 'Prix du séjour affichés en toute transparence, frais de remise compris.'
            : 'Tarifs par jour affichés en toute transparence par nos agences locales.'}
        </p>
      </section>
      <section className="container rental-intro section-space">
        <div className="process-heading">
          <div>
            <h2>
              Vous choisissez.
              <br />
              L’agence confirme.
            </h2>
            <p>
              Comparez les voitures et leurs conditions. L’agence accepte votre demande avant tout
              paiement.
            </p>
          </div>
          <Link href="/how-it-works" className="button process-cta">
            Comment ça marche
            <Icon name="arrow" size="small" />
          </Link>
        </div>
        <ol className="process-steps">
          {copy.steps.map(({ title, text: description }, index) => (
            <li key={title}>
              <span className="process-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="container section-space">
        <TravelGuides Link={Link} search={linkSearch} />
      </div>
      <section className="container faq-section section-space">
        <div>
          <h2>Questions fréquentes</h2>
          <Link href="/help" className="text-link">
            Toutes les réponses
          </Link>
        </div>
        <Questions limit={4} />
      </section>
    </>
  );
}
