# UI polish audit — 27 October 2026

The existing Nadorly design system remains the reference: original SVG brand, Plus Jakarta Sans UI, Instrument Serif travel headline, maritime navy and terracotta. The user's latest browser annotations take precedence over generic skill style rules.

## Implemented

- Coastal hero photograph is an edge-to-edge background on desktop and mobile. Constrained copy/search sit above a navy scrim; there is no separate photo card or search/image collision.
- Header has a translucent, blurred sand surface. On phones it slides away on deliberate downward scrolling and returns upward; desktop stays pinned. The 250ms transform transition reverses from its current position. Keyboard focus and reduced motion reveal immediately.
- Floating mobile dock uses a blurred surface, safe-area margins, compact navy selected-icon background and persistent labels. Targets remain at least 48px high.
- Home category filters removed; filtering remains in the catalogue. Fleet heading uses the UI sans-serif.
- Footer arrival column removed and spacing reduced. Brand, rental and agency destinations remain; credits stay collapsed and the demo disclaimer remains visible.

## Break UI: rendered fields and boundaries

| Field | Source | Limit exercised |
| --- | --- | --- |
| Vehicle name / agency | `src/data.js`, asynchronous `catalog.list` boundary | No enforced display length; long French and unbroken model/agency names, Arabic agency names |
| Price / deposit | Integer MAD minor-unit fields, existing quote formatter | Large positive amounts; no amount truncation |
| Photo | Catalog image field | Missing image through existing fallback |
| Fleet | Catalog array | Empty, one and 1,000 rows; featured subset remains capped at six |
| Navigation / controls | Static French copy and routes | 320px width and 200% root text size |

## What broke and what changed

| Severity | Field / trigger | Symptom | Fix |
| --- | --- | --- | --- |
| Broken | Empty featured fleet | Fallback link referenced undefined `resultsUrl`, crashing the section | Build the destination with the existing route helper |
| Broken | Large price at 320px / 200% text | Amount extended past the card and viewport | Permit full amount wrapping; let the action move to a new row |
| Ugly | Dock labels at 200% text | Adjacent labels collided | Constrain each label to its track and allow wrapping |
| Fragile | Loading catalogue | Count and skeleton announced two simultaneous status messages | Keep a single status during loading |
| Fragile | Hidden header + resize within mobile breakpoint | Header remained hidden | Reset on resize |
| Fragile | Overlay opens without scrolling | Header remained hidden | Observe actual dialog/picker opening and reveal immediately |
| Fragile | Touch focus on brand | Focus could pin header indefinitely | Reserve persistent focus reveal for keyboard-visible focus |

Long/unbroken names, Arabic text, missing media, singular/empty fleets and the 1,000-row fixture retained readable layouts. There was no horizontal page overflow in the tested matrix. The fixture does not assert real-world fleet sizes or commercial prices.

## Review reconciliation

Fresh-context and user-supplied external reviews were applied. Resize, reactive overlay opening, zero-distance ticks, bottom overscroll and same-path URL changes were addressed. Desktop scroll callbacks return before scheduling work. CSS was absent from the exported review artifact, but exists in `editorial.css` and is verified in browser tests. The ref is attached to an unconditional header before its effect runs; scrolling belongs to the window in the current layout. Keyboard focus triggers immediate CSS visibility and state reset; hidden links are not removed from keyboard navigation.

Gemini CLI was unavailable. The user supplied the external review manually; no external CLI was invoked.

## Verification and limits

Chromium desktop and touch emulation, keyboard navigation, reduced motion, widths 320/614/1110/1920, 200% text, empty/one/worst/1,000-row fixtures, production build and unit/browser regression tests. Missing-photo fallback and desktop pinned-header behavior were checked. Physical iOS/Android hardware was not available; real-device blur/scroll feel remains a device check.

Hallmark's mechanical sweep was run. Its renderer could not run because Puppeteer is not installed; Playwright screenshots supplied visual verification instead. Remaining generic flags concern the intentionally preserved italic full hero sentence, date-range punctuation, black/white print styling, established spacing, and explicitly requested frosted navigation. This is not reported as a clean Hallmark linter pass.

The dev-only fixture switch remains available at http://127.0.0.1:5175/?data=demo (Demo data / Worst case / Empty / One / 1,000 rows). Fixtures and controls are excluded from the production bundle and absent from the normal homepage.

Latest checks: 23 unit tests passed; 23 focused browser cases passed (one desktop skip for the touch-only case); 29 broader customer/route/motion regression cases passed (one desktop skip for mobile navigation). Production build and formatting pass. The initial full run exposed loading-state races; their fixes were verified by the subsequent regression runs.

Final production preview: six axe AA scans across home, catalogue and vehicle detail at 390px and 1110px reported zero violations, zero horizontal overflow and no development controls.
