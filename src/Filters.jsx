import React, { useId, useState } from 'react';
import { categories, defaultFilters } from './domain.js';
import { Button } from './ui.jsx';
export function filterCount(filters) {
  return ['gear', 'category', 'fuel', 'seats', 'max'].filter(
    (key) => filters[key] !== defaultFilters[key],
  ).length;
}
const groups = [
  ['category', 'Catégorie', [['all', 'Toutes les voitures'], ...Object.entries(categories)]],
  [
    'gear',
    'Boîte de vitesses',
    [
      ['all', 'Toutes'],
      ['manual', 'Manuelle'],
      ['auto', 'Automatique'],
    ],
  ],
  [
    'fuel',
    'Carburant',
    [
      ['all', 'Tous'],
      ['diesel', 'Diesel'],
      ['essence', 'Essence'],
    ],
  ],
  [
    'seats',
    'Nombre de places',
    [
      ['all', 'Toutes'],
      ['5', '5 places'],
      ['7', '7 places'],
    ],
  ],
];
export function FilterControls({ filters, setFilters }) {
  const groupId = useId();
  return (
    <div className="filter-controls">
      {groups.map(([key, title, options]) => (
        <fieldset key={key}>
          <legend id={`${groupId}-${key}`}>{title}</legend>
          <div className="filter-pills" role="group" aria-labelledby={`${groupId}-${key}`}>
            {options.map(([value, label]) => (
              <button
                type="button"
                className="filter-pill"
                key={value}
                aria-pressed={filters[key] === value}
                onClick={() => setFilters({ ...filters, [key]: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <label className="field budget-field">
        Budget par jour<strong>{filters.max} MAD maximum</strong>
        <input
          type="range"
          min="200"
          max="700"
          step="25"
          value={filters.max}
          onChange={(e) => setFilters({ ...filters, max: Number(e.target.value) })}
        />
        <span className="range-label">
          <span>200 MAD</span>
          <span>700 MAD</span>
        </span>
      </label>
      <p className="small muted">La caution reste séparée du prix de location.</p>
    </div>
  );
}
export function MobileFilters({ initial, onApply }) {
  const [draft, setDraft] = useState(initial);
  return (
    <>
      <FilterControls filters={draft} setFilters={setDraft} />
      <div className="modal-actions">
        <Button variant="quiet" onClick={() => setDraft({ ...defaultFilters, sort: initial.sort })}>
          Tout effacer
        </Button>
        <Button onClick={() => onApply(draft)}>Afficher les résultats</Button>
      </div>
    </>
  );
}
