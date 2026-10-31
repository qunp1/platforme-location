import React, { useState } from 'react';
import Questions from '../Questions.jsx';
import { EmptyState, Icon, Notice } from '../ui.jsx';
import { copy } from '../copy.js';

function Steps() {
  return (
    <div className="steps-grid">
      {copy.steps.map((step, i) => (
        <article key={step.title}>
          <span className="step-number" aria-hidden="true">
            {i + 1}
          </span>
          <h2>{step.title}</h2>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}

export default function InfoPage({ path, titleRef, Link, resultsUrl }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const questions = copy.questions.filter(
    (question) =>
      (category === 'all' || question.category === category) &&
      normalize(`${question.title} ${question.text}`).includes(normalize(query.trim())),
  );
  if (path === '/help')
    return (
      <div className="container info-page help-page">
        <h1 {...titleRef}>Vos questions, nos réponses</h1>
        <p className="lead muted">
          Vous préparez un trajet à Nador ou un séjour dans la région ? Retrouvez ici les réponses
          sur les prix, la caution, la remise du véhicule et le suivi de votre demande.
        </p>
        <label className="field help-search">
          Rechercher dans l’aide
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Caution, permis, aéroport…"
          />
        </label>
        <div className="help-categories" role="group" aria-label="Sujets de l’aide">
          {[
            ['all', 'Tout'],
            ['caution', 'Cautions & paiements'],
            ['documents', 'Documents'],
            ['assurance', 'Assurances'],
            ['arrivee', 'Aéroport & port'],
            ['demandes', 'Mes demandes'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="help-count" role="status">
          {questions.length} réponse{questions.length !== 1 ? 's' : ''}
        </p>
        {questions.length ? (
          <Questions questions={questions} />
        ) : (
          <EmptyState
            title="Aucune réponse pour cette recherche"
            action={
              <button
                className="button button-secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Voir toutes les réponses
              </button>
            }
          >
            Essayez « caution », « permis » ou « aéroport », ou écrivez à notre équipe.
          </EmptyState>
        )}
        <section className="support-contact" id="support-contact">
          <h2>Une question sur votre séjour ?</h2>
          <p>
            Précisez la voiture, vos dates et le lieu de remise souhaité pour que notre équipe
            puisse vous orienter.
          </p>
          <a className="text-link" href={`mailto:${copy.contactEmail}`}>
            {copy.contactEmail}
            <Icon name="arrow" size="small" />
          </a>
        </section>
        <Notice>
          Le suivi des demandes nécessite un service de comptes connecté. Aucun outil de messagerie
          ni paiement en ligne n’est disponible dans cette version.
        </Notice>
        <p className="agency-invite">
          <Link href="/agency">Vous êtes une agence ?</Link>
        </p>
      </div>
    );
  if (path === '/how-it-works')
    return (
      <div className="container info-page">
        <h1 {...titleRef}>Du choix à la remise des clés</h1>
        <p className="lead muted">Une demande, une réponse de l’agence, puis le paiement.</p>
        <Steps />
        <Notice>
          Vous pouvez déjà comparer les offres. Les comptes et demandes nécessitent un service
          connecté. Le paiement en ligne n’est pas disponible dans cette version.
        </Notice>
        <div className="info-bottom">
          <Link href={resultsUrl} className="button button-primary">
            Comparer les voitures
            <Icon name="arrow" />
          </Link>
          <p className="agency-invite">
            <Link href="/agency">Vous êtes une agence ?</Link>
          </p>
        </div>
      </div>
    );
  if (path === '/agency')
    return (
      <div className="container info-page partner-page">
        <div className="partner-heading">
          <h1 {...titleRef}>Votre flotte mérite d’être vue à Nador.</h1>
          <p className="lead muted">
            Présentez vos voitures aux habitants de Nador et aux voyageurs. Gardez la main sur vos
            tarifs, vos conditions et les demandes que vous acceptez.
          </p>
          <a
            href={`mailto:${copy.contactEmail}?subject=Devenir%20agence%20partenaire%20Nadorly`}
            className="button button-primary"
          >
            Contacter l’équipe
            <Icon name="arrow" />
          </a>
        </div>
        <section className="partner-benefits" aria-label="Les avantages pour votre agence">
          {[
            [
              'Une vitrine locale pour votre flotte',
              'Rassemblez vos véhicules, vos photos et vos conditions dans des offres faciles à comparer.',
            ],
            [
              'Des demandes plus claires',
              'Recevez les dates et le lieu souhaités pour vérifier la disponibilité avant de vous engager.',
            ],
            [
              'Vous décidez, à vos conditions',
              'Fixez vos prix, votre caution et vos modalités de remise. Le modèle Nadorly repose sur une commission. Les modalités du partenariat sont définies avec notre équipe.',
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <section className="partner-lead" aria-labelledby="partner-lead-heading">
          <div>
            <h2 id="partner-lead-heading">Présentez-nous votre agence.</h2>
            <p>
              Préparez votre premier échange avec l’équipe. Ce formulaire ouvre votre messagerie
              avec vos informations ; aucun message n’est envoyé automatiquement.
            </p>
          </div>
          <form
            className="account-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const body = `Agence : ${data.get('agency')}\nVille : ${data.get('city')}\nFlotte : ${data.get('fleet')} véhicules\nContact : ${data.get('contact')}\n\nJe souhaite découvrir le partenariat Nadorly.`;
              window.location.href = `mailto:${copy.contactEmail}?subject=${encodeURIComponent('Devenir agence partenaire Nadorly')}&body=${encodeURIComponent(body)}`;
            }}
          >
            <label className="field">
              Nom de l’agence
              <input name="agency" autoComplete="organization" required maxLength={100} />
            </label>
            <label className="field">
              Ville
              <input name="city" autoComplete="address-level2" required maxLength={100} />
            </label>
            <label className="field">
              Nombre de véhicules
              <input name="fleet" type="number" inputMode="numeric" min="1" max="10000" required />
            </label>
            <label className="field">
              E-mail ou téléphone de contact
              <input name="contact" required maxLength={254} />
            </label>
            <button className="button button-primary" type="submit">
              Préparer l’e-mail
              <Icon name="arrow" size="small" />
            </button>
          </form>
        </section>
        <section className="partner-contact">
          <h2>Parlons de votre agence.</h2>
          <p>
            Écrivez-nous avec le nom de votre agence, vos coordonnées et quelques mots sur votre
            flotte. Nous vous présenterons le fonctionnement et les conditions du partenariat.
          </p>
          <a
            className="text-link"
            href={`mailto:${copy.contactEmail}?subject=Devenir%20agence%20partenaire%20Nadorly`}
          >
            {copy.contactEmail}
            <Icon name="arrow" size="small" />
          </a>
        </section>
        <Notice>
          Les comptes agences sont créés manuellement par l’équipe Nadorly, après échange.
          L’inscription en libre-service n’est pas disponible dans cette version.
        </Notice>
      </div>
    );
  return (
    <div className="container info-page">
      <EmptyState
        headingAs="h1"
        titleProps={titleRef}
        title={
          path.startsWith('/account') ||
          path.startsWith('/admin') ||
          path.startsWith('/agency/') ||
          path.startsWith('/requests')
            ? 'Cette étape sera connectée prochainement'
            : 'Cette page est introuvable'
        }
        action={
          <Link href={resultsUrl} className="button button-primary">
            Explorer les voitures
          </Link>
        }
      >
        Cette version se concentre sur la recherche et la comparaison. Aucun compte, demande ou
        paiement fictif n’est créé.
      </EmptyState>
    </div>
  );
}
