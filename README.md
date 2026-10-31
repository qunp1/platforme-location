# Nadorly

Nadorly's local customer application: search-led homepage, comparable sample offers,
URL-backed search/filter state, full vehicle pages, and a shared design system.

## Run

Node.js 22.12+ and pnpm are required.

```sh
pnpm install
pnpm dev
```

Open the Local URL printed by Vite. `pnpm build` produces `dist/`; `pnpm preview` serves it.
Run pricing, URL and Morocco-time checks with `pnpm test`.
`pnpm test:e2e` runs the local browser/axe suite (start the dev server first).
Browser QA uses installed Chrome/Edge on Windows, or Playwright Chromium elsewhere.
Set `CHROME_PATH` for another executable and `NADORLY_URL` for another local port.

## Scope

`src/App.jsx` supplies page routing and layout. Search, offers, filters and UI
primitives are separate components. `src/catalog.js` is the asynchronous local-data
adapter, `src/domain.js` handles pricing/time, and `src/navigation.js` parses URL state.

Pages, account views, shared layout and API helpers now have separate modules.
See [code organization](docs/code-organization.md) for ownership and verification
commands, and [stylesheet layers](src/styles/README.md) for the CSS cascade.
Use `pnpm format` to format source and `pnpm format:check` to check it.

`replica/design/tokens.json` is the canonical token source. Run `pnpm tokens` after
editing it. `tokens.css` and an optional Tailwind mapping are generated from it;
the app uses plain CSS and does not require Tailwind. `/design` previews primitives.
Reconstruction research and the active build brief live in `replica/`.

The customer request backend is implemented but needs a configured Supabase project.
See [backend setup](replica/backend.md) for migration, seed, auth/email setup and env
variables. Run `pnpm api` alongside the frontend. Without configuration, accounts
show an explicit unavailable state; they never create simulated requests.
Agency decisions, live availability and payment are not implemented.
Prices, agencies and terms are fictional. French only in this first slice; English and
Arabic RTL remain planned. Search uses Morocco local time, integer monetary minor units
and calendar-day billing (date-only pickup/return). Search, filters and sort persist through the URL,
refresh and Back/Forward. Deployment must serve `index.html` for application routes.

Photos are model illustrations, not agency inventory. Sources, authors and licenses
are available in the interface footer and `assets/credits.json`. Working identity:
`assets/brand/nadorly-kit-v2`. Active design: `replica/design/`. The first prototype's
`docs/frontend-direction.md` and review remain historical records.

## GitHub Pages

The `.github/workflows/pages.yml` workflow builds and deploys the frontend on pushes
to `main`. In repository **Settings → Pages**, select **GitHub Actions** as the
source, then run **Actions → Deploy frontend to GitHub Pages → Run workflow** if
necessary. The expected URL is https://qunp1.github.io/platforme-location/.

The Pages build uses `VITE_STATIC_SITE=true pnpm build --base /platforme-location/`.
Hash routes (for example `#/cars/sandero`) preserve refreshes and shared links on
static hosting. Local development continues to use regular paths. Pages cannot
run the Node API: accounts and requests explicitly remain unconfigured in this
build. Deploy and connect a backend separately before enabling those features.
