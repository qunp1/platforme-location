import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './ui.jsx';
export default function SortControl({ value, onChange, hasDates }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null),
    trigger = useRef(null);
  const options = [
    ['price', hasDates ? 'Prix total croissant' : 'Prix par jour croissant'],
    ['price-desc', hasDates ? 'Prix total décroissant' : 'Prix par jour décroissant'],
  ];
  useEffect(() => {
    if (!open) return;
    const outside = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return (
    <div
      ref={root}
      className="sort-field custom-sort"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpen(false);
          trigger.current.focus();
          e.stopPropagation();
        }
      }}
    >
      <span>Trier par</span>
      <button
        ref={trigger}
        type="button"
        className="sort-select"
        aria-label={`Trier par : ${options.find(([key]) => key === value)?.[1]}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {options.find(([key]) => key === value)?.[1]}
        <Icon name="chevron" size="small" />
      </button>
      {open && (
        <div className="sort-options" aria-label="Ordre des offres">
          {options.map(([key, text]) => (
            <button
              type="button"
              key={key}
              aria-pressed={value === key}
              onClick={() => {
                setOpen(false);
                onChange(key);
                trigger.current?.focus();
              }}
            >
              {text}
              {key === value && <Icon name="check" size="small" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
