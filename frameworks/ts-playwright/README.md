# Framework B — TypeScript / Playwright

End-to-end and API test automation for the StayBnB rental platform, covering
**Sprints 4–5** (bookings, reviews, messaging, notifications). This framework
is one of two independent frameworks in the `staybnb-qa` monorepo — see the
[repository root README](../../README.md) for the unified overview and the
cross-framework test coverage matrix.

## Stack

- TypeScript 5, Playwright Test, `@playwright/test` `APIRequestContext`
- npm for dependency management
- dotenv for local env (validated via `support/env.ts`)
- Playwright HTML reporter

## Sprints covered

| Sprint | Scope | Test roots |
|--------|-------|------------|
| 4 | Booking flow, availability, overlap conflicts, host notifications | `tests/e2e/booking`, `tests/api/booking`, `tests/e2e/host` |
| 5 | Reviews, messaging, social notifications | `tests/e2e/reviews`, `tests/e2e/messaging`, `tests/e2e/notifications`, `tests/api/{reviews,messages,notifications}` |

## Architecture (one-paragraph tour)

`playwright.config.ts` defines a `setup` project (matching `*.setup.ts`)
that the `chromium` project depends on. `tests/auth.setup.ts` logs in as both
host and guest and saves storage state to `playwright/.auth/host.json` and
`…/guest.json` (paths canonicalised in `support/auth-files.ts`). The
`chromium` project loads `host.json` as its default `storageState` so most
E2E tests start already authenticated; tests needing a logged-out state opt
out with `test.use({ storageState: { cookies: [], origins: [] } })`.

**Fixtures** (`fixtures/index.ts`) is the canonical import surface for tests —
it re-exports `test`, `expect`, `screenshotSelector`, `PageManager`, and the
auth file paths. Layer summary:

- `fixtures/base.ts` — extends Playwright's `test` to attach a full-page +
  element screenshot on failure. The element selector comes from a per-test
  annotation set by `screenshotSelector('css-selector')` passed as the second
  arg to `test(...)`.
- `fixtures/auth.fixture.ts` — adds `pages` / `hostPages` (PageManager over the
  host page), `guestContext` / `guestPage` / `guestPages` (second context using
  guest storage state, for multi-user scenarios), and flow fixtures
  `authenticated`, `registered` (creates a fresh user via the UI register flow),
  `loggedOut`.
- `fixtures/api.fixture.ts` — exposes `apiTest` with an `authApi: AuthApiClient`
  fixture for API specs.

**Page Object Model** — `pages/page-manager.ts` aggregates all page objects on
a single `Page`. Tests access them as `pages.loginPage`, `pages.navbar`,
`pages.propertyDetailsPage`, etc. Full pages extend `BasePage`
(`pages/base.page.ts`); shared UI fragments extend `BaseComponent`
(`pages/base.component.ts`). Both bases hold a `protected page`.

**Support layer** — `support/env.ts` (validated env access; throws on missing
keys — import `env` everywhere instead of reading `process.env` directly),
`support/data/` (selectors, users, tokens, properties, bookings),
`support/auth-files.ts` (single source of truth for storage-state paths).

**API client** — `api/<area>/<area>.client.ts` wraps `APIRequestContext` with
typed request methods and reusable assertion helpers. See `api/auth/auth.client.ts`
(`AuthApiClient`) for the pattern. New API areas follow the same client +
expectations layout under `api/<area>/`.

**Session utilities** — `utils/session.ts` handles token / storage-state
persistence (e.g. `saveSession`, `restoreSession`, `getStoredToken`), saving to
`environments/session.json` (`SESSION_PATH`, gitignored). The app stores its
auth token in `localStorage` under `staybnb_token`.

## Quickstart

Requires Node 20+ (Playwright provisions its own Chromium — no separate browser
install needed).

```bash
cd frameworks/ts-playwright
cp .env.example .env        # then fill in BASE_URL, API_BASE_URL, API_KEY,
                            # HOST_USER_*, GUEST_USER_*
npm ci
npx playwright install --with-deps chromium
npx playwright test                          # all tests
npx playwright test tests/booking            # subset
npx playwright test -g "test name"           # single test by name
npm run test:api                             # API tests only (see package.json scripts)
npm run test:e2e                             # E2E tests only
npm run test:headed                          # headed mode
npm run test:debug                           # Playwright inspector
npm run report                               # open last HTML report
```

> `PWDEBUG=1` env var forces headed mode (see `playwright.config.ts`).

## Environment configuration

A `.env` file in this directory is required. `support/env.ts` hard-fails on
missing keys: `BASE_URL`, `API_BASE_URL`, `API_KEY`, `HOST_USER_EMAIL`,
`HOST_USER_PASSWORD`, `GUEST_USER_EMAIL`, `GUEST_USER_PASSWORD`. See
`.env.example` for the full list and the CI secret-name mapping.

Config priority is the same as the Java framework: **process env (CI) → `.env`
file → (no fallback)**. Never hardcode values; access config through `env`
from `support/env.ts`.

In GitHub Actions the `ts-playwright.yml` workflow maps `TS_TEST_*` secrets to
the env keys above so the two frameworks can target different tenants without
collision.

## Conventions

- Always import `test` and `expect` from `fixtures` (not `@playwright/test`)
  so the screenshot-on-failure and auth fixtures are active.
- Use `screenshotSelector('selector')` as the second arg to `test(...)` when the
  failure screenshot should focus on a specific element.
- Shared selectors live in `support/data/selectors.ts` (`Selectors.*`) — extend
  it rather than inlining selectors.
- Tests assume host login by default; explicitly clear storage state for
  logged-out flows with
  `test.use({ storageState: { cookies: [], origins: [] } })`.
- See the root [AGENTS.md](../../AGENTS.md) for cross-framework test-writing
  rules (one assertion per test, no `Thread.sleep`/hardcoded waits, 100% test
  independence, fluent page objects, externalised config, dynamic test data,
  `@Tag`-equivalent categorisation, etc.).

## Further reading

- [Root README](../../README.md) — unified monorepo overview + coverage matrix
- [AGENTS.md](../../AGENTS.md) — cross-framework agent + contributor guidance
- [MIGRATION.md](../../MIGRATION.md) — how the two original repos were merged
- `beginner-doc/` — introductory notes on the Playwright framework (numbered 01–14)
- `documentation/api.yaml` — OpenAPI spec for the backend under test
- `documentation/testcases.xlsx` — TS framework coverage spreadsheet