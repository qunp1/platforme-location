# Mobile vehicle and navigation polish — 27 October 2026

Implemented the latest browser annotations and mobile booking brief.

- Browsing navigation now spans both screen edges on a navy surface. Cream labels and a terracotta top marker identify the selected destination; safe-area padding and the requested blur remain.
- Vehicle detail routes omit global dock navigation. The white booking bar sits at the viewport bottom with safe-area padding and the requested subtle top shadow. Its button grows naturally and stacks on narrow/enlarged layouts.
- Removed the back-to-offers breadcrumb. The full image remains a keyboard-accessible gallery button with its existing accessible name and focus restoration. The visible overlay is now only a small expand icon.
- Phone photos use a 4:3 frame, 12px corners and neutral #F3EFE8 background. Specs use a uniform 2×2 grid with SVG icons. The heading, agency line and spacing are more compact.
- Catalogue category chips explicitly center their labels horizontally and vertically.
- Cream #FAF7F2, navy #13293D and terracotta #C85A32 are reflected in shared and canonical tokens. White-text buttons retain the darker accessible terracotta shade.

Validation: production build, formatting and 23 unit tests pass. Forty-one browser regression cases passed, with one intentional desktop skip for a mobile-only interaction. The catalogue failure/retry cases use the development server because their mock intercepts a source-module URL; they cannot run against bundled production assets. Six additional final layout/gallery/alignment checks passed after the last styling adjustment. Six production axe AA scans reported no violations or horizontal page overflow. At 320px and 200% text the booking CTA remained inside the viewport and reached the correct date picker or request route, with and without selected dates. Physical iOS/Android hardware was not available.

Updated `DESIGN.md` records the edge-to-edge dock and detail-page exception. Request creation payloads and price calculations are unchanged.
