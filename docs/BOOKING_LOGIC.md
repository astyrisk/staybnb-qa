# StayBnB Booking Logic — Implementation Reference

A framework-agnostic description of how booking is tested in this repo (Java + Selenium + REST Assured). Use this to reimplement the same coverage in any stack (Playwright, Cypress, Pytest+requests, Cucumber, etc.).

The SUT is an Airbnb-like, multi-tenant rental app. All URLs are tenant-scoped under `/t/{slug}/...`. Booking has two surfaces: a **UI booking widget** on the property details page, and a **REST API** at `/api/t/{slug}/bookings`.

---

## 1. Domain Model

### Booking entity (server-returned)
| Field          | Type    | Notes                                                      |
|----------------|---------|------------------------------------------------------------|
| `id`           | int     | Booking identifier, also used as URL segment after reserve |
| `propertyId`   | int     | FK to property being booked                                |
| `checkIn`      | string  | ISO date `YYYY-MM-DD`                                      |
| `checkOut`     | string  | ISO date `YYYY-MM-DD`, must be strictly after `checkIn`    |
| `numGuests`    | int     | Must be `>=1` and `<= property.maxGuests`                  |
| `status`       | enum    | New bookings are created as `PENDING`                      |

### Notification (delivered to host on booking)
| Field            | Type    | Notes                                                |
|------------------|---------|------------------------------------------------------|
| `id`             | int     |                                                      |
| `tenant_id`      | int     |                                                      |
| `user_id`        | int     | Host receiving the notification                      |
| `type`           | string  | e.g. `BOOKING_CREATED`, `BOOKING_CANCELLED`          |
| `title`          | string  |                                                      |
| `message`        | string  |                                                      |
| `reference_type` | string  | `BOOKING`                                            |
| `reference_id`   | int     | The `booking.id` this notification refers to         |
| `is_read`        | boolean |                                                      |
| `created_at`     | string  | ISO timestamp                                        |

---

## 2. REST API Contract

Base URL: `{baseRoot}/api/t/{slug}`

### Create booking
- **Method/Path:** `POST /bookings`
- **Auth:** Bearer JWT in `Authorization` header (token stored client-side in `localStorage` key `staybnb_token`)
- **Body (JSON):**
  ```json
  { "propertyId": 123, "checkIn": "2026-05-20", "checkOut": "2026-05-26", "numGuests": 1 }
  ```
- **Responses:**
  | Status | Condition                                                       |
  |--------|-----------------------------------------------------------------|
  | 200    | Created, response body includes `id` and `status: "PENDING"`    |
  | 400    | Invalid date range (`checkOut <= checkIn`)                      |
  | 400    | `numGuests` exceeds property's `maxGuests`                      |
  | 400    | Missing any required field (`propertyId`, `checkIn`, `checkOut`, `numGuests`) |
  | 401    | No/invalid token                                                |
  | 409    | Requested range overlaps an existing booking for that property  |

### Cancel booking
- **Method/Path:** `PUT /bookings/{bookingId}/cancel`
- **Auth:** Bearer JWT of the user who made the booking.
- Used for cleanup after each test that created a booking.

### Property availability
- **Method/Path:** `GET /properties/{propertyId}/availability`
- **Auth:** Optional Bearer JWT (request still works unauthenticated, but include it when available).
- **Response shape:**
  ```json
  { "bookedDates": [ { "checkIn": "2026-05-08", "checkOut": "2026-05-22" }, ... ] }
  ```
- Each entry is a half-open range `[checkIn, checkOut)` of booked nights.

### Notifications
- **Method/Path:** `GET /notifications` (tenant-scoped)
- **Auth:** Bearer JWT of the host.
- **Response shape:** `{ "notifications": [ Notification, ... ] }`
- "Active" booking notifications are filtered as `type != "BOOKING_CANCELLED"`.

---

## 3. UI Booking Widget

The widget sits on the property details page and consists of:

| Control            | Behavior                                                                                       |
|--------------------|------------------------------------------------------------------------------------------------|
| Price per night    | Always displayed; contains `$`                                                                  |
| Check-in picker    | Button that opens a date-picker overlay/modal                                                   |
| Check-out picker   | Same overlay; user picks two days inside it                                                     |
| Guest selector     | Numeric counter with `-` / `+` buttons; defaults to **1**; `+` disabled at `property.maxGuests` |
| Reserve button     | Submits the booking                                                                             |
| Price breakdown    | Appears only **after** a valid check-in + check-out pair is selected                            |
| Inline error area  | For inline auth/validation errors (in practice, unauthenticated Reserve redirects to login)     |

### Date picker
- Available days are rendered as buttons. Unselectable days have one of these states: `disabled`, `empty`, `booked`.
- Selecting check-in then a later day within the same picker sets the range; the overlay closes automatically.
- "Booked" days come from the availability API and must not be selectable.

### Reserve flow (happy path)
1. User on `/t/{slug}/properties/{propertyId}`.
2. Open check-in picker, click an available day, click a later available day. Picker closes.
3. Price breakdown appears.
4. Click Reserve.
5. **If logged in:** server creates a booking; browser is redirected to `/t/{slug}/bookings/{bookingId}`. The trailing path segment is the new booking id.
6. **If not logged in:** browser is redirected to the login page (no inline error is rendered — this is the actual behavior, even though the widget has an error slot).

### Capacity behavior
- On load, guest count is `1`.
- Each click of `+` increments by 1.
- When the displayed value equals `property.maxGuests`, the `+` button becomes `disabled` (DOM `disabled` attribute / not enabled).

---

## 4. Acceptance Criteria Covered by Tests

### UI — `BookingWidgetTest` (Feature: Booking Widget, regression)
| Test                                                | What it asserts                                                                          |
|-----------------------------------------------------|------------------------------------------------------------------------------------------|
| Displays price per night                            | Widget shows a string containing `$` on load                                             |
| Has all required controls                           | Check-in, check-out, guest selector, Reserve button are all visible                      |
| Price breakdown after dates selected                | After picking two available dates, breakdown section becomes visible                     |
| Guest count defaults to 1                           | Initial counter value is `1`                                                             |
| Increment disabled at max capacity                  | After incrementing to `property.maxGuests`, `+` is disabled                              |
| Reserve without auth redirects to login             | Unauthenticated reserve navigates to `/login...` (URL starts with the configured login URL) |
| Valid reservation appears in My Bookings tab        | After logging in and reserving, a booking card with the new booking id exists on `/bookings` |
| Valid reservation notifies the host                 | After guest reserves, host's notifications list contains an entry whose `reference_id` equals the new booking id |

### API — `BookingApiTest` (Feature: Booking API, api)
| Test                                              | Method/Path | Auth        | Expected |
|---------------------------------------------------|-------------|-------------|----------|
| Unauthenticated overlapping booking               | POST /bookings | none      | **401** (auth runs before conflict check) |
| Logged-in overlapping booking                     | POST /bookings | guest JWT | **409**  |
| Logged-in valid booking                           | POST /bookings | guest JWT | 200, response `status == "PENDING"`, response `id` captured for cleanup |
| New booking surfaces in host's active notifications | POST /bookings then GET /notifications as host | guest JWT then host JWT | Host's non-cancelled notifications include one whose `reference_id` matches the booking id |

### API — `BookingValidationApiTest` (Feature: Booking Validation, api)
| Test                                | Inputs                                                       | Expected |
|-------------------------------------|--------------------------------------------------------------|----------|
| Invalid date range (parameterized)  | `checkOut == checkIn`; `checkOut < checkIn`                  | **400**  |
| Guest count exceeds property max    | `numGuests = 11` against a property with `maxGuests = 10`    | **400**  |
| Unauthenticated request             | Valid payload, no token                                      | **401**  |
| Missing required field (parameterized) | Drop one of `propertyId`, `checkIn`, `checkOut`, `numGuests` | **400** |

---

## 5. Test Data

All values below are externalized — they live in a `.env` file (loaded via dotenv) or system/env variables, never hardcoded in Java. The framework also reads `-D` system properties first, then `.env`, then env vars.

### 5.1 Environment / configuration

Required env vars (validated at startup; missing values throw `IllegalStateException`):

| Key                              | Purpose                                                   | Example                                          |
|----------------------------------|-----------------------------------------------------------|--------------------------------------------------|
| `TEST_BASE_URL`                  | Tenant-scoped root URL; the slug is parsed from `/t/...` | `https://qa-playground.nixdev.co/t/myslug`       |
| `TEST_USER_EMAIL`                | Host user email (owns `NOTIFY_BOOK_PROPERTY_ID`)          | `host@example.com`                               |
| `TEST_PASSWORD`                  | Host user password                                        | `…`                                              |
| `TEST_FIRST_NAME`                | Host user first name                                      | `John`                                           |
| `TEST_LAST_NAME`                 | Host user last name                                       | `Doe`                                            |

Optional but required specifically for booking tests:

| Key                              | Purpose                                                                       |
|----------------------------------|-------------------------------------------------------------------------------|
| `NON_HOST_TEST_USER_EMAIL`       | Guest user email — the user who creates bookings                              |
| `NON_HOST_TEST_PASSWORD`         | Guest user password                                                           |
| `TEST_DEFAULT_PROPERTY_ID`       | Property used for conflict + capacity tests. Has a known **blocked** range covering `2026-05-08 → 2026-05-22` and `maxGuests = 10`. Owned by host user. |
| `TEST_TO_BOOK_PROPERTY_ID`       | Property with **open** availability around `2026-05-20 → 2026-05-26`. Used for happy-path reserve. |
| `TEST_NOTIFY_BOOK_PROPERTY_ID`   | Property owned by the host user (`TEST_USER_EMAIL`) — used to verify the host receives a notification when a guest books it. |

Example `.env`:

```dotenv
TEST_BASE_URL=https://qa-playground.nixdev.co/t/myslug
TEST_USER_EMAIL=host@example.com
TEST_PASSWORD=hostPass123!
TEST_FIRST_NAME=John
TEST_LAST_NAME=Doe
NON_HOST_TEST_USER_EMAIL=guest@example.com
NON_HOST_TEST_PASSWORD=guestPass123!
TEST_DEFAULT_PROPERTY_ID=1
TEST_TO_BOOK_PROPERTY_ID=2
TEST_NOTIFY_BOOK_PROPERTY_ID=3
```

### 5.2 Seeded server-side state assumed by the tests

The tests are not self-seeding for properties — they expect the backend to already contain:

1. **A host user** matching `TEST_USER_EMAIL` / `TEST_PASSWORD`, that owns `TEST_DEFAULT_PROPERTY_ID` and `TEST_NOTIFY_BOOK_PROPERTY_ID`.
2. **A guest (non-host) user** matching `NON_HOST_TEST_USER_EMAIL` / `NON_HOST_TEST_PASSWORD`.
3. **`TEST_DEFAULT_PROPERTY_ID`** — `maxGuests = 10`; has an existing booking covering nights from **2026-05-08 inclusive to 2026-05-22 exclusive** (so the range `2026-05-08 → 2026-05-22` overlaps it).
4. **`TEST_TO_BOOK_PROPERTY_ID`** — has no bookings covering `2026-05-20 → 2026-05-26`. (Tests cancel each booking they create, so this stays clean.)
5. **`TEST_NOTIFY_BOOK_PROPERTY_ID`** — owned by the host user and available for the dynamic window `today+60 → today+65`.

When reimplementing on a different stack you can either (a) keep this seeded-data assumption and document the same fixture, or (b) replace it with API-driven setup that creates the host user, the guest user, and three properties at the start of each suite.

### 5.3 Hardcoded test constants (`TestDataConstants.Booking`)

| Constant                  | Value         | Used by                                                  |
|---------------------------|---------------|----------------------------------------------------------|
| `OVERLAPPING_CHECK_IN`    | `2026-05-08`  | Overlap (409) tests against `TEST_DEFAULT_PROPERTY_ID`   |
| `OVERLAPPING_CHECK_OUT`   | `2026-05-22`  | Overlap (409) tests against `TEST_DEFAULT_PROPERTY_ID`   |
| `VALID_CHECK_IN`          | `2026-05-20`  | Happy-path booking against `TEST_TO_BOOK_PROPERTY_ID`    |
| `VALID_CHECK_OUT`         | `2026-05-26`  | Happy-path booking against `TEST_TO_BOOK_PROPERTY_ID`    |
| `NUM_GUESTS`              | `1`           | All booking payloads unless overridden                    |
| `EXPECTED_STATUS`         | `"PENDING"`   | Asserted on the response of a successful create           |
| `EXCEEDS_MAX_GUESTS`      | `11`          | Capacity validation (`DefaultProperty.MAX_GUESTS = 10`)   |
| `notifyCheckInDate()`     | `today + 60`  | Notification test (dynamic, ISO date)                     |
| `notifyCheckOutDate()`    | `today + 65`  | Notification test (dynamic, ISO date)                     |

`DefaultProperty.MAX_GUESTS = 10` — capacity ceiling of `TEST_DEFAULT_PROPERTY_ID`, used by the increment-disabled UI test and the `EXCEEDS_MAX_GUESTS` API test.

### 5.4 Parameterized inputs

**Invalid date ranges → 400** (`BookingValidationApiTest#invalidDateRanges`):

| `checkIn`    | `checkOut`   | Why invalid                |
|--------------|--------------|----------------------------|
| `2026-06-01` | `2026-06-01` | `checkOut == checkIn`      |
| `2026-06-01` | `2026-05-31` | `checkOut` before `checkIn`|

**Missing required field → 400** (`BookingValidationApiTest#missingFieldPayloads`):

| Missing field | Payload                                                                       |
|---------------|-------------------------------------------------------------------------------|
| `propertyId`  | `{"checkIn":"2026-06-01","checkOut":"2026-06-05","numGuests":1}`              |
| `checkIn`     | `{"propertyId":1,"checkOut":"2026-06-05","numGuests":1}`                      |
| `checkOut`    | `{"propertyId":1,"checkIn":"2026-06-01","numGuests":1}`                       |
| `numGuests`   | `{"propertyId":1,"checkIn":"2026-06-01","checkOut":"2026-06-05"}`             |

### 5.5 Example payloads

Happy-path create (sent as `Content-Type: application/json`):

```json
{ "propertyId": 2, "checkIn": "2026-05-20", "checkOut": "2026-05-26", "numGuests": 1 }
```

Overlap probe (against the seeded blocked range):

```json
{ "propertyId": 1, "checkIn": "2026-05-08", "checkOut": "2026-05-22", "numGuests": 1 }
```

Host-notification probe (uses dynamic dates so it doesn't depend on a fixed open window):

```json
{ "propertyId": 3, "checkIn": "<today+60>", "checkOut": "<today+65>", "numGuests": 1 }
```

---

## 6. Cross-cutting Rules for Reimplementation

- **One assertion per test.** Group related UI state checks under a soft-assertion helper (JUnit's `assertAll`, Playwright's `expect.soft`, Cypress chained assertions, etc.) when you need multiple.
- **Test independence.** Every test that creates a booking must clean it up in teardown by calling `PUT /bookings/{id}/cancel` against the same user that created it. Store the created id and null it out after cleanup so teardown is a no-op when nothing was created.
- **No `sleep`.** Wait on conditions: element visibility/clickability, URL contains `bookings`, date-picker overlay gone, etc.
- **Auth model.** The app stores its JWT in `localStorage` under key `staybnb_token`. UI tests that need an authenticated session can either log in through the UI or inject a token into `localStorage` (faster). API tests just attach `Authorization: Bearer <token>` directly.
- **Tenant slug.** Derive `slug` from the configured base URL (text after `/t/`). All API paths are `/api/t/{slug}/...`.
- **Roles in play.**
  - *Guest (non-host) user* — the user who makes bookings.
  - *Host user* — owns `NOTIFY_BOOK_PROPERTY_ID` and receives notifications. Switching between them in one test requires logout + login (or token swap).
- **Cleanup ordering for the host-notification test.** Create booking as guest → switch to host → fetch notifications → cancel booking as guest → assert. Cancelling before assertion is safe because the notification has already been captured in the local variable.
- **My Bookings page.** Authenticated guest can list their bookings at `/t/{slug}/bookings`. Each booking card is an anchor whose `href` ends in the booking id; presence is checked by parsing the trailing path segment of the card's `href`.

---

## 7. Minimum Implementation Checklist (for the new framework)

1. Config loader: base URL, guest credentials, host credentials, three property ids (default/overlapping, to-book, notify).
2. Auth helpers: `loginViaApi(email, pwd) -> token`, `setLocalStorageToken(token)`, `apiRequest(token?)`.
3. Booking API client: `createBooking(payload, token?)`, `cancelBooking(id, token)`, `getAvailability(propertyId, token?)`, `getNotifications(token)`.
4. Page object for property details with the methods listed in §3 (open pickers, select nth available day, increment guests to N, click reserve, read price, read breakdown visibility, read guest count, read `+` disabled state).
5. Page object for My Bookings with `doesBookingExist(id)` parsing card hrefs.
6. Teardown hook that cancels `createdBookingId` if set.
7. Test classes mirroring §4 tables, with one assertion per test and parameterized variants where indicated.
