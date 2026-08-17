# StayBnB — First-Time Setup & Environment Guide

This is the **only file you need to touch on a fresh machine or new tenant**. Everything that varies between environments is listed here. After editing `.env` and confirming the property IDs exist in your tenant, the suite runs as-is.

> Full reference: [DOCUMENTATION.md](../DOCUMENTATION.md). This file is the condensed, action-first version.

---

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| JDK | 21 | `java -version` should print 21.x |
| Maven | 3.8+ | `mvn -v` |
| Google Chrome | latest stable | Selenium 4 auto-manages ChromeDriver — no manual install |
| Access to QA playground | — | `https://qa-playground.nixdev.co` |

---

## 2. Create `.env` (gitignored — never commit)

Create a file named `.env` in the project root. Copy this template and fill in values for **your tenant**:

```env
# --- Application URL (per tenant) ---
TEST_BASE_URL=https://qa-playground.nixdev.co/t/<your-tenant-slug>

# --- Host user (must have isHost=true) ---
TEST_USER_EMAIL=<host-email>
TEST_PASSWORD=<host-password>
TEST_FIRST_NAME=<host-first-name>
TEST_LAST_NAME=<host-last-name>

# --- Guest user (must have isHost=false) ---
NON_HOST_TEST_USER_EMAIL=<guest-email>
NON_HOST_TEST_PASSWORD=<guest-password>

# --- Property IDs (must exist in your tenant) ---
TEST_DEFAULT_PROPERTY_ID=<id>
TEST_ONE_BOOKED_PROPERTY_ID=<id>
TEST_ZERO_BOOKED_PROPERTY_ID=<id>
TEST_TO_BOOK_PROPERTY_ID=<id>
TEST_NOTIFY_BOOK_PROPERTY_ID=<id>
TEST_PROPERTY_FEW_AMENITIES_ID=<id>
TEST_PROPERTY_NO_AMENITIES_ID=<id>
TEST_PROPERTY_SINGLE_GUEST_ID=<id>

# --- Another user in your tenant ---
TEST_OTHER_USER_ID_1=<id>
```

### Config priority
`-D` system property  →  `.env` file  →  OS environment variable.

---

## 3. Variable reference — what varies per environment

These are the values that **change every time you move to a new tenant or machine**. Nothing else needs editing.

| Variable | What it is | How to determine |
|---|---|---|
| `TEST_BASE_URL` | Full tenant URL | Your QA playground tenant slug |
| `TEST_USER_EMAIL` | Host account email | Register a user, then enable hosting (UI button or `becomeHostApi.js`) |
| `TEST_PASSWORD` | Host password | The password you registered |
| `TEST_FIRST_NAME` / `TEST_LAST_NAME` | Host display name | Must exactly match the registered user |
| `NON_HOST_TEST_USER_EMAIL` / `NON_HOST_TEST_PASSWORD` | Guest account | Register a second user and **do not** enable hosting |
| `TEST_DEFAULT_PROPERTY_ID` | Published property with images/amenities/reviews | Create once via UI, or reuse a seeded property |
| `TEST_ONE_BOOKED_PROPERTY_ID` | Property with ≥1 confirmed booking | Book it once via API |
| `TEST_ZERO_BOOKED_PROPERTY_ID` | Property with zero bookings | Newly created property |
| `TEST_TO_BOOK_PROPERTY_ID` | Property with open dates for new booking tests | Any bookable property |
| `TEST_NOTIFY_BOOK_PROPERTY_ID` | Property owned by the **host user** used for notification tests | Must belong to `TEST_USER_EMAIL` |
| `TEST_PROPERTY_FEW_AMENITIES_ID` | Property with 1–8 amenities | Create with a small amenity selection |
| `TEST_PROPERTY_NO_AMENITIES_ID` | Property with 0 amenities | Create without amenities |
| `TEST_PROPERTY_SINGLE_GUEST_ID` | Property with `max_guests = 1` | Create with max guests set to 1 |
| `TEST_OTHER_USER_ID_1` | Another user's ID (profile tests) | From users API or DB |

> **Per-tenant note:** the 9 property IDs are tenant-scoped. If you switch tenants, you must recreate or re-seed these properties and update `.env` — the suite does not create them on its own.

---

## 4. Optional: adjust waits

Edit `src/test/resources/config.properties`:

```properties
short.wait.seconds=5
medium.wait.seconds=10
long.wait.seconds=20
mobile.width=375
```

---

## 5. Verify the setup

```bash
mvn clean compile
mvn clean test -Dtest=RegisterTest -Dheadless=true
```

If `RegisterTest` passes, your `.env` is correct.

---

## 6. CI/CD environment configuration

### GitHub Actions secrets
Set under **Settings → Secrets → Actions**:

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
TEST_OTHER_USER_ID_1
TEST_PROPERTY_SINGLE_GUEST_ID
```

### Jenkins credentials
In Jenkins → Credentials, create two **Secret text** entries:

| Credential ID | Value |
|---|---|
| `staybnb-test-user` | Your host email (maps to `TEST_USER` in the pipeline) |
| `staybnb-test-password` | Your host password |

The `Jenkinsfile` also exposes `TEST_BASE_URL` as a build parameter (default: `https://qa-playground.nixdev.co/t/automation-adel`) so you can point at a different tenant per run without touching code.

---

## 7. What you do NOT need to change between environments

- Any Java source file
- `Locators.java`
- `pom.xml`
- GitHub Actions / Jenkinsfile (beyond the secrets above)
- `config.properties` (unless you want different timeouts)
