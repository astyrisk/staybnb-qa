# StayBnB — TypeScript/Playwright Framework

Deep-dive documentation for Framework B (`frameworks/ts-playwright/`). Covers
architecture, conventions, CI, and reporting. For the cross-framework overview
see [OVERVIEW.md](OVERVIEW.md); for first-time setup see
[SETUP.md](SETUP.md); for the quickstart see
[`frameworks/ts-playwright/README.md`](../frameworks/ts-playwright/README.md).

> This is one of two independent frameworks in the `staybnb-qa` monorepo. The
> other (`frameworks/java-selenium/`) covers Sprints 1–3 — see
> [JAVA_SELENIUM.md](JAVA_SELENIUM.md).

## Overview

An **end-to-end and API test automation framework** for the StayBnB rental
platform, covering **Sprints 4–5** (bookings, reviews, messaging,
notifications). The SUT is a multi-tenant web app with URL pattern
`/t/{slug}/`. UI tests use Playwright's Chromium; API tests use
`@playwright/test`'s `APIRequestContext`.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20+ | Runtime + npm |
| **Chromium** | Provisioned by Playwright | Browser for E2E tests (no separate install needed) |
| **Access to QA Playground** | — | `https://qa-playground.nixdev.co` (target application) |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript 5 |
| Test Framework | Playwright Test (`@playwright/test` ^1.59) |
| API Testing | `APIRequestContext` (Playwright built-in) |
| Reporting | Playwright HTML reporter |
| Environment Config | dotenv ^17 |
| Package Manager | npm |
| Module System | CommonJS |

---

## Sprints Covered

| Sprint | Scope | Test roots |
|--------|-------|------------|
| 4 | Booking flow, availability, overlap conflicts, host notifications | `tests/e2e/booking`, `tests/api/booking`, `tests/e2e/host` |
| 5 | Reviews, messaging, social notifications | `tests/e2e/reviews`, `tests/e2e/messaging`, `tests/e2e/notifications`, `tests/api/{reviews,messages,notifications}` |

---

## Architecture

```
tests/{e2e,api}              <- business logic + ONE assertion per spec
      |
fixtures/                    <- canonical import surface (test, expect, pages, auth)
      |
pages/  +  PageManager       <- POM aggregated per Page; BasePage / BaseComponent
      |
api/<area>/<area>.client.ts <- typed request methods + expect<Outcome> helpers
      |
support/                     <- env.ts (validated env), data/, auth-files.ts
```

### Setup project & auth model

`playwright.config.ts` defines a `setup` project (matching `*.setup.ts`) that
the `chromium` project depends on. `tests/auth.setup.ts` logs in as both host
and guest and saves storage state to `playwright/.auth/host.json` and
`…/guest.json` (paths canonicalised in `support/auth-files.ts`). The
`chromium` project loads `host.json` as its default `storageState` so most E2E
tests start already authenticated; tests needing a logged-out state opt out
with `test.use({ storageState: { cookies: [], origins: [] } })`.

### Fixtures (the import surface)

`fixtures/index.ts` is the canonical import surface for tests — it re-exports
`test`, `expect`, `screenshotSelector`, `PageManager`, and the auth file paths.

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

### Page Object Model

`pages/page-manager.ts` aggregates all page objects on a single `Page`. Tests
access them as `pages.loginPage`, `pages.navbar`, `pages.propertyDetailsPage`,
etc. Full pages extend `BasePage` (`pages/base.page.ts`); shared UI fragments
extend `BaseComponent` (`pages/base.component.ts`). Both bases hold a
`protected page`.

### API client layer

`api/<area>/<area>.client.ts` wraps `APIRequestContext` with typed request
methods and reusable assertion helpers. See `api/auth/auth.client.ts`
(`AuthApiClient`) for the pattern. New API areas follow the same client +
expectations layout under `api/<area>/`.

### Support layer

- `support/env.ts` — validated env access; throws on missing keys. Import `env`
  everywhere instead of reading `process.env` directly.
- `support/data/` — selectors, users, tokens, properties, bookings, messages.
  Data factories are functions (fresh per call), typed via
  `ReturnType<typeof …>`, overridable per test.
- `support/auth-files.ts` — single source of truth for storage-state paths.

### Session utilities

`utils/session.ts` handles token / storage-state persistence (e.g.
`saveSession`, `restoreSession`, `getStoredToken`), saving to
`environments/session.json` (`SESSION_PATH`, gitignored). The app stores its
auth token in `localStorage` under `staybnb_token`.

### Project Structure

```
frameworks/ts-playwright/
+-- .env                              # Environment config (gitignored)
+-- package.json                      # npm scripts + dependencies
+-- package-lock.json
+-- playwright.config.ts              # Projects, reporter, retries, CI flags
+-- tsconfig.json
+-- Jenkinsfile                       # Jenkins pipeline (optional CI)
+-- README.md                         # Quickstart
|
+-- api/                              # API clients (one per feature domain)
|   +-- auth/auth.client.ts           # AuthApiClient — canonical pattern
|   +-- booking/booking.client.ts
|   +-- hosting/hosting.client.ts
|   +-- messages/messages.client.ts
|   +-- notifications/notifications.client.ts
|   +-- reviews/reviews.client.ts
|
+-- fixtures/                         # Canonical import surface for tests
|   +-- index.ts                      # re-exports test, expect, PageManager, ...
|   +-- base.ts                       # screenshot-on-failure
|   +-- auth.fixture.ts              # pages, hostPages, guestContext, flows
|   +-- api.fixture.ts               # apiTest + authApi
|   +-- screenshotElement.ts
|
+-- pages/                            # Page Object Model
|   +-- base.page.ts
|   +-- base.component.ts
|   +-- page-manager.ts               # aggregates all page objects per Page
|   +-- auth/                         # login.page.ts, register.page.ts
|   +-- booking/                      # booking-requests.page.ts, mybooking.page.ts
|   +-- components/                   # navbar.component.ts
|   +-- messages/                     # message.page.ts
|   +-- notifications/                # notifications.page.ts
|   +-- property/                     # property-details.page.ts
|
+-- support/
|   +-- env.ts                        # validated env access (throws on missing)
|   +-- auth-files.ts                 # storage-state paths (single source of truth)
|   +-- data/
|       +-- selectors.ts              # Selectors.* — centralized selectors
|       +-- users.ts
|       +-- tokens.ts
|       +-- properties.ts
|       +-- bookings.ts
|       +-- messages.ts
|
+-- tests/
|   +-- auth.setup.ts                 # setup project: logs in host + guest
|   +-- api/
|   |   +-- auth/                     # login.spec.ts, register.spec.ts
|   |   +-- booking/                  # booking-creation, booking-requests, mybooking
|   |   +-- messages/                 # messages.spec.ts
|   |   +-- notifications/            # notifications.spec.ts
|   |   +-- reviews/                  # reviews.spec.ts
|   +-- e2e/
|       +-- auth/                     # login, logout, register
|       +-- booking/                  # booking.spec.ts, widget.spec.ts
|       +-- messaging/                # message.spec.ts, messages-page.spec.ts
|       +-- notifications/            # notification-bell, notifications-page
|
+-- utils/
    +-- session.ts                    # token / storage-state persistence
```

### `playwright.config.ts` highlights

- **Projects** — `setup` (matches `*.setup.ts`) → `chromium` (Desktop Chrome,
  `storageState: playwright/.auth/host.json`, depends on `setup`).
  Firefox, WebKit, Mobile Chrome, Mobile Safari are present but commented out.
- **Reporter** — `html` (single HTML reporter).
- **CI flags** — `forbidOnly: !!process.env.CI`, `retries: process.env.CI ? 2 : 0`.
- **Trace** — `on-first-retry`. **Screenshot** — `off`.
- **Headless** — `!process.env.PWDEBUG` (`PWDEBUG=1` forces headed mode).

---

## Environment Configuration

A `.env` file in this directory is required. `support/env.ts` hard-fails on
missing keys:

| Key | Purpose |
|-----|---------|
| `BASE_URL` | Web app URL (tenant-scoped) |
| `API_BASE_URL` | Backend API root (`{playground}/api/t/{slug}`) |
| `API_KEY` | API key for the backend |
| `HOST_USER_EMAIL` | Host user email (→ `playwright/.auth/host.json`) |
| `HOST_USER_PASSWORD` | Host user password |
| `GUEST_USER_EMAIL` | Guest user email (→ guest storage state) |
| `GUEST_USER_PASSWORD` | Guest user password |

Config priority: **process env (CI) → `.env` file → (no fallback)**. Never
hardcode values; access config through `env` from `support/env.ts`. See
`.env.example` for the full list and the CI secret-name mapping.

### Config Priority Chain

```
process env (CI / exported)   <-- highest
        |
.env file (framework directory)
        |
(no fallback — env.ts throws)   <-- lowest
```

---

## Running Tests

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test                          # all tests
npx playwright test tests/booking            # subset
npx playwright test -g "test name"           # single test by name
npm run test:api                             # API tests only
npm run test:e2e                             # E2E tests only
npm run test:headed                          # headed mode
npm run test:debug                           # Playwright inspector
npm run report                               # open last HTML report
```

> `PWDEBUG=1` env var forces headed mode (see `playwright.config.ts`).

---

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
- One assertion per test; multi-condition checks use soft assertions.
- Tests contain only business logic — no Playwright API calls in specs; delegate
  to page objects and API clients.
- API clients own request methods + assertion helpers (`expectUnauthorized`,
  `expectConflict`, …); field assertions live in the helper, not the spec.
- Test-data factories in `support/data/*.ts` are functions (fresh per call) with
  an `overrides` parameter; the exported type is `ReturnType<typeof …>`.
- When a test creates a resource that must be cleaned up, track its `id` in a
  describe-scoped `let` and cancel/delete it in `afterEach`.

> Full API spec conventions: [API_TEST_PATTERNS.md](API_TEST_PATTERNS.md).

---

## CI/CD — GitHub Actions

`.github/workflows/ts-playwright.yml` runs `npx playwright test` whenever
something under `frameworks/ts-playwright/**` changes. The workflow maps
`TS_TEST_*` repository secrets to the env keys `support/env.ts` reads:

```
TS_TEST_BASE_URL              → BASE_URL
TS_TEST_API_BASE_URL          → API_BASE_URL
TS_TEST_API_KEY               → API_KEY
TS_TEST_HOST_USER_EMAIL       → HOST_USER_EMAIL
TS_TEST_HOST_USER_PASSWORD    → HOST_USER_PASSWORD
TS_TEST_GUEST_USER_EMAIL      → GUEST_USER_EMAIL
TS_TEST_GUEST_USER_PASSWORD   → GUEST_USER_PASSWORD
```

Set under **Settings → Secrets → Actions**. Secrets are namespaced
(`TS_TEST_*`) so the two frameworks can target different tenants without
collision.

---

## Reporting

Playwright's HTML reporter is configured in `playwright.config.ts`:

```bash
npx playwright test          # generates playwright-report/
npm run report               # opens the last HTML report in a browser
```

The report includes per-test status, duration, traces (on first retry), and
the full-page + element failure screenshots attached by `fixtures/base.ts`.
