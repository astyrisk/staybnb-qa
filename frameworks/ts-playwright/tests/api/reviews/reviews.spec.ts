// TODO: All tests in this file require a seeded COMPLETED booking.
// Add its ID to SEEDED_COMPLETED_BOOKING_ID below and remove the test.fixme calls.
import { apiTest as test } from '../../../fixtures';
import { ReviewsApiClient } from '../../../api/reviews/reviews.client';
import { validUser } from '../../../support/data/users';

const SEEDED_COMPLETED_BOOKING_ID = 0;

test.describe('POST /reviews', () => {
    test.fixme('guest submits a valid GUEST_TO_PROPERTY review and receives 201', async ({ guestReviewsApi }) => {
        const response = await guestReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 4,
            comment: 'Great stay!',
            reviewType: 'GUEST_TO_PROPERTY',
        });
        await guestReviewsApi.expectReviewCreated(response);
    });

    test.fixme('host submits a valid HOST_TO_GUEST review and receives 201', async ({ hostReviewsApi }) => {
        const response = await hostReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 5,
            reviewType: 'HOST_TO_GUEST',
        });
        await hostReviewsApi.expectReviewCreated(response);
    });

    // Requires a booking with no existing review — use a different SEEDED_COMPLETED_BOOKING_ID if tests 1/2 already reviewed it.
    test.fixme('returns 409 when a review already exists for the same booking and type', async ({ guestReviewsApi }) => {
        await guestReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 3,
            reviewType: 'GUEST_TO_PROPERTY',
        });
        const duplicate = await guestReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 4,
            reviewType: 'GUEST_TO_PROPERTY',
        });
        await guestReviewsApi.expectConflict(duplicate);
    });

    test.fixme('returns 400 for a rating of 0 (below valid range)', async ({ guestReviewsApi }) => {
        const response = await guestReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 0,
            reviewType: 'GUEST_TO_PROPERTY',
        });
        await guestReviewsApi.expectValidationError(response);
    });

    test.fixme('returns 400 for a rating of 6 (above valid range)', async ({ guestReviewsApi }) => {
        const response = await guestReviewsApi.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 6,
            reviewType: 'GUEST_TO_PROPERTY',
        });
        await guestReviewsApi.expectValidationError(response);
    });

    test.fixme('returns 403 when a non-participant submits a review', async ({ authApi, request }) => {
        const user = validUser();
        const reg = await authApi.register(user.firstName, user.lastName, user.email, user.password);
        const { token } = await reg.json();
        const strangerClient = new ReviewsApiClient(request, token);
        const response = await strangerClient.createReview({
            bookingId: SEEDED_COMPLETED_BOOKING_ID,
            rating: 3,
            reviewType: 'GUEST_TO_PROPERTY',
        });
        await strangerClient.expectForbidden(response);
    });
});
