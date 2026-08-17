# StayBnB QA — Unified Automation Monorepo

End-to-end test automation for the StayBnB rental property platform. Two
complementary frameworks live under one roof, each covering a distinct set of
sprints and runnable fully on its own.

| Path | Stack | Covers |
|------|-------|--------|
| [`frameworks/java-selenium/`](frameworks/java-selenium/) | Java 21 · Selenium WebDriver 4 · JUnit 5 · REST Assured · Maven · Allure | Sprints 1–3 (auth, navigation, search, hosting, properties, wishlist, profiles) |
| [`frameworks/ts-playwright/`](frameworks/ts-playwright/) | TypeScript · Playwright · npm | Sprints 4–5 (bookings, reviews, messaging, notifications) |
| [`shared/`](shared/) | — | Cross-framework test data and media (currently thin) |
| [`docs/`](docs/) | — | ADRs, coverage matrix, sprint specs, defect catalogue |

> No monorepo-wide build runner (Nx/Turborepo) is required: the two toolchains
> are independent and each framework owns its build, lockfile, and dependencies.

---

## Repository layout

```
staybnb-qa/
├── frameworks/
│   ├── java-selenium/      # Framework A — Maven project (Sprints 1–3)
│   │   ├── src/
│   │   ├── media/          # test upload images (referenced via MediaPaths relative paths)
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   ├── Jenkinsfile
│   │   ├── .env.example
│   │   ├── DOCUMENTATION.md
│   │   └── README.md
│   └── ts-playwright/      # Framework B — copied from the original TS repo (fresh git history; see MIGRATION.md)
├── shared/                 # cross-framework fixtures/data
├── docs/
│   ├── adr/                # Architecture Decision Records
│   ├── sprints/            # user-story specs (sprints 1–5)
│   ├── screenshots/         # bug screenshots referenced by DEFECTS.md
│   ├── TEST_COVERAGE.md     # Java framework coverage matrix (~311 tests, 56 classes)
│   ├── DEFECTS.md
│   └── TODO.md
├── .github/workflows/       # path-filtered CI — one workflow per framework
├── AGENTS.md
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

> **Source of truth:** the Java side is fully documented in
> [`docs/TEST_COVERAGE.md`](docs/TEST_COVERAGE.md) (~311 tests across 56 classes).
> TS coverage is inventoried in
> [`docs/sprint5-api-tests.md`](docs/sprint5-api-tests.md),
> [`docs/sprint5-notifications-tests.md`](docs/sprint5-notifications-tests.md),
> and `frameworks/ts-playwright/documentation/testcases.xlsx`.

---

## Quickstart — contributors working on one framework only

You do **not** need the other framework's toolchain installed. Pick a side.

### Java / Selenium (Sprints 1–3)

```bash
cd frameworks/java-selenium
cp .env.example .env        # then fill in credentials (see DOCUMENTATION.md)
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
| [`.github/workflows/shared-docs.yml`](.github/workflows/shared-docs.yml) | changes under `docs/**` or `*.md` | markdown lint + link check |

A PR touching only `frameworks/ts-playwright/` will not run the Java pipeline,
and vice versa. Secrets are namespaced (`TEST_*` for Java, `TS_TEST_*` for TS)
so the two frameworks can target different tenants independently.

---

## Environment configuration

Each framework loads its own `.env` from its own directory (gitignored — never
commit). Config priority is the same on both sides:
**System Properties → `.env` file → Environment Variables**. Never hardcode
values; access config through the framework's config layer (`TestConfig` on the
Java side).

Java secrets reference: [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md) § CI Secrets.
GitHub repository secrets must be set under **Settings → Secrets → Actions**.

---

## Documentation

- [`docs/TEST_COVERAGE.md`](docs/TEST_COVERAGE.md) — Java feature-by-feature coverage matrix
- [`docs/DEFECTS.md`](docs/DEFECTS.md) — defect catalogue (bug screenshots in `docs/screenshots/`)
- [`docs/sprints/`](docs/sprints/) — user-story specs for sprints 1–5
- [`docs/adr/`](docs/adr/) — Architecture Decision Records
- [`MIGRATION.md`](MIGRATION.md) — how the two original repos were merged
- [`AGENTS.md`](AGENTS.md) — guidance for AI agents working in this repo
- [`frameworks/java-selenium/DOCUMENTATION.md`](frameworks/java-selenium/DOCUMENTATION.md) — Java framework deep dive
- [`frameworks/java-selenium/README.md`](frameworks/java-selenium/README.md) — Java quickstart