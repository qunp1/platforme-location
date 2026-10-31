import React from 'react';
import SortControl from '../SortControl.jsx';
import OfferCard, { gearLabel } from '../OfferCard.jsx';
import { FilterControls, filterCount } from '../Filters.jsx';
import CatalogError from '../components/CatalogError.jsx';
import { Button, EmptyState, Icon, Notice, Skeletons } from '../ui.jsx';
import { categories, defaultFilters, locations, prettyDate, validateSearch } from '../domain.js';

function TripSummary({ search, onEdit }) {
  return (
    <div className="trip-summary">
      <div className="trip-place">
        <Icon name="pin" />
        <div>
          <strong>{locations[search.location]}</strong>
          <span>Prise en charge et retour</span>
        </div>
      </div>
      <div className="trip-dates">
        <Icon name="calendar" />
        <div>
          <strong>
            {search.start
              ? `${prettyDate(search.start)} – ${prettyDate(search.end, true)}`
              : 'Choisissez vos dates'}
          </strong>
          {!search.start && <span>Tarifs affichés par jour</span>}
        </div>
      </div>
      <Button variant="secondary" onClick={onEdit}>
        Modifier<span className="desktop-word"> la recherche</span>
      </Button>
    </div>
  );
}

export default function ResultsPage({
  route,
  displaySearch,
  setModal,
  filters,
  applyFilters,
  hasDates,
  titleRef,
  data,
  matched,
  search,
  offerUrl,
  Link,
}) {
  return (
    <>
      <div className="trip-band">
        <div className="container">
          <TripSummary search={displaySearch} onEdit={() => setModal('search')} />
        </div>
      </div>
      <div className="container results-layout">
        <aside className="filters-sidebar">
          <div className="filters-title">
            <h2>Vos critères</h2>
            <Button
              variant="quiet"
              onClick={() => applyFilters({ ...defaultFilters, sort: filters.sort })}
            >
              Effacer
            </Button>
          </div>
          <FilterControls filters={filters} setFilters={applyFilters} />
        </aside>
        <section className="results-content">
          <div className="results-heading">
            <div>
              <p className="catalog-eyebrow">Offres d’agences locales · Nador</p>
              <h1 {...titleRef}>Trouvez votre voiture</h1>
              <p role={data.status === 'loading' ? undefined : 'status'} className="count-badge">
                {data.status === 'ready'
                  ? `${matched.length} offre${matched.length !== 1 ? 's' : ''}`
                  : 'Recherche des offres…'}
              </p>
            </div>
          </div>
          <div className="catalog-toolbar">
            <div className="toolbar-filters">
              <Button
                className="catalog-filter-toggle"
                variant="secondary"
                onClick={() => setModal('filters')}
              >
                <Icon name="filters" />
                Filtres{filterCount(filters) > 0 ? ` (${filterCount(filters)})` : ''}
              </Button>
            </div>
            <SortControl
              value={filters.sort}
              hasDates={hasDates}
              onChange={(sort) => applyFilters({ ...filters, sort })}
            />
          </div>
          {(route.invalidTrip || validateSearch(search)) && (
            <Notice tone="error">
              {route.invalidTrip
                ? 'Le lien contenait une recherche invalide. Des dates par défaut ont été rétablies.'
                : validateSearch(search)}{' '}
              <Button variant="quiet" onClick={() => setModal('search')}>
                Modifier les dates
              </Button>
            </Notice>
          )}
          {filterCount(filters) > 0 && (
            <div className="active-filters">
              {filters.category !== 'all' && (
                <button onClick={() => applyFilters({ ...filters, category: 'all' })}>
                  {categories[filters.category]}
                  <Icon name="close" size="small" />
                  <span className="sr-only">Supprimer la catégorie</span>
                </button>
              )}
              {filters.gear !== 'all' && (
                <button onClick={() => applyFilters({ ...filters, gear: 'all' })}>
                  {gearLabel(filters.gear)}
                  <Icon name="close" size="small" />
                  <span className="sr-only">Supprimer la boîte</span>
                </button>
              )}
              {filters.fuel !== 'all' && (
                <button onClick={() => applyFilters({ ...filters, fuel: 'all' })}>
                  {filters.fuel === 'diesel' ? 'Diesel' : 'Essence'}
                  <Icon name="close" size="small" />
                  <span className="sr-only">Supprimer le carburant</span>
                </button>
              )}
              {filters.seats !== 'all' && (
                <button onClick={() => applyFilters({ ...filters, seats: 'all' })}>
                  {filters.seats} places
                  <Icon name="close" size="small" />
                  <span className="sr-only">Supprimer le nombre de places</span>
                </button>
              )}
              {filters.max !== defaultFilters.max && (
                <button onClick={() => applyFilters({ ...filters, max: defaultFilters.max })}>
                  Jusqu’à {filters.max} MAD/j
                  <Icon name="close" size="small" />
                  <span className="sr-only">Supprimer le budget</span>
                </button>
              )}
            </div>
          )}
          {data.status === 'loading' ? (
            <Skeletons />
          ) : data.status === 'error' ? (
            <CatalogError retry={data.retry} />
          ) : matched.length ? (
            <div className="offer-list">
              {matched.map((car) => (
                <OfferCard
                  detailed
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
              title="Aucune offre pour ces critères"
              action={
                <>
                  <Button variant="secondary" onClick={() => applyFilters(defaultFilters)}>
                    Effacer les filtres
                  </Button>
                  <Button variant="quiet" onClick={() => setModal('search')}>
                    Changer la prise en charge
                  </Button>
                </>
              }
            >
              Essayez un autre budget, une autre catégorie ou un autre lieu. Vos dates sont
              conservées.
            </EmptyState>
          )}
        </section>
      </div>
    </>
  );
}
