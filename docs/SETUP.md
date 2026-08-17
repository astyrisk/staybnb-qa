# StayBnB QA — First-Time Setup

The **only files you touch on a fresh machine or per tenant** are the two `.env`
files (one per framework). Everything else is environment-agnostic. Pick the
framework(s) you intend to run — you do **not** need both toolchains installed.

> Condensed, action-first guide. Full references:
> Java — [JAVA_SELENIUM.md](JAVA_SELENIUM.md);
> TS — [TS_PLAYWRIGHT.md](TS_PLAYWRIGHT.md).

---

## 1. Prerequisites

| Tool | For | Version |
|------|-----|---------|
| JDK | Framework A (Java) | 21 |
| Maven | Framework A | 3.9+ |
| Google Chrome | Framework A | latest stable (Selenium 4 auto-manages ChromeDriver) |
| Node.js | Framework B (TS) | 20+ |
| Access to the QA playground | Both | `https://qa-playground.nixdev.co` |

Playwright provisions its own Chromium, so no separate browser install is needed
for Framework B.

---

## 2. Create the `.env` file(s)

Each framework loads its own `.env` from **its own directory** (gitignored — never
commit). Copy the template and fill in values for **your tenant**.

### Framework A — Java/Selenium

```bash
cd frameworks/java-selenium
cp .env.example .env
```

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

### Framework B — TS/Playwright

```bash
cd frameworks/ts-playwright
cp .env.example .env
```

```env
BASE_URL=https://qa-playground.nixdev.co/t/<your-tenant-slug>
API_BASE_URL=https://qa-playground.nixdev.co/api/t/<your-tenant-slug>
API_KEY=<your-api-key>
HOST_USER_EMAIL=<host-email>
HOST_USER_PASSWORD=<host-password>
GUEST_USER_EMAIL=<guest-email>
GUEST_USER_PASSWORD=<guest-password>
```

> `support/env.ts` hard-fails if any of these are missing.

### Config priority (both frameworks)

System Properties / process env (CI)  →  `.env` file  →  (no fallback).
Never hardcode values; access config through `TestConfig` (Java) or `env` from
`support/env.ts` (TS).

---

## 3. What varies per tenant

| Variable | What it is | How to determine |
|---|---|---|
| `TEST_BASE_URL` / `BASE_URL` | Full tenant URL | Your QA playground tenant slug |
| `API_BASE_URL` (TS) | Backend API root | `{playground}/api/t/{slug}` |
| `API_KEY` (TS) | API key for the backend | Tenant admin / settings |
| Host user creds | A user with `isHost=true` | Register, then enable hosting (UI button or `becomeHostApi.js`) |
| Guest user creds | A user with `isHost=false` | Register a second user; do not enable hosting |
| `TEST_*_PROPERTY_ID` (Java) | 8 tenant-scoped property IDs | Create via UI or reuse seeded properties |
| `TEST_OTHER_USER_ID_1` (Java) | Another user's ID | From users API or DB |

> The Java property IDs are **tenant-scoped**. If you switch tenants, you must
> recreate/re-seed these properties and update `.env` — the suite does not create
> them on its own.

Full Java variable reference:
[JAVA_SELENIUM.md](JAVA_SELENIUM.md) § Variable Reference.

---

## 4. Optional — adjust waits (Java)

Edit `frameworks/java-selenium/src/test/resources/config.properties`:

```properties
short.wait.seconds=5
medium.wait.seconds=10
long.wait.seconds=20
mobile.width=375
```

---

## 5. Verify the setup

### Framework A
```bash
cd frameworks/java-selenium
mvn clean compile
mvn clean test -Dtest=RegisterTest -Dheadless=true
```

### Framework B
```bash
cd frameworks/ts-playwright
npm ci
npx playwright install --with-deps chromium
npx playwright test tests/api/auth/login.spec.ts
```

If those pass, your `.env` is correct.

---

## 6. CI/CD — GitHub Actions secrets

Set under **Settings → Secrets → Actions**. Secrets are namespaced so the two
frameworks can target different tenants.

### Java pipeline (`java-selenium.yml`)
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

### TS pipeline (`ts-playwright.yml`)
The workflow maps `TS_TEST_*` secrets to the env keys `support/env.ts` reads:
```
TS_TEST_BASE_URL              → BASE_URL
TS_TEST_API_BASE_URL          → API_BASE_URL
TS_TEST_API_KEY               → API_KEY
TS_TEST_HOST_USER_EMAIL       → HOST_USER_EMAIL
TS_TEST_HOST_USER_PASSWORD    → HOST_USER_PASSWORD
TS_TEST_GUEST_USER_EMAIL      → GUEST_USER_EMAIL
TS_TEST_GUEST_USER_PASSWORD   → GUEST_USER_PASSWORD
```

---

## 7. Optional — Jenkins

A `Jenkinsfile` is included in each framework directory for teams that prefer
Jenkins over GitHub Actions. Each runs as a standalone Multibranch Pipeline.

| Pipeline | Script path | Runs |
|---|---|---|
| java-selenium | `frameworks/java-selenium/Jenkinsfile` | `mvn -B clean test -Dheadless=true` + JUnit + Allure |
| ts-playwright | `frameworks/ts-playwright/Jenkinsfile` | `npm ci` → `npx playwright install --with-deps chromium` → `npx playwright test` |

Create one Multibranch Pipeline per framework and set its **Script Path** to the
corresponding `Jenkinsfile`. Each `Jenkinsfile` header documents:

- the **Secret text** credential IDs it expects (namespaced `staybnb-*` for Java,
  `staybnb-ts-*` for TS), and
- the **Global Tool Configuration** names it requires (`jdk-21`, `maven3`,
  `Node-20`; Allure Commandline for the Java pipeline).

The Java `Dockerfile` builds a Jenkins controller/agent image with
`google-chrome-stable` pre-installed for headless Chrome. GitHub Actions is the
default CI; Jenkins is provided as an alternative.

---

## 8. What you do NOT change between environments

- Any Java/TS source file
- `Locators.java` / `support/data/selectors.ts`
- `pom.xml` / `package.json`
- Workflow files (beyond the secrets above)
- `config.properties` / `playwright.config.ts` (unless tuning timeouts)
