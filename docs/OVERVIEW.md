# StayBnB — Framework Overview

Short, high-level documentation of how the framework works, its architecture, and the CI/CD setup. For deep detail see [DOCUMENTATION.md](../DOCUMENTATION.md); for first-time setup see [SETUP.md](SETUP.md).

---

## What it is

Selenium WebDriver end-to-end test framework for an Airbnb-like rental platform. The app under test is **multi-tenant** — each tenant is isolated behind a URL slug: `/t/{slug}/`.

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Test runner | JUnit 5 (parallel classes) |
| UI automation | Selenium WebDriver 4.13 (auto-managed ChromeDriver) |
| API automation | REST Assured 5.5 |
| Reporting | Allure 2.27 (+ screenshots on failure) |
| Logging | Log4j2 via SLF4J |
| Config | dotenv-java (`.env` + env vars + `-D` system props) |

**Test totals:** ~50 concrete test classes, ~311 test methods. 21 UI classes tagged `smoke`/`regression` and 17 API classes tagged `api`.

---

## How it works (lifecycle of one test)

1. `BaseTest` starts a `ChromeDriver` via `DriverFactory` (ThreadLocal → parallel-safe). Headless mode is enabled automatically in CI or when `-Dheadless=true`.
2. `TestConfig` resolves config in priority order: `-D` system property → `.env` file → OS environment variables. Nothing is hardcoded.
3. The test calls **page object methods only** — no raw Selenium in tests. Pages extend `BasePage` (navbar, JWT token from localStorage).
4. Waits are centralized in `SeleniumBase` using `WebDriverWait` with timeouts from `AppConstants` (`SHORT=5s`, `MEDIUM=10s`, `LONG=20s`). `Thread.sleep()` is prohibited.
5. Locators live in a single file: `locators/Locators.java`.
6. JavaScript snippets (e.g., `becomeHostApi.js` to set up preconditions via the backend) live in `src/main/resources/com/staybnb/scripts/` and are executed via `executeScript`.
7. On failure, `ScreenshotOnFailureExtension` captures a PNG and attaches it to the Allure report; `RetryExtension` retries the test up to 3 times with a fresh browser.
8. Results are written to `target/allure-results/` — view with `mvn allure:serve`.

---

## Architecture

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

Key design patterns:
- **Page Object Model** — one class per UI page.
- **Fluent pages** — navigation methods return the next page object.
- **Centralized locators** — every `By` selector in `Locators.java`.
- **ThreadLocal driver** — `DriverFactory` for safe parallel execution.
- **Externalized JS** — no inline script strings.
- **Extensions over base classes** — screenshot + retry via JUnit `@ExtendWith`.

Full structure: [DOCUMENTATION.md](../DOCUMENTATION.md#project-structure).

---

## Test conventions (enforced)

- One assertion per test; assertions use messages from `ErrorMessages.java`.
- No Selenium calls, waits, or `Thread.sleep()` inside tests — all in page objects.
- Every test has `@Tag` (`smoke`/`regression`/`api`) and `@DisplayName`.
- No `System.out.println()` — Log4j2 only.
- Layout state is cleaned in `@AfterEach`; tests are fully independent and parallel-safe.
- URL assertions via `isUrlContains()` from `BaseTest`.

---

## CI/CD setup

### GitHub Actions — `.github/workflows/maven.yml`
| Stage | Details |
|---|---|
| Trigger | Push / PR to `main`, plus `workflow_dispatch` |
| Runner | `ubuntu-latest` |
| Steps | checkout → setup JDK 21 (Temurin, Maven cache) → `mvn -B clean test` |
| Artifacts | On failure only: uploads `target/screenshots/` as a downloadable artifact |
| Headless | Auto-detected by `DriverFactory` (adds `--headless=new --no-sandbox --disable-dev-shm-usage`, 1920×1080) |
| Secrets | 16 secrets (URLs, credentials, property IDs) — see [SETUP.md](SETUP.md#github-actions-secrets) |

### Jenkins — `Jenkinsfile`
| Stage | Details |
|---|---|
| Agent | `agent any`, Maven tool `maven3` |
| Parameter | `TEST_BASE_URL` (default points at the QA playground tenant) |
| Credentials | `staybnb-test-user` and `staybnb-test-password` injected via `withCredentials` |
| Command | `mvn clean test -Dheadless=true -DTEST_BASE_URL=... -DTEST_USER=... -DTEST_PASSWORD=...` |
| Post | Publishes JUnit results from `target/surefire-reports/*.xml` |

### Jenkins runner image — `Dockerfile`
Custom image built on `jenkins/jenkins:lts` that installs `google-chrome-stable` so the Jenkins agent can run headless Chrome. Build once, use as the Jenkins node image.

---

## Common commands

```bash
mvn clean test                       # all tests (headed)
mvn clean test -Dheadless=true       # headless
mvn clean test -Dtest=LoginTest      # single class
mvn clean test -Dgroups=smoke        # by tag (smoke | regression | api)
mvn allure:serve                     # open Allure report
```
