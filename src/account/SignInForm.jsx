import React from 'react';
import { Button } from '../ui.jsx';

export default function SignInForm({
  isReview,
  authenticate,
  mode,
  busy,
  setMode,
  setMessage,
  setError,
}) {
  return (
    <>
      <p>
        {isReview
          ? 'Connectez-vous pour préparer votre demande. Votre voiture et vos dates sont conservées.'
          : 'Connectez-vous pour retrouver vos demandes de location.'}
      </p>
      <form className="account-form" onSubmit={authenticate}>
        <label className="field">
          E-mail
          <input name="email" type="email" maxLength={254} autoComplete="email" required />
        </label>
        <label className="field">
          Mot de passe
          <input
            name="password"
            type="password"
            minLength={12}
            maxLength={128}
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            required
          />
        </label>
        <p className="small muted">12 caractères minimum.</p>
        <Button pending={busy}>{mode === 'sign-up' ? 'Créer mon compte' : 'Me connecter'}</Button>
      </form>
      <Button
        variant="quiet"
        onClick={() => {
          setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
          setMessage('');
          setError('');
        }}
      >
        {mode === 'sign-in' ? 'Créer un compte' : 'J’ai déjà un compte'}
      </Button>
      <a href="/account/reset-password">Mot de passe oublié</a>
    </>
  );
}
