import { browserUrl } from './navigation.js';
import SearchForm from './SearchForm.jsx';
import React, { useState } from 'react';
import { Button, Icon, Modal, Notice, EmptyState, Skeletons, CarPhoto } from './ui.jsx';
export default function DesignPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="container design-page">
      <a className="text-link" href={browserUrl('/')}>
        Retour au site
      </a>
      <h1>Nadorly · composants</h1>
      <p>Primitives, contrastes et états du parcours client.</p>
      <section>
        <h2>Actions et dialogue</h2>
        <div className="design-row">
          <Button onClick={() => setOpen(true)}>
            Modifier la recherche
            <Icon name="search" />
          </Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="quiet">Discret</Button>
          <Button disabled>Indisponible</Button>
          <Button pending>Chargement…</Button>
        </div>
      </section>
      <section>
        <h2>Champs</h2>
        <SearchForm search={{ location: 'office', start: '', end: '' }} onApply={() => {}} />
      </section>
      <section>
        <h2>Messages</h2>
        <Notice>Retour au même endroit.</Notice>
        <Notice tone="error" role="alert">
          Les offres n’ont pas pu être chargées. Réessayez.
        </Notice>
        <Notice tone="success">Les critères ont été appliqués.</Notice>
      </section>
      <section>
        <h2>Photos et noms longs</h2>
        <h3>Agence de location automobile du littoral de Nador et du Rif</h3>
        <CarPhoto name="Véhicule de démonstration" />
      </section>
      <section>
        <h2>Chargement</h2>
        <Skeletons />
      </section>
      <section>
        <h2>Aucune correspondance</h2>
        <EmptyState
          title="Aucune voiture pour ces critères"
          action={<Button variant="secondary">Effacer les filtres</Button>}
        >
          Conservez vos dates et essayez une autre catégorie.
        </EmptyState>
      </section>
      {open && (
        <Modal title="Modifier votre recherche" onClose={() => setOpen(false)}>
          <p>Le dialogue utilise le focus natif, la touche Échap et le retour au déclencheur.</p>
          <Button onClick={() => setOpen(false)}>Terminer</Button>
        </Modal>
      )}
    </main>
  );
}
