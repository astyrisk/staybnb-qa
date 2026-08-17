# API Test Patterns

Conventions used across all API specs in this project. New files should follow these.

---

## 1. Client class (`api/<area>/<area>.client.ts`)

Each API area gets one class that owns two things: **request methods** and **assertion helpers**.

```ts
export class BookingApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    // Request method — returns raw APIResponse, no assertions
    createBooking(payload: CreateBookingPayload): Promise<APIResponse> {
        return this.request.post(BOOKING_BASE, {
            data: payload,
            headers: this.headers(),
        });
    }

    // Assertion helper — asserts status + shape, returns parsed body when useful
    async expectBookingCreated(response: APIResponse, payload?: CreateBookingPayload): Promise<BookingBody> {
        expect(response.status()).toBe(201);
        const body = await response.json() as BookingBody;
        expect(body.id).toBeDefined();
        expect(body.status).toBe('PENDING');
        // ...all required-field checks live here, not in the spec
        return body;
    }
}
```

**Rules:**
- Request methods are plain `Promise<APIResponse>` — no assertions inside them.
- Assertion helpers are named `expect<Outcome>` (e.g. `expectUnauthorized`, `expectConflict`).
- All field-level assertions belong in the helper, not in the spec. The spec just calls `expectX(response)`.
- Return the parsed body from assertion helpers when tests need to read fields (e.g. to capture an `id`).
- Unauthenticated variants of requests (no token) are separate methods (e.g. `createBookingUnauthenticated`).

---

## 2. Fixture (`fixtures/api.fixture.ts`)

Each client is wired up as a Playwright fixture. Token acquisition lives here, not in specs.

```ts
guestBookingApi: async ({ request, guestToken }, use) => {
    await use(new BookingApiClient(request, guestToken));
},
```

- `guestToken` / `hostToken` fixtures handle login and expose the raw token.
- Named after role + area: `guestBookingApi`, `hostingApi`, `hostNotificationsApi`, etc.
- Specs receive the ready-to-use client — they never call `login()` to get a token themselves.

---

## 3. Spec structure (`tests/api/<area>/<action>.spec.ts`)

```ts
import { apiTest as test } from '../../../fixtures';  // never @playwright/test directly

test.describe('POST /bookings', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('creates a booking with PENDING status and returns all required fields', async ({ guestBookingApi }) => {
        const payload = validBookingPayload({ checkIn: '2027-03-01', checkOut: '2027-03-04' });
        const response = await guestBookingApi.createBooking(payload);
        const body = await guestBookingApi.expectBookingCreated(response, payload);
        bookingId = body.id;  // afterEach will clean this up
    });
});
```

**Rules:**
- Always import from `fixtures`, not from `@playwright/test`.
- `test.describe` label matches the HTTP method + path: `'POST /bookings'`, `'GET /auth/login'`.
- Test name describes the observable outcome: `'returns 401 when request is unauthenticated'`.
- When a test creates a resource that must be cleaned up, track its `id` in a describe-scoped `let` variable and cancel/delete it in `afterEach` — no manual cleanup inside the test body.
- Use `try/finally` only when cleanup must run even if the test throws and `afterEach` cannot access the resource (rare).
- `beforeEach` is for shared setup across sibling tests (e.g. building a fresh `validUser()` before each field-validation test). Don't add it if it has nothing to do.

---

## 4. Test data factories (`support/data/*.ts`)

```ts
const defaultBookingPayload = () => ({
    propertyId: Number(seededProperty.id),
    checkIn: toDateString(addDays(new Date(), 30)),
    checkOut: toDateString(addDays(new Date(), 33)),
    numGuests: 2,
});

export type BookingPayload = ReturnType<typeof defaultBookingPayload>;

export const validBookingPayload = (overrides: Partial<BookingPayload> = {}): BookingPayload => ({
    ...defaultBookingPayload(),
    ...overrides,
});
```

**Rules:**
- Defaults are a function, not a module-level object, so values like `new Date()` are computed fresh per call.
- The exported type is derived with `ReturnType<typeof ...>` — never declared separately.
- The factory accepts an `overrides` object so specs only supply what's relevant to the scenario.
- Spec-specific values (e.g. fixed future dates for conflict tests) are passed as overrides, not hardcoded in the factory.
