# Nadorly design system

## Direction

Mediterranean Coastal Editorial × Modern Tactile Mobility. The October 27, 2026
brief and subsequent browser corrections define the current direction. Original
brand artwork and pill controls take precedence over the earlier serif-wordmark
and soft-rectangle experiment. Serve Nador's
residents and visitors equally. The marketplace uses local agencies and a
commission model; the interface must distinguish a request from a confirmed rental.

The original sans-serif SVG wordmarks and arrival-gate symbol remain the brand. The geographic signature is “Nador & Oriental.” Use existing coastal
photography and real model photographs, with their original illustration credits.
No abstract renders, decorative gradients, translucent content cards or invented proof. The header and floating mobile dock use explicitly requested frosted surfaces with opaque accessibility fallbacks.

## Color and surfaces

- Canvas `#FAF7F2`, white card surfaces, warm borders `#E6E2D8`.
- Maritime navy `#13293D` for structure, text and selected navigation.
- Terracotta `#C85A32` for highlights. Small white-text actions use its accessible
  shade `#BF4D2B`, with `#A94023` hover; small colored links use `#B34424`.
- Azure `#134074`, pale azure `#8DA9C4`, for maritime wayfinding.
- Olive `#2D6A4F` for confirmed/completed states, amber sand `#D4A373` as a
  pending accent, and rust `#9B2226` for cancelled/declined/expired states.
  Status text uses darker ink on pale backgrounds and always names the state.
- Input outlines `#81919C`; body slate `#475569`. Keep visible focus on every control.

Canonical presentation values live in `replica/design/tokens.json`; regenerate
`tokens.css` with `pnpm tokens`. The brand layer exposes the semantic
`--color-terracotta`, `--color-navy`, `--color-azure`, `--color-canvas` and
`--color-surface` names alongside existing tokens.

## Typography

`index.html` loads `assets/fonts/fonts.css`. Both typefaces are hosted locally
with OFL licenses; no external font service is required.

Instrument Serif regular/italic owns travel and information headlines. Plus Jakarta Sans 400–800 owns vehicle names, operational page titles,
forms, controls, captions and tabular prices. Use optical hierarchy through size,
weight and leading. Do not convert transactional data into display serif text.
Headlines use restrained negative tracking; paragraphs remain comfortably spaced.

## Tactile geometry

Action buttons and desktop search docks use fully rounded pill corners. Inputs
use 12px corners; cards use 16–20px; mobile date sheets use
24px top corners. Pills are reserved for compact metadata and selection indicators.
Resting cards use `0 1px 3px rgba(11,37,69,.04), 0 6px 16px rgba(11,37,69,.05)`;
hover elevation uses `0 8px 24px rgba(11,37,69,.09), 0 2px 6px rgba(11,37,69,.04)`.
Action feedback begins on press, with a small 0.985 scale and a quick return.

Primary phone controls have 48px targets and 16px outer thumb margins. At the
legacy 320px width, seven calendar columns may be narrower while retaining 48px
height. No zoom restriction or horizontal page overflow is acceptable.

## Navigation and composition

The header is a slightly translucent, blurred sand surface with a subtle border. Desktop stays pinned; mobile hides on deliberate downward scrolling and returns on upward scrolling. It shows the original
brand artwork, geographic pill, current navigation and booking portal; “FR · MAD” describes the current
language/currency and is not a simulated switcher. Mobile navigation offers
Accueil, Voitures, Demandes and Aide in an edge-to-edge navy bottom dock with safe-area padding. The selected destination has a terracotta top marker, stronger icon and cream label. Vehicle detail pages omit this navigation to keep a single booking action at the bottom. No hamburger menu duplicates the dock on phones. Less frequent information and
agency destinations remain available in the footer.

The homepage uses the coastal photograph as an edge-to-edge hero background at every viewport, with an accessible navy scrim and constrained content. The search dock owns its own grid
row, with pin/calendar icons, an expanding chevron, hover states and a clearly
marked illustrative date range that does not select a trip. Factual transparency
statements lead into vehicle offers, agency-approval steps, arrival guides and FAQ. The fleet heading uses the UI sans-serif; category controls live in the catalogue. The compact footer has brand, rental and agency columns; arrival guidance stays in the main content. No fabricated agency totals or cancellation promises.

The catalogue has a sticky trip summary, a scrollable sticky sidebar from 1024px,
an aligned mobile filter/sort toolbar and the existing draft/apply filter dialog.
Transmission stays in the filter dialog instead of being duplicated above results.
Its header and apply action remain visible while criteria scroll. Photo/details/
price cards stay horizontal on regular tablets and desktops; a type-relative
container query switches them to one column when enlarged text needs more room.

Vehicle pages retain a framed photo, specifications, condition grid and sticky
booking summary. On phones the photo uses a 4:3 neutral frame with 12px corners and an icon-only expand affordance. The whole image stays clickable with an accessible name. Specifications form a regular 2×2 grid. The redundant back-to-offers breadcrumb is removed. On phones the request action sits at the viewport bottom on a white surface with a subtle top shadow and safe-area padding. The dock and
request bar clear away while a picker is open. Cards keep their compact presentation on the homepage; the extra deposit/fuel
caption and the vehicle gallery caption are removed. Photo credits and gallery
disclosure remain available. Arrival guides use two outlined-CTA feature cards,
and FAQs are centered at a maximum 768px with bottom rules and smooth disclosure.

## Prices and product truth

Detailed comparisons and booking summaries show the daily rate, chosen duration
total, handover fee, separate deposit and fuel policy from the same quote/data objects. No dates means a daily price, never a
silently assumed trip. Do not claim unlimited mileage or cash deposits unless the
offer actually provides them. The deposit method is visible beside the deposit.

Rentals are calendar-day based. Preserve custom date/location pickers, duration
shortcuts, keyboard calendar movement, clear/validate, outside dismissal, Escape
and URL state. Do not add pickup hours, hotel delivery or priced extras without
extending the domain and server validation as a separate functionality change.

Agency/vehicle verification requires an explicit true flag. Ratings, contact
numbers, extra gallery angles and partner credentials require real data. Model
photos retain their illustration captions; credits stay in a collapsed footer
section. The footer discloses the demonstration catalogue on every route.

## Accounts, support and partner pages

Account/request screens share the same tactile forms and price hierarchy. The
status timeline reflects stored states: requested, awaiting payment, confirmed,
completed. Terminal statuses are labeled without a misleading progression.
An existing selected request can print a recap using the browser; this is not an
invented voucher service. Account loading, configuration and failure states remain truthful.

Help provides accent-insensitive search and topic filters, recovery from no
matches, contact email and airport/port guidance. Partner onboarding stays manual;
the agency form prepares an email in the visitor's mail application and clearly
states that it does not submit or store a lead automatically.

Existing English routes remain canonical. French aliases `/voitures`, `/compte`,
`/aide`, `/agences` and `/comment-ca-marche` retain query state and map to the same
screens. Request payloads, server validation and authentication are unchanged.

## Motion and accessibility

Use brief, purposeful feedback, not decorative section reveals or pinned stories.
FAQ expansion retargets from current height over 200ms; route entry is a 150ms
4px translation; dialogs use a 180ms entrance and 120ms dismissal; mobile date
panels use an interruptible 200ms entrance/exit. Filter changes do not replay the
route entrance. Fixed mobile chrome stays outside transformed ancestors.

Reduced motion removes travel and settles state immediately. Hover motion is
limited to fine pointers. Native dialog focus, focus restoration, logical headings,
a focusable skip destination and current-page indicators remain available.

See `src/styles/README.md` for stylesheet ownership and
`docs/coastal-editorial-brief.md` for scope and operational dependencies.

## Footer and current corrections

Use four desktop columns: brand, location, arrival and agencies. Keep license credits
in one closed disclosure. The demonstration disclaimer occupies a quiet banner at
the bottom, separate from the navigation grid. Current browser-comment corrections
supersede older audit snapshots in docs.

On mobile vehicle detail and /requests/new pages, replace the full site footer with a centered micro-footer (copyright and the existing Aide link). Keep the full footer on home, catalogue and desktop. The micro-footer reserves space for the sticky action without duplicating body bottom spacing.

Latest polish: catalogue categories are selected only in the sidebar/mobile filter dialog; the duplicate quick category row and price-status badge are removed. The sort trigger sizes to its label. Both booking actions use pill corners. Sticky prices keep the numeric amount and MAD as separate non-breaking units. Insurance disclosure shares the FAQ animation and reduced-motion behavior. Footer clearance follows the actual sticky bar height, while the micro-footer itself uses compact padding. Arrival guides remain on home and are removed from Help.

At the top of the landing page, the hero photograph extends behind the sticky header. A blurred maritime tint and reversed brand/navigation integrate the masthead with the coast. Beyond 24px of scrolling, the header returns to its usual cream surface; other pages always use the standard header. Mobile hide/reveal, keyboard focus and reduced-transparency/motion fallbacks are preserved.
