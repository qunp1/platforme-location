# Stylesheet ownership

The application uses plain CSS and the existing design tokens. `src/main.jsx`
loads these layers in this order; later files intentionally refine earlier ones:

1. `base.css`: tokens, element defaults, reusable buttons, fields and notices.
2. `app.css`: shared shell and the original page/component layouts.
3. `brand.css`: current typography, palette and brand treatment.
4. `booking.css`: search controls, calendars and booking layout refinements.
5. `listing.css`: offer lists and vehicle detail presentation.
6. `refinements.css`: final responsive, interaction and accessibility refinements.
7. `editorial.css`: October 27 coastal editorial composition, tactile actions,
   mobile dock, readable price hierarchy and full-path responsive behavior.

`index.html` loads the locally hosted font definitions from `assets/fonts/fonts.css`.
Instrument Serif owns travel/information headlines; the original SVG brand artwork
owns the wordmark. Plus Jakarta
Sans owns operational screens, labels, vehicle names and tabular prices.

`account.css` is imported by `AccountPage.jsx` and owns the account/request screens.

Keep this cascade order when editing. This cleanup formats and relocates the
styles without merging duplicate selectors or changing their precedence. Moving
a rule between layers requires checking the affected pages and breakpoints.

The canonical tokens remain in `replica/design/tokens.json`; `pnpm tokens`
regenerates `replica/design/tokens.css`. The older `src/hallmark/` files are not
imported by the current application and remain as design-history material.
