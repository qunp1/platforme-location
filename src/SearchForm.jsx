import React, { useEffect, useId, useRef, useState } from 'react';
import usePickerPresence from './usePickerPresence.js';
import { prettyDate, rentalDays, validateSearch } from './domain.js';
import { Button, Icon } from './ui.jsx';
const places = [
  { value: 'office', title: 'Nador centre', description: 'Retrait en agence locale', icon: 'pin' },
  {
    value: 'airport',
    title: 'Aéroport Nador-Al Aroui',
    description: 'Remise directe au terminal',
    icon: 'plane',
  },
  {
    value: 'port',
    title: 'Port de Beni Ensar',
    description: 'Accueil à la sortie du ferry',
    icon: 'anchor',
  },
];
const iso = (date) => date.toISOString().slice(0, 10);
const fromISO = (value) => new Date(`${value}T12:00:00Z`);
const monthStart = (value) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1, 12));
const shiftMonth = (value, delta) =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + delta, 1, 12));
const dayName = (value) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'UTC' }).format(fromISO(value));
function Calendar({ draft, setDraft, close, today }) {
  const [month, setMonth] = useState(() =>
    monthStart(fromISO(draft.start && draft.start >= today ? draft.start : today)),
  );
  const [focusDay, setFocusDay] = useState(
    draft.start && draft.start >= today ? draft.start : today,
  );
  const root = useRef(null),
    moveFocus = useRef(false);
  const [exactMode, setExactMode] = useState(false);
  const duration = rentalDays(draft.start, draft.end);
  function chooseDuration(days) {
    const start =
      (draft.start >= today ? draft.start : '') ||
      iso(new Date(fromISO(today).getTime() + 86400000));
    const end = iso(new Date(fromISO(start).getTime() + days * 86400000));
    setDraft((previous) => ({ ...previous, start, end }));
    setMonth(monthStart(fromISO(start)));
    setFocusDay(start);
    setExactMode(false);
  }
  useEffect(() => {
    if (moveFocus.current) {
      root.current?.querySelector(`[data-day="${focusDay}"]`)?.focus();
      moveFocus.current = false;
    }
  }, [focusDay, month]);
  function select(value) {
    setExactMode(false);
    setDraft((previous) =>
      !previous.start || previous.end || value <= previous.start
        ? { ...previous, start: value, end: '' }
        : { ...previous, end: value },
    );
    setFocusDay(value);
  }
  function keyDay(event, value) {
    const next = fromISO(value),
      offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in offsets) next.setUTCDate(next.getUTCDate() + offsets[event.key]);
    else if (event.key === 'Home')
      next.setUTCDate(next.getUTCDate() - ((next.getUTCDay() + 6) % 7));
    else if (event.key === 'End')
      next.setUTCDate(next.getUTCDate() + 6 - ((next.getUTCDay() + 6) % 7));
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const destination = shiftMonth(next, event.key === 'PageUp' ? -1 : 1);
      const last = new Date(
        Date.UTC(destination.getUTCFullYear(), destination.getUTCMonth() + 1, 0),
      ).getUTCDate();
      destination.setUTCDate(Math.min(next.getUTCDate(), last));
      next.setTime(destination.getTime());
    } else return;
    event.preventDefault();
    const valueNext = iso(next) < today ? today : iso(next);
    moveFocus.current = true;
    setFocusDay(valueNext);
    setMonth(monthStart(fromISO(valueNext)));
  }
  function navigate(delta) {
    const next = shiftMonth(month, delta);
    setMonth(next);
    setFocusDay(iso(next) < today ? today : iso(next));
  }
  return (
    <div ref={root} className="range-calendar">
      <div className="calendar-heading">
        <div>
          <h3>Dates de location</h3>
          <p aria-live="polite">
            {draft.end
              ? 'Dates sélectionnées'
              : !draft.start
                ? 'Choisissez votre date de départ'
                : 'Choisissez votre date de retour'}
          </p>
        </div>
        <div className="calendar-navigation">
          <button
            className="calendar-close"
            type="button"
            aria-label="Fermer le calendrier"
            onClick={close}
          >
            <Icon name="close" />
          </button>
          <button
            type="button"
            aria-label="Mois précédent"
            disabled={iso(month) <= today.slice(0, 7) + '-01'}
            onClick={() => navigate(-1)}
          >
            <Icon name="back" />
          </button>
          <button type="button" aria-label="Mois suivant" onClick={() => navigate(1)}>
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      <div className={`calendar-months ${draft.end ? 'has-range' : ''}`}>
        {[0, 1].map((offset) => {
          const current = shiftMonth(month, offset),
            year = current.getUTCFullYear(),
            m = current.getUTCMonth(),
            blanks = (current.getUTCDay() + 6) % 7,
            count = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
          return (
            <section
              className="calendar-month"
              key={offset}
              aria-label={current.toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            >
              <h4>
                {current.toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </h4>
              <div className="calendar-weekdays" aria-hidden="true">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <span key={index}>{day}</span>
                ))}
              </div>
              <div className="calendar-days">
                {Array.from({ length: blanks }, (_, index) => (
                  <span key={`empty-${index}`} />
                ))}
                {Array.from({ length: count }, (_, index) => {
                  const value = iso(new Date(Date.UTC(year, m, index + 1, 12))),
                    start = value === draft.start,
                    end = value === draft.end,
                    between = draft.start && draft.end && value > draft.start && value < draft.end;
                  return (
                    <div
                      key={value}
                      className={`calendar-day ${between ? 'in-range' : ''} ${start ? 'range-start' : ''} ${end ? 'range-end' : ''}`}
                    >
                      <button
                        type="button"
                        data-day={value}
                        aria-label={dayName(value)}
                        aria-pressed={start || end}
                        aria-current={value === today ? 'date' : undefined}
                        disabled={value < today}
                        tabIndex={value === focusDay ? 0 : -1}
                        onFocus={() => setFocusDay(value)}
                        onKeyDown={(event) => keyDay(event, value)}
                        onClick={() => select(value)}
                      >
                        {index + 1}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="calendar-footer">
        <div className="duration-pills" aria-label="Durée de location">
          <button
            type="button"
            aria-pressed={exactMode || ![3, 5, 7, 14].includes(duration)}
            onClick={() => setExactMode(true)}
          >
            Dates exactes
          </button>
          {[3, 5, 7, 14].map((days) => (
            <button
              type="button"
              key={days}
              aria-pressed={!exactMode && duration === days}
              onClick={() => chooseDuration(days)}
            >
              {days} jours
            </button>
          ))}
        </div>
        <div className="calendar-actions">
          <button
            type="button"
            className="clear-dates"
            onClick={() => {
              setDraft((previous) => ({ ...previous, start: '', end: '' }));
              setExactMode(false);
            }}
          >
            Effacer les dates
          </button>
          <Button type="button" disabled={Boolean(validateSearch(draft))} onClick={close}>
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
}
export default function SearchForm({
  search,
  onApply,
  horizontal = false,
  label = 'Rechercher',
  initialPicker = null,
}) {
  const [draft, setDraft] = useState(search),
    [active, setActive] = useState(null),
    [error, setError] = useState('');
  const root = useRef(null),
    placeTrigger = useRef(null),
    dateTrigger = useRef(null),
    panel = useRef(null),
    id = useId();
  const shown = usePickerPresence(active, panel);
  useEffect(() => {
    if (initialPicker) setActive(initialPicker);
  }, [initialPicker]);
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Casablanca' }).format(
    new Date(),
  );
  const exampleStart = fromISO(today);
  exampleStart.setUTCDate(exampleStart.getUTCDate() + 1);
  const exampleEnd = new Date(exampleStart);
  exampleEnd.setUTCDate(exampleEnd.getUTCDate() + 3);
  const exampleFormat = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
  const exampleRange = `Ex. ${exampleFormat.format(exampleStart)} – ${exampleFormat.format(exampleEnd)}`;
  const close = () => {
    setActive(null);
    (active === 'place' ? placeTrigger : dateTrigger).current?.focus();
  };
  useEffect(() => {
    if (!active) return;
    panel.current?.focus({ preventScroll: true });
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setActive(null);
    };
    const escape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setActive(null);
        (active === 'place' ? placeTrigger : dateTrigger).current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape, true);
    };
  }, [active]);
  function submit(event) {
    event.preventDefault();
    const message = validateSearch(draft);
    if (message) {
      setError(message);
      setActive('dates');
      return;
    }
    onApply(draft);
  }
  const selected = places.find((place) => place.value === draft.location);
  return (
    <form
      ref={root}
      className={`search-form booking-search ${horizontal ? 'search-horizontal search-simple' : 'search-stacked'}`}
      onSubmit={submit}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          setActive(null);
      }}
    >
      <div className="booking-pill">
        <button
          type="button"
          ref={placeTrigger}
          className="booking-cell place-trigger"
          aria-label={`Lieu de remise : ${selected?.title || 'Choisir un lieu'}`}
          aria-expanded={active === 'place'}
          aria-controls={`${id}-place`}
          onClick={() => setActive(active === 'place' ? null : 'place')}
        >
          <Icon name="pin" />
          <span className="booking-field-copy">
            <span>Lieu de remise</span>
            <strong>{selected?.title || 'Choisir un lieu'}</strong>
          </span>
          <Icon name="chevron" className="icon booking-chevron" size="small" />
        </button>
        <span className="booking-divider" aria-hidden="true" />
        <button
          type="button"
          ref={dateTrigger}
          className="booking-cell date-trigger"
          aria-label="Dates de location"
          aria-expanded={active === 'dates'}
          aria-controls={`${id}-dates`}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => setActive(active === 'dates' ? null : 'dates')}
        >
          <Icon name="calendar" />
          <span className="booking-field-copy">
            <span>Dates</span>
            <strong className={!draft.start ? 'empty-dates' : undefined}>
              {draft.start ? (
                `${prettyDate(draft.start)} – ${draft.end ? prettyDate(draft.end) : 'Retour'}`
              ) : (
                <>
                  <span className="sr-only">Ajouter des dates. </span>
                  {exampleRange}
                </>
              )}
            </strong>
          </span>
        </button>
        <Button type="submit" className="pill-submit" aria-label={label}>
          <Icon name="search" strokeWidth="2.5" />
          <span>{label}</span>
        </Button>
      </div>
      {shown && (
        <div
          ref={panel}
          inert={!active}
          aria-hidden={!active}
          tabIndex={-1}
          role="region"
          aria-label={
            shown === 'place' ? 'Choisir un lieu de remise' : 'Choisir les dates de location'
          }
          id={`${id}-${shown}`}
          className={`booking-popover ${shown === 'place' ? 'place-popover' : 'date-popover'}`}
        >
          {shown === 'place' ? (
            places.map((place) => (
              <button
                type="button"
                key={place.value}
                className="place-option"
                aria-pressed={draft.location === place.value}
                onClick={() => {
                  setDraft((previous) => ({ ...previous, location: place.value }));
                  setError('');
                  setActive('dates');
                }}
              >
                <span className="place-icon">
                  <Icon name={place.icon} />
                </span>
                <span>
                  <strong>{place.title}</strong>
                  <small>{place.description}</small>
                </span>
                {draft.location === place.value && <Icon name="check" size="small" />}
              </button>
            ))
          ) : (
            <Calendar
              draft={draft}
              today={today}
              setDraft={(updater) => {
                setDraft(updater);
                setError('');
              }}
              close={close}
            />
          )}
        </div>
      )}
      {error && (
        <p className="form-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
