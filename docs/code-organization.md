# Code organization

Cleanup: 2026-10-26. Existing React/Vite stack, routes, API contracts, pricing,
account behavior and visual direction are preserved.

## Frontend

- `src/App.jsx`: navigation/history, shared page state, route selection and dialogs.
- `src/pages/`: home, results and public information pages.
- `src/components/`: shared header, footer and catalog error presentation.
- `src/hooks/useCatalog.js`: asynchronous catalog loading, cancellation and retry.
- `src/AccountPage.jsx`: account/session state and request submission coordination.
- `src/account/`: sign-in, recovery forms, request review and request list.
- `src/VehiclePage.jsx`: vehicle details and the request entry point.
- Existing search, filters, offers, FAQ, sort and UI modules keep their filenames
  and public exports. `catalog.js`, `domain.js` and `navigation.js` remain stable
  boundaries for data access, business rules and URL serialization respectively.
- `src/styles/`: active CSS layers; see its README before changing cascade order.

Page components receive their current route data and callbacks explicitly.
No router, state-management library, frontend framework or production dependency
was added. The unreachable legacy `demo` reservation dialog was removed after
checking every modal-opening path.

## Backend

- `server/start.js`: environment configuration and server startup.
- `server/api.js`: endpoint routing and orchestration.
- `server/provider.js`: official provider REST transport and error translation.
- `server/http.js`: HTTP errors, bounded JSON parsing and per-server write limits.
- `server/session-cookies.js`: cookie parsing and existing session cookie options.
- `server/validation.js`: existing input validation rules, unchanged.

The same authentication checks, provider calls, request order, cookie options,
validation rules and database RPC contract are retained. Database migrations and
seeds are outside this cleanup. Live Supabase checks still require configuration.

## Formatting and verification

Prettier 3.6.2 is a pinned development dependency. Use:

```sh
pnpm format
pnpm format:check
pnpm test
pnpm build
pnpm test:e2e
```

Start the development server before browser tests; set `NADORLY_URL` when using a
different port. The catalog error/retry test replaces `/src/catalog.js` and must
run against the development server, not the production preview. Existing tests
were kept unchanged during the refactor.

Vite excludes `.agents`, `.tools`, `.taste-skill` and `.hallmark` from file
watching. These local tooling trees delayed development responses in this
workspace; application files, assets and design tokens remain watched.

Verification on 2026-10-26: 22 unit/API tests, production build and formatting
check passed. The production preview passed 72 browser cases; the two catalog
retry cases passed separately on a development server with watching disabled.
That covers all 74 existing desktop/mobile cases without changing assertions.
The normal development server also returned HTTP 200 after the watcher exclusions.

The repository had no Git commits at the start of the cleanup. Original source
copies were kept under the ignored `.tools/refactor-baseline/` directory; no
unrelated files or credentials were staged into a new initial commit.
