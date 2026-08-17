# StayBnB — Java/Selenium Framework

Deep-dive documentation for Framework A (`frameworks/java-selenium/`). Covers
setup, architecture, CI, conventions, and reporting. For the cross-framework
overview see [OVERVIEW.md](OVERVIEW.md); for first-time setup see
[SETUP.md](SETUP.md); for the quickstart see
[`frameworks/java-selenium/README.md`](../frameworks/java-selenium/README.md).

> This is one of two independent frameworks in the `staybnb-qa` monorepo. The
> other (`frameworks/ts-playwright/`) covers Sprints 4–5 — see
> [TS_PLAYWRIGHT.md](TS_PLAYWRIGHT.md).

## Overview

A **Selenium WebDriver end-to-end test automation framework** for an
Airbnb-like rental property management platform. It tests a multi-tenant web
app with URL pattern `/t/{slug}/` for tenant isolation. The framework covers
**UI tests** (Selenium) and **API tests** (REST Assured) across Sprints 1–3.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Java (JDK)** | 21 | Compilation and test execution |
| **Maven** | 3.9+ | Build automation and dependency management |
| **Google Chrome** | Latest stable | Browser for Selenium tests |
| **ChromeDriver** | Auto-managed by Selenium 4 | Browser automation driver |
| **Access to QA Playground** | — | `https://qa-playground.nixdev.co` (target application) |

> Selenium 4 includes a built-in driver manager — no manual ChromeDriver
> installation required.

---

## First-Time Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd staybnb/frameworks/java-selenium
```

### 2. Create the `.env` file

Create a `.env` file in the project root. **This file is gitignored and must
never be committed.** It contains environment-specific values that differ per
developer and per tenant.

```env
# -- Application URL --
TEST_BASE_URL=https://qa-playground.nixdev.co/t/<your-tenant-slug>

# -- Host User Credentials --
TEST_USER_EMAIL=<host-user-email>
TEST_PASSWORD=<host-user-password>
TEST_FIRST_NAME=<host-user-first-name>
TEST_LAST_NAME=<host-user-last-name>

# -- Non-Host (Guest) User Credentials --
NON_HOST_TEST_USER_EMAIL=<guest-user-email>
NON_HOST_TEST_PASSWORD=<guest-user-password>

# -- Property IDs (must exist in your tenant) --
TEST_DEFAULT_PROPERTY_ID=<published-property-id>
TEST_ONE_BOOKED_PROPERTY_ID=<property-with-bookings-id>
TEST_ZERO_BOOKED_PROPERTY_ID=<property-without-bookings-id>
TEST_TO_BOOK_PROPERTY_ID=<property-available-for-booking-id>
TEST_NOTIFY_BOOK_PROPERTY_ID=<property-for-notification-tests-id>
TEST_PROPERTY_FEW_AMENITIES_ID=<property-with-1-8-amenities-id>
TEST_PROPERTY_NO_AMENITIES_ID=<property-with-0-amenities-id>
TEST_PROPERTY_SINGLE_GUEST_ID=<property-with-max-guests-1-id>

# -- Other User (for profile tests) --
TEST_OTHER_USER_ID_1=<other-user-id>
```

### 3. Variable Reference

| Variable | Description | How to Determine |
|----------|-------------|------------------|
| `TEST_BASE_URL` | Full URL including your tenant slug | The QA playground URL for your tenant |
| `TEST_USER_EMAIL` | Email of a user with `isHost = true` | Register a user, enable hosting via the app |
| `TEST_PASSWORD` | Password for the host user | The password you registered with |
| `TEST_FIRST_NAME` | First name of the host user | Must match the registered user |
| `TEST_LAST_NAME` | Last name of the host user | Must match the registered user |
| `NON_HOST_TEST_USER_EMAIL` | Email of a user with `isHost = false` | Register a second user, do NOT enable hosting |
| `NON_HOST_TEST_PASSWORD` | Password for the non-host user | The password you registered with |
| `TEST_DEFAULT_PROPERTY_ID` | A published property with images, amenities, reviews | Create via UI or use a seeded property |
| `TEST_ONE_BOOKED_PROPERTY_ID` | A property with at least one confirmed booking | Create a booking on this property via API |
| `TEST_ZERO_BOOKED_PROPERTY_ID` | A property with no bookings | A newly created property |
| `TEST_TO_BOOK_PROPERTY_ID` | A property available for new booking tests | Must have open dates |
| `TEST_NOTIFY_BOOK_PROPERTY_ID` | Used for host notification tests | Must be owned by the host user |
| `TEST_PROPERTY_FEW_AMENITIES_ID` | Property with 1-8 amenities | Create and select a small number of amenities |
| `TEST_PROPERTY_NO_AMENITIES_ID` | Property with zero amenities | Create without selecting amenities |
| `TEST_PROPERTY_SINGLE_GUEST_ID` | Property with `max_guests = 1` | Create with max guests set to 1 |
| `TEST_OTHER_USER_ID_1` | Another user's ID for profile tests | Find via users API or database |

### 4. Optional: Customize wait timeouts

Edit `src/test/resources/config.properties` to adjust wait timeouts:

```properties
short.wait.seconds=5
medium.wait.seconds=10
long.wait.seconds=20
mobile.width=375
```

### 5. Verify the setup

```bash
mvn clean compile
mvn clean test -Dtest=RegisterTest -Dheadless=true
```

---

## Running Tests

```bash
mvn clean test                                                    # All tests (headed)
mvn clean test -Dheadless=true                                    # All tests headless
mvn clean test -Dtest=LoginTest                                   # Single class
mvn clean test -Dtest=LoginTest#testSuccessfulLoginRedirection    # Single method
mvn clean test -Dgroups=smoke                                     # By tag
mvn clean test -Dgroups=api                                       # API tests only
mvn clean compile                                                 # Compile only
mvn allure:serve                                                  # Open Allure report
```

---

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java 21 |
| Test Framework | JUnit 5 |
| Browser Automation | Selenium WebDriver 4.13 |
| API Testing | REST Assured 5.5 |
| Reporting | Allure 2.27 |
| Logging | Log4j2 (via SLF4J) |
| Environment Config | dotenv-java 3.0 |
| Build Tool | Maven |

### Layer Architecture

```
+---------------------------------------------------+
|                  TEST CLASSES                      |
|  (ui/auth/, ui/hosting/, api/booking/, etc.)       |
|  Extend BaseTest or BaseApiTest                    |
|  Contain ONLY business logic -- no Selenium calls  |
+--------------------------+------------------------+
                           | uses
+--------------------------v------------------------+
|                PAGE OBJECTS                        |
|  (pages/*.java)                                   |
|  One class per UI page                            |
|  All Selenium interactions live here              |
|  Fluent API: methods return next page object       |
+--------------------------+------------------------+
                           | uses
+--------------------------v------------------------+
|              COMPONENTS                            |
|  (components/*.java)                              |
|  Reusable UI: Navbar, SearchForm, PropertyCard    |
|  Extend BaseComponent -> SeleniumBase             |
+--------------------------+------------------------+
                           | uses
+--------------------------v------------------------+
|               CORE / CONFIG                        |
|  SeleniumBase: waits, clicks, URL helpers         |
|  DriverFactory: ThreadLocal ChromeDriver          |
|  Locators.java: ALL By selectors centralized      |
|  AppConstants/TestConfig: URLs, env vars           |
+---------------------------------------------------+
```

### Project Structure

```
frameworks/java-selenium/
+-- .env                              # Environment config (gitignored)
+-- pom.xml                           # Maven build config
+-- Jenkinsfile                       # Jenkins pipeline (optional CI)
+-- Dockerfile                        # Jenkins agent image with Chrome
+-- README.md                         # Quickstart
|
+-- src/main/java/com/staybnb/
|   +-- config/                       # Configuration layer
|   |   +-- TestConfig.java           # Loads .env / system props / env vars
|   |   +-- ConfigProperties.java     # Loads config.properties
|   |   +-- AppConstants.java         # URL constants, slug resolution
|   |   +-- DriverFactory.java        # ThreadLocal ChromeDriver factory
|   |   +-- WaitConstants.java        # Wait timeouts, viewport dimensions
|   |   +-- TestDataConstants.java    # Test data (property IDs, dates, etc.)
|   |
|   +-- core/
|   |   +-- SeleniumBase.java         # Base class: waits, clicks, URL helpers
|   |
|   +-- locators/
|   |   +-- Locators.java             # ALL Selenium By selectors (centralized)
|   |
|   +-- pages/                        # Page Object Model classes
|   |   +-- BasePage.java             # Abstract page: navbar, token, navigation
|   |   +-- LoginPage.java
|   |   +-- RegisterPage.java
|   |   +-- HomePage.java
|   |   +-- ProfilePage.java
|   |   +-- EditProfilePage.java
|   |   +-- PropertyListingPage.java
|   |   +-- PropertyDetailsPage.java
|   |   +-- HostDashboardPage.java
|   |   +-- CreatePropertyPage.java
|   |   +-- EditPropertyPage.java
|   |   +-- DeletePropertyPage.java
|   |   +-- PublishPropertyPage.java
|   |   +-- WishlistPage.java
|   |   +-- MyBookingsPage.java
|   |   +-- BookingApiPage.java
|   |   +-- AmenitiesApiPage.java
|   |   +-- CategoriesApiPage.java
|   |
|   +-- components/                   # Reusable UI components
|   |   +-- BaseComponent.java
|   |   +-- Navbar.java
|   |   +-- SearchForm.java
|   |   +-- PropertyCard.java
|   |   +-- PropertyGrid.java
|   |   +-- HostDashboardCard.java
|   |
|   +-- model/
|   |   +-- Notification.java
|   |
|   +-- resources/com/staybnb/scripts/ # JS snippets for executeScript
|       +-- becomeHostApi.js
|       +-- createPropertyApi.js
|       +-- updatePropertyApi.js
|       +-- deletePropertyApi.js
|       +-- getAuthMeApi.js
|       +-- ... (30+ scripts)
|
+-- src/test/java/com/staybnb/
|   +-- tests/
|   |   +-- BaseTest.java             # WebDriver setup/teardown
|   |   +-- BaseApiTest.java          # API helpers (auth, login, token injection)
|   |   +-- ui/                       # UI test classes (35 files)
|   |   |   +-- auth/                 # RegisterTest, LoginTest, LogoutTest
|   |   |   +-- navigation/           # NavbarTest, HomeTest
|   |   |   +-- profile/              # OwnProfileTest, EditProfileTest, OtherProfileTest
|   |   |   +-- hosting/              # BecomeHostTest, HostDashboardTest, etc.
|   |   |   +-- createproperty/       # CreatePropertyStep1-7Test, NavigationTest
|   |   |   +-- property/             # PropertyDetailsTest, BookingWidgetTest, etc.
|   |   |   +-- search/               # SearchTest, FilterTests, SortTest, PaginateTest
|   |   |   +-- wishlist/             # AddToWishlistTest, RemoveFromWishlistTest, etc.
|   |   +-- api/                      # API test classes (17 files)
|   |       +-- auth/                 # RegisterApiTest, LoginApiTest, LogoutApiTest
|   |       +-- profile/              # OtherUserApiTest, UpdateProfileApiTest
|   |       +-- hosting/              # BecomeHostApiTest, HostingPropertiesApiTest, etc.
|   |       +-- createproperty/       # CreatePropertyApiTest, ImageUploadApiTest
|   |       +-- booking/              # BookingApiTest, BookingValidationApiTest, etc.
|   |       +-- property/             # AmenitiesApiTest, CategoriesApiTest
|   |
|   +-- extensions/
|   |   +-- ScreenshotOnFailureExtension.java
|   |   +-- RetryExtension.java
|   |
|   +-- annotations/
|   |   +-- Retry.java
|   |
|   +-- assertions/
|   |   +-- ErrorMessages.java        # All assertion message constants
|   |
|   +-- data/
|       +-- PropertyPayloads.java     # JSON payload templates
|       +-- MediaPaths.java           # Test image paths
|
+-- src/test/resources/
    +-- config.properties             # Wait timeouts, mobile width
    +-- junit-platform.properties     # Parallel execution config
    +-- allure.properties             # Allure report config
    +-- log4j2.xml                    # Logging config
    +-- payloads/                     # JSON templates
        +-- create-property.json
        +-- edit-property.json
```

### Key Design Patterns

1. **Page Object Model** — Each UI page has a corresponding Java class. Selenium interactions are encapsulated in page methods; tests call page methods only.
2. **Fluent Page Objects** — Page methods that trigger navigation return the next page object.
3. **Centralized Locators** — All `By` selectors in `Locators.java` organized by inner classes.
4. **Component Abstraction** — Reusable UI fragments extend `BaseComponent` and are composed into page objects.
5. **ThreadLocal Driver** — `DriverFactory` uses `ThreadLocal<WebDriver>` for parallel safety.
6. **JS Script Externalization** — JavaScript snippets stored as `.js` files in `resources/`, not inline strings.
7. **Extension Points** — `ScreenshotOnFailureExtension` (Allure screenshots), `RetryExtension` (3 retries with fresh browser).

### Config Priority Chain

```
System Property (-DTEST_BASE_URL=...)  <-- highest
        |
.env file (project root)
        |
Environment Variable (export TEST_BASE_URL=...)  <-- lowest
```

---

## CI/CD — GitHub Actions

### Workflow: `.github/workflows/java-selenium.yml`

| Stage | Trigger | What Happens |
|-------|---------|-------------|
| **Trigger** | Push to `main` or PR to `main` | Workflow starts |
| **Setup** | — | Checkout code, JDK 21 (Temurin), cache Maven |
| **Build & Test** | — | `mvn -B clean test` (headless Chrome on Ubuntu) |
| **Artifacts** | On failure only | Upload `target/screenshots/` as downloadable artifact |

### CI-Specific Behaviors

- **Auto headless** — `DriverFactory.isHeadlessMode()` detects CI (no debugger) and enables `--headless=new`, `--no-sandbox`, `--disable-dev-shm-usage`
- **Window size** — 1920x1080 in headless mode for consistent rendering
- **Screenshots** — `ScreenshotOnFailureExtension` captures PNG on failure, attaches to Allure + uploads as artifact
- **Parallel execution** — JUnit 5 configured for concurrent class execution in `junit-platform.properties`

### Required GitHub Secrets

Set in **Settings → Secrets → Actions**:

```
TEST_BASE_URL
TEST_USER_EMAIL
TEST_PASSWORD
TEST_FIRST_NAME
TEST_LAST_NAME
NON_HOST_TEST_USER_EMAIL
NON_HOST_TEST_PASSWORD
TEST_DEFAULT_PROPERTY_ID
TEST_ONE_BOOKED_PROPERTY_ID
TEST_ZERO_BOOKED_PROPERTY_ID
TEST_TO_BOOK_PROPERTY_ID
TEST_NOTIFY_BOOK_PROPERTY_ID
TEST_PROPERTY_FEW_AMENITIES_ID
TEST_PROPERTY_NO_AMENITIES_ID
TEST_PROPERTY_SINGLE_GUEST_ID
TEST_OTHER_USER_ID_1
```

---

## Test Conventions

- **One assertion per test** — exactly one behavior per method
- **No Selenium in tests** — delegate to page objects
- **No `Thread.sleep()`** — `WebDriverWait` / `FluentWait` only
- **No inline locators** — all in `Locators.java`
- **No `System.out.println()`** — Log4j2 only
- **`@Tag` on all tests** — `smoke`, `api`, `regression`, `ui`
- **`@DisplayName`** — human-readable names for Allure
- **Error messages from `ErrorMessages.java`**
- **Cleanup in `@AfterEach`**

### Test Tags

| Tag | Purpose | File Count | Test Count |
|-----|---------|------------|------------|
| `smoke` | Quick sanity checks | 3 | 10 |
| `regression` | Full regression suite | 35 | 238 |
| `api` | API-only tests (REST Assured) | 17 | 55 |

### Test Summary

| Metric | Count |
|--------|-------|
| **Total test files** | 55 |
| **Total @Test methods** | 283 |
| **Total @ParameterizedTest methods** | 20 |
| **Total test methods** | 303 |

---

## Reporting

Allure reports are generated automatically:

```bash
mvn clean test          # Results go to target/allure-results/
mvn allure:serve        # Opens report in browser
```

The Allure report includes:
- Test execution summary (pass/fail/skip)
- Screenshots attached to failed tests
- Test duration and history trends
- Epic/Feature/Story grouping via `@Epic` and `@Feature` annotations
