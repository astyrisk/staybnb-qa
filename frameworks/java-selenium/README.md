# java-selenium

Sprint 1–3 end-to-end test automation for the StayBnB platform, using Java 21,
Selenium WebDriver 4, JUnit 5, REST Assured, and Allure.

> This is one of two frameworks in the `staybnb-qa` monorepo. The other
> (`frameworks/ts-playwright/`) covers Sprints 4–5. See the root
> [`README.md`](../../README.md) and [`AGENTS.md`](../../AGENTS.md) for the
> unified overview.

## Prerequisites

- Java 21+
- Maven 3.9+
- Google Chrome (latest stable) — Selenium 4 manages ChromeDriver for you

## Quick start

```bash
cp .env.example .env          # then fill in credentials (see DOCUMENTATION.md)
mvn clean test                           # all tests, headed
mvn clean test -Dheadless=true           # headless (auto-enabled in CI)
mvn clean test -Dtest=LoginTest          # single class
mvn clean test -Dtest=LoginTest#testSuccessfulLoginRedirection   # single method
mvn clean test -Dgroups=smoke,api        # by tag
mvn clean compile                        # compile only
mvn allure:serve                        # generate + open Allure report
```

## Environment

Config lives in `.env` (gitignored — never commit it). Minimum required:

```
TEST_BASE_URL=https://qa-playground.nixdev.co/t/<slug>
TEST_USER_EMAIL=<host-user-email>
TEST_PASSWORD=<host-user-password>
TEST_FIRST_NAME=<first>
TEST_LAST_NAME=<last>
```

Plus non-host credentials, property IDs, and another user ID — see
[DOCUMENTATION.md](DOCUMENTATION.md) for the full variable reference and CI
secrets.

Config priority: System Properties (`-D`) → `.env` → Environment Variables.
All values flow through `TestConfig`; never hardcode.

## Test tags

| Tag | Scope |
|-----|-------|
| `smoke` | Core auth journeys |
| `regression` | Full UI coverage |
| `api` | REST API validation |
| `mobile` | Mobile viewport checks |

## Architecture

| Layer | Location | Responsibility |
|---|---|---|
| Tests | `src/test/java/com/staybnb/tests/{ui,api}/` | Business logic + assertions only |
| Pages | `src/main/java/com/staybnb/pages/` | All Selenium interactions (fluent) |
| Components | `src/main/java/com/staybnb/components/` | Reusable UI fragments |
| Locators | `src/main/java/com/staybnb/locators/Locators.java` | Centralized `By` selectors |
| Config | `src/main/java/com/staybnb/config/` | Env, URLs, timeouts, `DriverFactory` |
| Extensions | `src/test/java/com/staybnb/extensions/` | Screenshot capture, test retry |
| Data | `src/test/java/com/staybnb/data/` | `PropertyPayloads`, `MediaPaths` |

Key patterns:
- `DriverFactory` uses `ThreadLocal<WebDriver>` for parallel safety.
- `BaseTest` auto-detects CI (GitHub Actions / Jenkins) and enables headless Chrome.
- `media/` is co-located here so `MediaPaths` relative paths resolve from the project root.
- All waits live in page classes via `WebDriverWait` — no `Thread.sleep()`.
- One assertion per test; multi-condition UI checks use `assertAll()`.
- Extension order: `AllureJunit5` → `ScreenshotOnFailureExtension` → `RetryExtension`.

## CI

`.github/workflows/java-selenium.yml` runs `mvn -B clean test -Dheadless=true`
whenever something under `frameworks/java-selenium/**` changes. Required secrets
are listed in [DOCUMENTATION.md](DOCUMENTATION.md) § CI Secrets.

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) — full setup, env reference, architecture, CI secrets
- [../../docs/TEST_COVERAGE.md](../../docs/TEST_COVERAGE.md) — feature-by-feature coverage matrix
- [../../docs/DEFECTS.md](../../docs/DEFECTS.md) — defect catalogue
- [../../docs/adr/](../../docs/adr/) — Architecture Decision Records