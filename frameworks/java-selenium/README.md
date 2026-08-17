# java-selenium

Sprint 1–3 end-to-end test automation for the StayBnB platform — Java 21,
Selenium WebDriver 4, JUnit 5, REST Assured, and Allure.

> One of two independent frameworks in the `staybnb-qa` monorepo. The other
> (`frameworks/ts-playwright/`) covers Sprints 4–5. See the root
> [`README.md`](../../README.md) for the unified overview and coverage matrix.

- **Deep dive** (architecture, full env reference, CI secrets, reporting):
  [`docs/JAVA_SELENIUM.md`](../../docs/JAVA_SELENIUM.md)
- **First-time setup** (both frameworks): [`docs/SETUP.md`](../../docs/SETUP.md)
- **Architecture overview** (both frameworks): [`docs/OVERVIEW.md`](../../docs/OVERVIEW.md)

## Prerequisites

- Java 21+
- Maven 3.9+
- Google Chrome (latest stable) — Selenium 4 manages ChromeDriver for you

## Quick start

```bash
cp .env.example .env          # then fill in credentials (see docs/SETUP.md)
mvn clean test                           # all tests, headed
mvn clean test -Dheadless=true           # headless (auto-enabled in CI)
mvn clean test -Dtest=LoginTest          # single class
mvn clean test -Dtest=LoginTest#testSuccessfulLoginRedirection   # single method
mvn clean test -Dgroups=smoke,api        # by tag
mvn clean compile                        # compile only
mvn allure:serve                         # generate + open Allure report
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

Plus non-host credentials, eight property IDs, and another user ID — see
[`docs/JAVA_SELENIUM.md`](../../docs/JAVA_SELENIUM.md) § Variable Reference for
the full list and [`docs/SETUP.md`](../../docs/SETUP.md) § CI/CD for the GitHub
Actions secret names.

Config priority: System Properties (`-D`) → `.env` → Environment Variables.
All values flow through `TestConfig`; never hardcode.

## Test tags

| Tag | Scope |
|-----|-------|
| `smoke` | Core auth journeys |
| `regression` | Full UI coverage |
| `api` | REST API validation |
| `mobile` | Mobile viewport checks |

## Architecture (at a glance)

```
Tests (ui/, api/)        →  Page Objects (fluent)  →  Components  →  Core/Config
                                                         (SeleniumBase, DriverFactory,
                                                          Locators.java, TestConfig)
```

Key points: `DriverFactory` is `ThreadLocal<WebDriver>` (parallel-safe);
`BaseTest` auto-detects CI and enables headless Chrome; all `By` selectors
live in `Locators.java`; test images live in `../../shared/test-data/media/apts/`
(`MediaPaths` resolves them from the Maven project root via `user.dir`).

Full layer diagram, project tree, and design patterns:
[`docs/JAVA_SELENIUM.md`](../../docs/JAVA_SELENIUM.md) § Architecture.

## CI

`.github/workflows/java-selenium.yml` runs `mvn -B clean test -Dheadless=true`
whenever something under `frameworks/java-selenium/**` changes. Required
secrets are listed in [`docs/JAVA_SELENIUM.md`](../../docs/JAVA_SELENIUM.md)
§ Required GitHub Secrets.

A Jenkins pipeline is also provided at [`Jenkinsfile`](Jenkinsfile) — run it
as a Multibranch Pipeline with Script Path `frameworks/java-selenium/Jenkinsfile`.
Required Jenkins credentials (Secret text, namespaced `staybnb-*`) and tool
names are documented in the `Jenkinsfile` header comment.

## Further reading

- [`docs/All-Tests.md`](../../docs/All-Tests.md) — cross-framework test index (every implemented test, both frameworks)
- [`docs/DEFECTS.md`](../../docs/DEFECTS.md) — defect catalogue
- [`docs/BOOKING_LOGIC.md`](../../docs/BOOKING_LOGIC.md) — booking test logic reference (cross-framework)
