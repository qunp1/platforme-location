import React from 'react';
import './catalogStress.css';

export default function CatalogStress() {
  const params = new URLSearchParams(location.search);
  const mode = params.get('data') || 'demo';
  if (!params.has('data')) return null;
  return (
    <fieldset className="catalog-stress">
      <legend>UI QA · local development</legend>
      <div>
        {[
          ['demo', 'Demo data'],
          ['worst', 'Worst case'],
          ['empty', 'Empty'],
          ['one', 'One'],
          ['many', '1,000 rows'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => {
              const url = new URL(location.href);
              value === 'demo'
                ? url.searchParams.delete('data')
                : url.searchParams.set('data', value);
              location.href = url.href;
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
