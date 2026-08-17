# StayBnB QA — Unified Automation Monorepo

End-to-end test automation for the StayBnB rental property platform. Two
complementary frameworks live under one roof, each covering a distinct set of
sprints and runnable fully on its own.

| Path | Stack | Covers |
|------|-------|--------|
| [`frameworks/java-selenium/`](frameworks/java-selenium/) | Java 21 · Selenium WebDriver 4 · JUnit 5 · REST Assured · Maven · Allure | Sprints 1–3 (auth, navigation, search, hosting, properties, wishlist, profiles) |
| [`frameworks/ts-playwright/`](frameworks/ts-playwright/) | TypeScript · Playwright · npm | Sprints 4–5 (bookings, reviews, messaging, notifications) |
| [`shared/`](shared/) | — | Cross-framework test data: OpenAPI spec, shared test images |
| [`docs/`](docs/) | — | Coverage matrix, sprint specs, defect catalogue |

> No monorepo-wide build runner (Nx/Turborepo) is required: the two toolchains
> are independent and each framework owns its build, lockfile, and dependencies.

---

## Repository layout

```
staybnb-qa/
├── frameworks/
│   ├── java-selenium/      # Framework A — Maven project (Sprints 1–3)
│   │   ├── src/
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   ├── Jenkinsfile
│   │   ├── .env.example
│   │   └── README.md
│   └── ts-playwright/      # Framework B — TypeScript/Playwright (Sprints 4–5)
│       ├── Jenkinsfile
│       └── …
├── shared/                 # cross-framework: OpenAPI spec, shared test images
├── docs/
│   ├── sprints/            # Sprint 1–5 user-story specs
│   ├── screenshots/        # bug screenshots referenced by DEFECTS.md
│   ├── All-Tests.md        # cross-framework test index (auto-generated)
│   ├── All-Tests.xlsx      # same index as spreadsheet
│   └── DEFECTS.md
├── .github/workflows/       # path-filtered CI — one workflow per framework
└── README.md
```

---

## Test coverage matrix

| Sprint | Feature / user story | Framework | Location | Status |
|--------|----------------------|-----------|----------|--------|
| 1 | Login (valid → redirect) | Java/Selenium | `tests/ui/auth/LoginTest` | ✅ |
| 1 | Register + validation (parameterized) | Java/Selenium | `tests/ui/auth/RegisterTest` | ✅ |
| 1 | Logout + JWT lifecycle | Java/Selenium | `tests/ui/auth/LogoutTest` | ✅ |
| 1 | Navbar (auth/visitor, mobile) | Java/Selenium | `tests/ui/navigation/NavbarTest` | ✅ |
| 1 | Home page hero, categories, featured grid | Java/Selenium | `tests/ui/navigation/HomeTest` | ✅ |
| 2 | Become a Host (UI + API) | Java/Selenium | `tests/ui/hosting/BecomeHostTest` | ✅ |
| 2 | Host dashboard + property cards | Java/Selenium | `tests/ui/hosting/HostDashboardTest` | ✅ |
| 2 | Create property 7-step wizard | Java/Selenium | `tests/ui/createproperty/CreatePropertyStep1-7Test` | ✅ |
| 2 | Edit / Publish / Delete property | Java/Selenium | `tests/ui/hosting/*Property*Test` | ✅ |
| 3 | Search by location/dates/guests | Java/Selenium | `tests/ui/search/SearchTest` | ✅ |
| 3 | Filters (price, amenities, beds, type, category) | Java/Selenium | `tests/ui/search/FilterTests` | ✅ |
| 3 | Sort + pagination | Java/Selenium | `tests/ui/search/SortTest`, `PaginateTest` | ✅ |
| 3 | Wishlist add/remove/view | Java/Selenium | `tests/ui/wishlist/*` | ✅ |
| 3 | Property details + booking widget | Java/Selenium | `tests/ui/property/PropertyDetailsTest` | ✅ |
| 3 | User profiles (own/edit/other) | Java/Selenium | `tests/ui/profile/*` | ✅ |
| 1–3 | Auth / profile / hosting / booking / resource APIs | Java/Selenium | `tests/api/**` (17 classes) | ✅ |
| 4 | Booking flow E2E (create, widget, my-bookings) | TS/Playwright | `frameworks/ts-playwright/tests/e2e/booking/{booking,widget}.spec.ts` | ✅ |
| 4 | Booking API (creation, requests, my-booking) | TS/Playwright | `frameworks/ts-playwright/tests/api/booking/*.spec.ts` | ✅ |
| 4.7 | Host notifications on new booking | TS/Playwright | `frameworks/ts-playwright/tests/e2e/notifications/*.spec.ts` | ✅ |
| 4.8 | Calendar availability conflicts | TS/Playwright | `frameworks/ts-playwright/tests/api/booking/booking-creation.spec.ts` | ✅ |
| 5 | Reviews (E2E + API) | TS/Playwright | `frameworks/ts-playwright/tests/api/reviews/reviews.spec.ts` | ✅ |
| 5 | Messaging (E2E + API) | TS/Playwright | `frameworks/ts-playwright/tests/{e2e/messaging,api/messages}/*.spec.ts` | ✅ |
| 5 | Social notifications (E2E + API) | TS/Playwright | `frameworks/ts-playwright/tests/{e2e/notifications,api/notifications}/*.spec.ts` | ✅ |
| 1,4,5 | Auth/login/logout/register parity (TS smoke) | TS/Playwright | `frameworks/ts-playwright/tests/{api,e2e}/auth/*.spec.ts` + `tests/auth.setup.ts` | ✅ |

> **Source of truth:** the cross-framework test index is
> [`docs/All-Tests.md`](docs/All-Tests.md) (auto-generated, 408 tests: 298
> Java/Selenium + 110 TS/Playwright; xlsx twin in
> [`docs/All-Tests.xlsx`](docs/All-Tests.xlsx)). Sprint 1–5 user-story specs are
> under [`docs/sprints/`](docs/sprints/).

---

## Quickstart — contributors working on one framework only

You do **not** need the other framework's toolchain installed. Pick a side.

### Java / Selenium (Sprints 1–3)

```bash
cd frameworks/java-selenium
cp .env.example .env        # then fill in credentials (see docs/SETUP.md)
mvn clean test                          # all tests, headed
mvn clean test -Dheadless=true          # headless (auto-enabled in CI)
mvn clean test -Dtest=LoginTest         # single class
mvn clean test -Dgroups=smoke           # by tag
mvn allure:serve                        # open Allure report
```
Requires: JDK 21, Maven 3.9+, Chrome.

### TypeScript / Playwright (Sprints 4–5)

```bash
cd frameworks/ts-playwright
cp .env.example .env        # then fill in credentials
npm ci
npx playwright install --with-deps chromium
npx playwright test
```
Requires: Node 20+ (Playwright provisions its own Chromium).

---

## CI/CD

Two path-filtered workflows run only the framework that changed:

| Workflow | Triggers on | Runs |
|----------|-------------|------|
| [`.github/workflows/java-selenium.yml`](.github/workflows/java-selenium.yml) | changes under `frameworks/java-selenium/**` | `mvn -B clean test -Dheadless=true` + Allure |
| [`.github/workflows/ts-playwright.yml`](.github/workflows/ts-playwright.yml) | changes under `frameworks/ts-playwright/**` | `npx playwright test` |
| [`.github/workflows/shared-docs.yml`](.github/workflows/shared-docs.yml) | changes under `docs/**` or `*.md` | doc TODO/FIXME scan + framework-path existence checks |

A PR touching only `frameworks/ts-playwright/` will not run the Java pipeline,
and vice versa. Secrets are namespaced (`TEST_*` for Java, `TS_TEST_*` for TS)
so the two frameworks can target different tenants independently.

### Jenkins

Equivalent Jenkins pipelines live alongside each framework and run as two
independent Multibranch Pipeline jobs (one per framework), mirroring the
path-filtered design above:

| Pipeline | Script path | Runs |
|----------|-------------|------|
| java-selenium | `frameworks/java-selenium/Jenkinsfile` | `mvn -B clean test -Dheadless=true` + JUnit results + Allure report |
| ts-playwright | `frameworks/ts-playwright/Jenkinsfile` | `npm ci` → `npx playwright install --with-deps chromium` → `npx playwright test` |

Create one Multibranch Pipeline per framework and set its **Script Path** to
the corresponding `Jenkinsfile`. Required Jenkins credentials (Secret text) and
Global Tool Configuration names are documented in each `Jenkinsfile` header.
Credentials are namespaced (`staybnb-*` for Java, `staybnb-ts-*` for TS) so the
two frameworks can target different tenants.

---

## Environment configuration

Each framework loads its own `.env` from its own directory (gitignored — never
commit). Config priority is the same on both sides:
**System Properties → `.env` file → Environment Variables**. Never hardcode
values; access config through the framework's config layer (`TestConfig` on the
Java side).

Java secrets reference: [`docs/JAVA_SELENIUM.md`](docs/JAVA_SELENIUM.md) § Required GitHub Secrets.
GitHub repository secrets must be set under **Settings → Secrets → Actions**.

---

## Documentation

Shared (cross-framework):
- [`docs/OVERVIEW.md`](docs/OVERVIEW.md) — monorepo architecture (both frameworks)
- [`docs/SETUP.md`](docs/SETUP.md) — first-time setup (both frameworks)
- [`docs/All-Tests.md`](docs/All-Tests.md) — cross-framework index of every implemented test (auto-generated; xlsx twin in [`docs/All-Tests.xlsx`](docs/All-Tests.xlsx))
- [`docs/DEFECTS.md`](docs/DEFECTS.md) — defect catalogue (bug screenshots in `docs/screenshots/`)
- [`docs/sprints/`](docs/sprints/) — Sprint 1–5 user-story specs
- [`docs/API_TEST_PATTERNS.md`](docs/API_TEST_PATTERNS.md) — API spec conventions (TS)
- [`docs/BOOKING_LOGIC.md`](docs/BOOKING_LOGIC.md) — booking test logic reference (cross-framework)

Per-framework deep dives (in `docs/`):
- [`docs/JAVA_SELENIUM.md`](docs/JAVA_SELENIUM.md) — Java/Selenium framework deep dive
- [`docs/TS_PLAYWRIGHT.md`](docs/TS_PLAYWRIGHT.md) — TypeScript/Playwright framework deep dive

Framework quickstarts:
- [`frameworks/java-selenium/README.md`](frameworks/java-selenium/README.md) — Java quickstart
- [`frameworks/ts-playwright/README.md`](frameworks/ts-playwright/README.md) — TypeScript/Playwright quickstart