# Browser feedback corrections

These corrections supersede the earlier serif-wordmark, soft-rectangle and fleet-rail
decisions. `DESIGN.md` records the current design contract.

| Area | Result |
| --- | --- |
| Mobile header | Hamburger and duplicate mobile menu removed; the bottom dock owns mobile navigation |
| Branding | Original SVG wordmarks restored in header/footer; geographic tag restored as a pill |
| Actions | Pill-shaped CTAs, booking portal, search dock and search fields restored |
| Hero | Explicit desktop grid separates text/image from the search row; padded image frame is 16:10 with 16px corners. On phones, the photo is the hero background |
| Search fields | Pin/calendar icons, downward location chevron, hover/expanded states and a future illustrative range marked “Ex.”; example dates do not select or submit a trip |
| Featured cars | Compact deposit/fuel caption removed; in-place category pills expose selected state and filter the featured cars. Phone pills use native horizontal scrolling |
| Catalogue | Duplicate transmission shortcut removed; filters and sorting share a row, while the live offer count remains visible below the heading |
| Vehicle gallery | Inline illustration caption removed; gallery/credit disclosures retained |
| Process | Shared MVP copy now describes comparison, request and agency-confirmed handover; home steps form a responsive timeline |
| Arrival guides | Airport and port cards sit side by side on wider screens, stack on phones and provide distinct icons and outlined offer CTAs |
| FAQ | Centered 768px maximum width, bottom rules and generous summary padding; existing keyboard/reversal/reduced-motion behavior preserved |
| Footer | Four desktop columns, compact closed license disclosure and a separate quiet demonstration banner at the bottom |
| Cleanup | Removed obsolete menu, previous category-rail, quick-filter, compact-transparency and photo-caption CSS; consolidated repeated search rules |

The design-analysis pass additionally checked price-state honesty, visible live
feedback after toolbar reflow, consistent frame padding, 200% text, target sizes,
keyboard operation, focus restoration, responsive image geometry and overlay layering.

Verification: 23 unit/API/domain/navigation tests and 93 desktop/mobile browser
cases passed. One touch-only case is intentionally skipped in the desktop project.
Production build and source formatting passed. Screenshots and geometry/axe scans
at 320, 390, 524, 768, 1110 and 1440px found no horizontal page overflow or automated
WCAG A/AA violations in the checked home/catalogue/vehicle views. Evidence is in
`.taste-skill/inspect-results/revisions/`. Testing used Chromium emulation rather
than physical phones.
