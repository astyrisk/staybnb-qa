# ts-playwright

Sprint 4–5 end-to-end and API test automation for the StayBnB platform —
TypeScript, Playwright Test, and npm. Covers bookings, reviews, messaging, and
notifications.

> One of two independent frameworks in the `staybnb-qa` monorepo. The other
> (`frameworks/java-selenium/`) covers Sprints 1–3. See the root
> [`README.md`](../../README.md) for the unified overview and coverage matrix.

- **Deep dive** (architecture, fixtures, API clients, conventions, CI):
  [`docs/TS_PLAYWRIGHT.md`](../../docs/TS_PLAYWRIGHT.md)
- **First-time setup** (both frameworks): [`docs/SETUP.md`](../../docs/SETUP.md)
- **Architecture overview** (both frameworks): [`docs/OVERVIEW.md`](../../docs/OVERVIEW.md)
- **API spec conventions**: [`docs/API_TEST_PATTERNS.md`](../../docs/API_TEST_PATTERNS.md)

## Prerequisites

- Node.js 20+ (Playwright provisions its own Chromium — no separate browser
  install needed)

## Quick start

```bash
cp .env.example .env          # then fill in BASE_URL, API_BASE_URL, API_KEY,
                              # HOST_USER_*, GUEST_USER_*
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

## Environment

A `.env` file in this directory is required. `support/env.ts` hard-fails on
missing keys:

| Key | Purpose |
|-----|---------|
| `BASE_URL` | Web app URL (tenant-scoped) |
| `API_BASE_URL` | Backend API root |
| `API_KEY` | API key for the backend |
| `HOST_USER_EMAIL` | Host user email |
| `HOST_USER_PASSWORD` | Host user password |
| `GUEST_USER_EMAIL` | Guest user email |
| `GUEST_USER_PASSWORD` | Guest user password |

See [`.env.example`](.env.example) for the full list and the CI secret-name
mapping. Config priority: process env (CI) → `.env` → (no fallback). Access
config through `env` from `support/env.ts`; never hardcode.

## Architecture (at a glance)

```
tests/{e2e,api}  →  fixtures/ (test, expect, pages, auth)  →  pages/ + PageManager
                                                              + api/<area>.client.ts
                                                              + support/ (env, data)
```

A `setup` project (`tests/auth.setup.ts`) logs in as host + guest and saves
storage state to `playwright/.auth/{host,guest}.json`; the `chromium` project
loads `host.json` by default. Specs import `test`/`expect` from `fixtures`
(never `@playwright/test` directly) so the screenshot-on-failure and auth
fixtures are active.

Full fixture tour, project tree, and conventions:
[`docs/TS_PLAYWRIGHT.md`](../../docs/TS_PLAYWRIGHT.md) § Architecture.

## CI

`.github/workflows/ts-playwright.yml` runs `npx playwright test` whenever
something under `frameworks/ts-playwright/**` changes, mapping `TS_TEST_*`
repository secrets to the env keys above.

A Jenkins pipeline is also provided at [`Jenkinsfile`](Jenkinsfile) — run it
as a Multibranch Pipeline with Script Path `frameworks/ts-playwright/Jenkinsfile`.
Required Jenkins credentials (Secret text, namespaced `staybnb-ts-*`) and the
Node.js tool name are documented in the `Jenkinsfile` header comment.

## Further reading

- [`docs/All-Tests.md`](../../docs/All-Tests.md) — cross-framework test index (every implemented test, both frameworks)
- [`docs/DEFECTS.md`](../../docs/DEFECTS.md) — defect catalogue
- [`docs/BOOKING_LOGIC.md`](../../docs/BOOKING_LOGIC.md) — booking test logic reference (cross-framework)
- `../../shared/api.yaml` — OpenAPI spec for the backend under test (shared between both frameworks)
