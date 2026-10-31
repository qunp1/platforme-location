import React, { useEffect, useRef, useState } from 'react';
import useRouteEntrance from './useRouteEntrance.js';
import useCatalog from './hooks/useCatalog.js';
import DesignPage from './DesignPage.jsx';
import VehiclePage from './VehiclePage.jsx';
import AccountPage from './AccountPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import InfoPage from './pages/InfoPage.jsx';
import CatalogError from './components/CatalogError.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import MobileDock from './components/MobileDock.jsx';
import SearchForm from './SearchForm.jsx';
import { MobileFilters } from './Filters.jsx';
import { CarPhoto, EmptyState, Modal, Skeletons } from './ui.jsx';
import { defaultFilters, searchCars } from './domain.js';
import { makeUrl, parseRoute } from './navigation.js';

const CatalogStress = import.meta.env.DEV
  ? React.lazy(() => import('./dev/CatalogStress.jsx'))
  : null;

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(location.href));
  const pageRoot = useRouteEntrance(route.path);
  const [modal, setModal] = useState(null);
  const data = useCatalog();
  const heading = useRef(null);
  useEffect(() => {
    const pop = () => {
      setRoute({ ...parseRoute(location.href), restore: history.state?.scroll || 0 });
      setModal(null);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  useEffect(() => {
    const titles = {
      '/': 'Location de voitures à Nador',
      '/cars': 'Voitures à Nador',
      '/help': 'Questions fréquentes',
      '/how-it-works': 'Comment ça marche',
      '/agency': 'Devenir agence partenaire',
      '/account/sign-in': 'Votre compte',
      '/account/reset-password': 'Réinitialiser le mot de passe',
      '/account/bookings': 'Mes demandes',
      '/requests/new': 'Votre demande de location',
    };
    const pageTitle =
      titles[route.path] ||
      (route.path.startsWith('/cars/')
        ? 'Votre offre de location'
        : route.path.startsWith('/account/bookings/')
          ? 'Votre demande'
          : 'Page introuvable');
    document.title = `${pageTitle} · Nadorly`;
    if (route.restore !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, route.restore));
    } else {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [route.path]);
  function navigate(href, { keepScroll = false } = {}) {
    history.replaceState({ ...history.state, scroll: window.scrollY }, '', location.href);
    history.pushState({ scroll: 0 }, '', href);
    const next = parseRoute(href);
    setRoute({ ...next, ...(keepScroll ? { restore: window.scrollY } : {}) });
    setModal(null);
    if (!keepScroll) {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    }
  }
  function Link({ href, children, onClick, ...props }) {
    return (
      <a
        href={href}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (
            !event.defaultPrevented &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey &&
            event.button === 0 &&
            !props.target
          ) {
            event.preventDefault();
            navigate(href);
          }
        }}
      >
        {children}
      </a>
    );
  }
  const { search, filters, path, hasDates } = route;
  const linkSearch = hasDates ? search : { location: search.location };
  const displaySearch = hasDates ? search : { ...search, start: '', end: '' };
  const resultsUrl = makeUrl('/cars', linkSearch, filters);
  const offerUrl = (car) => makeUrl(`/cars/${car.id}`, linkSearch, filters);
  const applyFilters = (value) =>
    navigate(makeUrl('/cars', linkSearch, value), { keepScroll: true });
  const matched = searchCars(data.cars, search, filters);
  if (!hasDates)
    matched.sort((a, b) => (filters.sort === 'price-desc' ? b.daily - a.daily : a.daily - b.daily));
  const titleRef = { ref: heading, tabIndex: -1 };
  const isVehicle = path.startsWith('/cars/');
  const vehicle = isVehicle ? data.cars.find((car) => car.id === path.split('/')[2]) : null;
  if (path === '/design') return <DesignPage />;

  function renderVehicle() {
    if (data.status === 'loading')
      return (
        <div className="container section-space">
          <Skeletons count={1} />
        </div>
      );
    if (data.status === 'error')
      return (
        <div className="container section-space">
          <CatalogError retry={data.retry} />
        </div>
      );
    if (!vehicle)
      return (
        <div className="container section-space">
          <EmptyState
            headingAs="h1"
            titleProps={titleRef}
            title="Cette offre est introuvable"
            action={
              <Link href={resultsUrl} className="button button-primary">
                Revenir aux voitures
              </Link>
            }
          >
            Le lien est peut-être incomplet ou l’offre a été retirée. Votre recherche est conservée.
          </EmptyState>
        </div>
      );
    return (
      <VehiclePage
        vehicle={vehicle}
        search={search}
        hasDates={hasDates}
        resultsUrl={resultsUrl}
        Link={Link}
        titleProps={titleRef}
        onGallery={() => setModal('gallery')}
        onEdit={(picker) => setModal(picker ? `search-${picker}` : 'search')}
        onRequest={() => navigate(makeUrl('/requests/new', { ...search, vehicle: vehicle.id }))}
      />
    );
  }

  function renderPage() {
    if (path.startsWith('/account/') || path === '/requests/new')
      return (
        <AccountPage
          key={path + location.search}
          path={path}
          search={search}
          hasDates={hasDates}
          cars={data.cars}
          navigate={navigate}
          titleProps={titleRef}
        />
      );
    if (path === '/')
      return (
        <HomePage
          data={data}
          search={search}
          titleRef={titleRef}
          displaySearch={displaySearch}
          navigate={navigate}
          hasDates={hasDates}
          linkSearch={linkSearch}
          Link={Link}
          offerUrl={offerUrl}
          setModal={setModal}
        />
      );
    if (path === '/cars')
      return (
        <ResultsPage
          route={route}
          displaySearch={displaySearch}
          setModal={setModal}
          filters={filters}
          applyFilters={applyFilters}
          hasDates={hasDates}
          titleRef={titleRef}
          data={data}
          matched={matched}
          search={search}
          offerUrl={offerUrl}
          Link={Link}
        />
      );
    if (isVehicle) return renderVehicle();
    return <InfoPage path={path} titleRef={titleRef} Link={Link} resultsUrl={resultsUrl} />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <SiteHeader Link={Link} path={path} linkSearch={linkSearch} />
      <main id="main" ref={pageRoot} tabIndex={-1}>
        {renderPage()}
      </main>
      <SiteFooter
        Link={Link}
        resultsUrl={resultsUrl}
        path={path}
        compactMobile={isVehicle || path === '/requests/new'}
      />
      {!isVehicle && <MobileDock Link={Link} path={path} resultsUrl={resultsUrl} />}
      {import.meta.env.DEV && (
        <React.Suspense fallback={null}>
          <CatalogStress />
        </React.Suspense>
      )}
      {modal?.startsWith('search') && (
        <Modal
          className="search-modal"
          title="Les détails de votre location"
          onClose={() => setModal(null)}
        >
          <SearchForm
            initialPicker={
              modal === 'search-dates' ? 'dates' : modal === 'search-place' ? 'place' : null
            }
            search={displaySearch}
            label="Rechercher"
            onApply={(value) => navigate(makeUrl(isVehicle ? path : '/cars', value, filters))}
          />
        </Modal>
      )}
      {modal === 'filters' && (
        <Modal className="filters-modal" title="Affiner les offres" onClose={() => setModal(null)}>
          <MobileFilters
            initial={filters}
            onApply={(value) => {
              applyFilters(value);
              setModal(null);
            }}
          />
        </Modal>
      )}
      {modal === 'gallery' && vehicle && (
        <Modal title={vehicle.name} className="gallery-modal" onClose={() => setModal(null)}>
          <CarPhoto eager src={vehicle.image} name={vehicle.name} />
          <p className="small muted">
            Une photo d’illustration disponible. Les photos du véhicule réel seront fournies par
            l’agence.
          </p>
        </Modal>
      )}
    </>
  );
}
