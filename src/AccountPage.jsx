import PasswordResetForms from './account/PasswordResetForms.jsx';
import SignInForm from './account/SignInForm.jsx';
import RequestReview from './account/RequestReview.jsx';
import RequestList from './account/RequestList.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { Button, Notice } from './ui.jsx';
import { quote } from './domain.js';
import { browserUrl, routeLocation, makeUrl } from './navigation.js';
import './styles/account.css';

export function safeReturn(value) {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    !/[\x00-\x20]/.test(value)
    ? value
    : '/account/bookings';
}

export default function AccountPage({ path, search, hasDates, cars, navigate, titleProps }) {
  const [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [configured, setConfigured] = useState(null);
  const [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [mode, setMode] = useState('sign-in'),
    [requests, setRequests] = useState([]);
  const [unavailable, setUnavailable] = useState(false),
    [retry, setRetry] = useState(0);
  const key = useRef(crypto.randomUUID());
  const params = routeLocation(location.href).searchParams;
  const vehicle = cars.find((c) => c.id === params.get('vehicle'));
  const isReview = path === '/requests/new';
  const isReset = path === '/account/reset-password';
  const estimate = vehicle && hasDates ? quote(vehicle, search) : null;
  const returnTo = safeReturn(params.get('returnTo'));
  useEffect(() => {
    let live = true;
    setReady(false);
    setError('');
    setUnavailable(false);
    api('/health')
      .then(async (h) => {
        if (!live) return;
        setConfigured(h.configured);
        if (!h.configured) return;
        const s = await api('/auth/session');
        if (live) setUser(s.user);
        if (s.user && path.startsWith('/account/bookings')) {
          const r = await api('/requests');
          if (live) setRequests(r.requests);
        }
      })
      .catch(() => {
        if (live) setUnavailable(true);
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, [path, retry]);
  async function run(action) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function authenticate(event) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    await run(async () => {
      const data = await api(`/auth/${mode}`, {
        email: f.get('email'),
        password: f.get('password'),
      });
      if (data.user) {
        setUser(data.user);
        if (!isReview) {
          if (returnTo.startsWith('/account/bookings')) {
            const r = await api('/requests');
            setRequests(r.requests);
          }
          navigate(returnTo);
        }
      } else setMessage(data.message);
    });
  }
  async function submit(event) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    await run(async () => {
      await api('/requests', {
        vehicleId: vehicle.id,
        ...search,
        contactName: f.get('contactName'),
        phone: f.get('phone'),
        termsAccepted: f.get('terms') === 'on',
        expectedTotal: estimate.total,
        idempotencyKey: key.current,
      });
      navigate('/account/bookings');
    });
  }
  const notices = (
    <>
      {error && (
        <Notice tone="error" role="alert">
          {error}
        </Notice>
      )}
      {message && <Notice role="status">{message}</Notice>}
    </>
  );
  let content;
  if (!ready) content = <p role="status">Chargement de votre compte…</p>;
  else if (unavailable)
    content = (
      <>
        <Notice tone="error">
          Le service de comptes est momentanément indisponible. Aucune demande n’a été envoyée. Vous
          pouvez réessayer sans perdre vos critères de location.
        </Notice>
        <Button onClick={() => setRetry((value) => value + 1)}>Réessayer</Button>
        <a
          href={browserUrl(
            isReview && vehicle
              ? makeUrl(`/cars/${vehicle.id}`, search)
              : makeUrl('/cars', hasDates ? search : { location: search.location }),
          )}
        >
          Revenir aux voitures
        </a>
      </>
    );
  else if (configured === false)
    content = (
      <>
        <Notice>
          Les comptes et demandes ne sont pas encore connectés. La configuration du service est
          nécessaire. Aucune demande n’a été envoyée.
        </Notice>
        <a
          href={browserUrl(isReview && vehicle ? makeUrl(`/cars/${vehicle.id}`, search) : '/cars')}
        >
          Revenir aux voitures
        </a>
      </>
    );
  else if (isReset) content = <PasswordResetForms run={run} setMessage={setMessage} busy={busy} />;
  else if (!user)
    content = (
      <SignInForm
        isReview={isReview}
        authenticate={authenticate}
        mode={mode}
        busy={busy}
        setMode={setMode}
        setMessage={setMessage}
        setError={setError}
      />
    );
  else if (isReview)
    content = (
      <RequestReview
        vehicle={vehicle}
        estimate={estimate}
        search={search}
        submit={submit}
        busy={busy}
      />
    );
  else if (path === '/account/sign-in')
    content = (
      <>
        <p>Vous êtes connecté.</p>
        <Button onClick={() => navigate(returnTo)}>Continuer</Button>
      </>
    );
  else
    content = (
      <RequestList
        path={path}
        requests={requests}
        busy={busy}
        run={run}
        setUser={setUser}
        setRequests={setRequests}
      />
    );
  return (
    <div className="container account-page">
      <h1 {...titleProps}>
        {isReview
          ? 'Votre demande de location'
          : isReset
            ? 'Réinitialiser le mot de passe'
            : path === '/account/sign-in'
              ? 'Votre compte'
              : 'Mes demandes'}
      </h1>
      {notices}
      {content}
    </div>
  );
}
