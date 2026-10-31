# Nadorly coastal editorial redesign

The October 27 brief supersedes the previous pill-button and sans-only direction.
The product remains an agency marketplace with commission, manual partner onboarding,
calendar-day pricing, agency approval and the existing request API contract.

## Design decisions

- Instrument Serif gives travel and information headlines an editorial voice; locally
  hosted Plus Jakarta Sans keeps controls, vehicle names and prices precise.
- Maritime navy, sand and terracotta remain the foundation. Azure supports wayfinding;
  olive, sand amber and rust communicate real request states.
- Solid navigation, 12px action corners, 16–20px cards and 24px mobile sheets.
- Native scrolling, immediate press feedback, brief interruptible transitions and a
  reduced-motion alternative. No decorative pinned scrolling or parallax.
- The Taste direction is “The page is the object,” seed 785520278. Nador's airport,
  ferry and city handovers become a readable travel itinerary: choose a pickup,
  compare the complete stay, then request agency approval. The working search is
  the live element. Explicit product composition and tactile tokens take precedence
  over the direction sheet's unrelated invitation-card and pinned-story suggestions.

## Content and data boundaries

The current catalogue is demonstration data. Only explicit verification flags may
produce verification marks. Do not invent agency counts, ratings, addresses, phone
numbers, pickup times, free cancellation, unlimited mileage or payment-at-delivery
promises. Show the actual deposit method, fuel policy and handover fee of each offer.

New operational capabilities need a separate functionality implementation: translated
content, exchange-rate conversion, WhatsApp support numbers, hotel delivery inventory,
hour-based rentals, extras and their server pricing, flight tracking, additional
identity collection, verified partner credentials, agency lead storage, cancellation
and voucher endpoints. Their controls must not be simulated in a visual release.

## Screen coverage

Home and travel guides; catalogue and filters; vehicle and booking summary; request
review; sign-in/reset/unavailable account states; request status records; how it
works, searchable help and partner contact; footer and mobile navigation; loading,
empty, error, missing-image, missing-route and reduced-motion states.

Keep existing English routes and query semantics. Add the requested French entry
aliases without changing request payloads or price calculations. Validate at phone,
tablet and desktop widths, 200% text, keyboard and synthesized touch.
