import React from 'react';
import { Button, Notice } from '../ui.jsx';

export default function CatalogError({ retry }) {
  return (
    <div className="catalog-error">
      <Notice tone="error" role="alert">
        Les offres n’ont pas pu être chargées. Votre recherche est conservée.
      </Notice>
      <Button variant="secondary" onClick={retry}>
        Réessayer
      </Button>
    </div>
  );
}
