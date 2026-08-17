# StayBnB QA — Framework Overview

High-level tour of the monorepo: what the two frameworks are, how each is built,
and how CI is wired. For first-time setup see [SETUP.md](SETUP.md); for the
per-framework deep dives see
[JAVA_SELENIUM.md](JAVA_SELENIUM.md) and [TS_PLAYWRIGHT.md](TS_PLAYWRIGHT.md).

---

## What it is

End-to-end and API test automation for StayBnB, an Airbnb-like multi-tenant
rental platform. Each tenant is isolated behind a URL slug: `/t/{slug}/`. The
suite is split across two **independent** frameworks that share no runtime code:

| Framework | Path | Stack | Covers |
|-----------|------|-------|--------|
| **A — Java/Selenium** | `frameworks/java-selenium/` | Java 21 · Selenium WebDriver 4 · JUnit 5 · REST Assured · Maven · Allure | Sprints 1–3 (auth, navigation, search, hosting, properties, wishlist, profiles) |
| **B — TS/Playwright** | `frameworks/ts-playwright/` | TypeScript · Playwright Test · npm | Sprints 4–5 (bookings, reviews, messaging, notifications) |

Each framework owns its build (`pom.xml` / `package.json`), lockfile, `.env`, and
dependencies. Run `mvn` only inside `frameworks/java-selenium/` and `npm`/`npx`
only inside `frameworks/ts-playwright/` — never from the repo root. The only
shared surface is binary/text test data and the OpenAPI spec under `shared/`
(see [`shared/README.md`](../shared/README.md)).

---

## Architecture

### Framework A — Java/Selenium

```
Tests (ui/, api/)            <- business logic + ONE assertion per test
      |
Page Objects (pages/)        <- all Selenium interactions, fluent returns
      |
Components (components/)     <- reusable fragments (Navbar, SearchForm, PropertyCard)
      |
Core / Config                <- SeleniumBase (waits), DriverFactory (ThreadLocal),
                                 Locators.java, TestConfig, AppConstants
```

Key patterns:

- **Page Object Model** — one class per UI page; navigation methods return the next page.
- **ThreadLocal driver** — `DriverFactory` for safe parallel execution.
- **Centralized locators** — every `By` selector in `Locators.java`.
- **Externalized JS** — preconditions (e.g. `becomeHostApi.js`) live as `.js` files under `src/main/resources/.../scripts/`, never inline.
- **Extensions over base classes** — `ScreenshotOnFailureExtension` + `RetryExtension` (fresh browser per retry) via `@ExtendWith`.
- **API preconditions in UI tests** use `BaseApiTest` helpers — no UI navigation for setup.

Deep dive: [JAVA_SELENIUM.md](JAVA_SELENIUM.md).

### Framework B — TS/Playwright

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

Key patterns:

- **Setup project** — `tests/auth.setup.ts` logs in as host + guest and saves storage state to `playwright/.auth/{host,guest}.json`; the `chromium` project loads `host.json` by default.
- **Fixtures as the import surface** — specs import `test`/`expect` from `fixtures`, never directly from `@playwright/test`.
- **API clients** own request methods + assertion helpers (`expectUnauthorized`, `expectConflict`, …); field assertions live in the helper, not the spec.
- **Test-data factories** in `support/data/*.ts` — defaults are functions (fresh per call), typed via `ReturnType<typeof …>`, overridable per test.

Deep dive: [TS_PLAYWRIGHT.md](TS_PLAYWRIGHT.md).

---

## Test conventions (enforced on both sides)

- One assertion per test; multi-condition UI checks use `assertAll()` (Java) / soft assertions (TS).
- Tests contain only business logic — no driver/Playwright API calls in tests.
- Locators/selectors are centralized (`Locators.java` / `support/data/selectors.ts`).
- Waits live in page classes — no `Thread.sleep()` / hardcoded waits.
- 100% test independence — no reliance on previous state; safe in any order or in parallel.
- `@Tag` / spec categorization for targeted CI (`smoke`, `regression`, `api`).
- Dynamic test data (UUIDs/Faker for unique inputs); no hardcoded secrets.
- Cross-cutting concerns via extensions/hooks (screenshots on failure, retry).
- Config externalized to `.env` / `config.properties` / `playwright.config.ts`; never in test logic.

---

## CI/CD

Three path-filtered GitHub Actions workflows under `.github/workflows/`:

| Workflow | Triggers on | Runs |
|----------|-------------|------|
| [`java-selenium.yml`](../.github/workflows/java-selenium.yml) | `frameworks/java-selenium/**` | `mvn -B clean test -Dheadless=true` + Allure |
| [`ts-playwright.yml`](../.github/workflows/ts-playwright.yml) | `frameworks/ts-playwright/**` | `npx playwright test` |
| [`shared-docs.yml`](../.github/workflows/shared-docs.yml) | `docs/**` or root `*.md` | doc TODO/FIXME scan + framework-path existence checks |

A PR touching only one framework runs only that framework's pipeline. Secrets are
namespaced (`TEST_*` for Java, `TS_TEST_*` for TS) so the two frameworks can
target different tenants independently. Both framework workflows also accept
`workflow_dispatch` for manual runs. A Jenkins alternative for Framework A is
described in [SETUP.md](SETUP.md) § Jenkins.

See [SETUP.md](SETUP.md) for the secret lists.
