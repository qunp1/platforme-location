# Nadorly components

Original system informed by the compact search controls, comparable offer information
and handover hierarchy documented in recon. Measurements are layout estimates from
1440px and 390px reference screenshots, not competitor CSS: desktop content about
1110–1250px, primary fields 48–56px, 16–24px card gaps, 14–16px body text and a compact
28–48px heading scale. Nadorly uses a 1240px content width and 4px spacing base.
Working surfaces white, page cool neutral, ivory confined to regional storytelling.
Coastal blue is the primary action; no competitors' brand colors/assets are used.

Button
  variants: primary, secondary, quiet; 48px minimum default, 40px compact
  states: hover/pressed/focus/disabled/pending; pending keeps its accessible label
  tokens: accent/on-accent, radius-md, font-sm/700; native button or actual route link
  a11y: 3px offset ring; disabled state explicit; no clickable divs
  used: all screens

Icon
  original simple line geometry; 20px normal, 16px small; currentColor
  decorative icons aria-hidden; icon-only buttons require a name

Field/SearchForm
  variants: horizontal home bar, stacked dialog; date and time separately labeled
  states: draft, validation error, submitting; never mutate applied URL on draft edit
  tokens: surface, border-input, text, 16px inputs, radius-sm
  a11y: label/description/error relationship; invalid inputs marked; focus first error
  used: S01/S03; Morocco time and same-return behavior explicit

Modal/Sheet
  variants: search, mobile filters, gallery, informational
  states: open/closed, pending form; native dialog traps focus, Escape dismisses
  dismiss button, backdrop dismissal only on actual backdrop; restore trigger focus
  tokens: pop shadow, backdrop, dialog width, radius-lg; scroll contained inside
  used: S03, S02 filters, S04 gallery

TripSummary
  concise location, date range and times; edit button opens S03
  mobile wraps readable content; no horizontal clipping; preserves applied search
  used: S02/S04

Filters
  category, transmission, daily budget; desktop immediate; mobile draft plus Apply
  active chips can remove individual filters; reset retains the trip
  filter count is computed; sort price is full quoted trip total
  used: S02

OfferCard
  variants: compact home grid, detailed results row
  consistent photo ratio; category, model, fictional agency, specifications
  trip total primary; daily rate/delivery, refundable deposit and mileage visible
  pickup location and handover separate; no fake reviews, guarantees or urgency
  states: ready, missing photo fallback; catalog supplies loading/error/empty states
  used: S01/S02

Quote
  days × daily rate, mandatory handover, trip total; deposit separate
  states: valid, unsupported pickup, invalid trip; no checkout before acceptance
  daily period rule visible; values derived from domain quote, never duplicated
  used: S04 and future S07/S10

Gallery
  primary vehicle image plus explicit alternative views; no fake views created by crops
  current media are labeled model illustrations; one photo is honestly shown as one
  click opens full-image viewer, accessible close and Escape; photo fallback
  used: S04

Conditions/Agency/Pickup
  structured definition lists; agency-specific deposit, mileage, age, experience,
  coverage/excess and sample cancellation; handover method and fee disclosed
  undefined real methods/instructions explicitly awaiting agency confirmation
  used: S02 highlights / S04 full details

CatalogState
  skeleton: noninteractive, aria-busy; status text announces loading
  empty: preserve trip, reset relevant filters; error: alert and retry
  invalid offer: useful route back; unavailable location: edit pickup or view alternatives
  used: S01/S02/S04

StatusTimeline/Calendar/Account controls
  reserved for future transaction slice; specifications remain in recon
  not presented as working booking or authentication controls in this redesign

Design route: /design renders primitives and loading/empty/error/long-name examples.
It is a developer review surface, not part of the customer navigation.
French dictionary structured for translation; logical styles support RTL direction,
but full English/Arabic copy is not claimed complete.
