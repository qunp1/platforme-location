import { browserUrl } from '../navigation.js';
import React from 'react';
import { api } from '../api.js';
import { Button } from '../ui.jsx';

export default function PasswordResetForms({ run, setMessage, busy }) {
  return (
    <>
      <p>Recevez un code par e-mail, puis choisissez votre nouveau mot de passe.</p>
      <form
        className="account-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          run(async () => {
            const d = await api('/auth/recover', { email: f.get('email') });
            setMessage(d.message);
          });
        }}
      >
        <label className="field">
          E-mail
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <Button pending={busy}>Recevoir un code</Button>
      </form>
      <form
        className="account-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          run(async () => {
            const d = await api('/auth/reset-password', Object.fromEntries(f));
            setMessage(d.message);
          });
        }}
      >
        <label className="field">
          E-mail du compte
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          Code reçu
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,10}"
            required
          />
        </label>
        <label className="field">
          Nouveau mot de passe
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        <Button pending={busy}>Modifier le mot de passe</Button>
      </form>
      <a href={browserUrl('/account/sign-in')}>Revenir à la connexion</a>
    </>
  );
}
