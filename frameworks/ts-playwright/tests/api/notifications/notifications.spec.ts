import { apiTest as test, expect } from '../../../fixtures';
import { validBookingPayload } from '../../../support/data/bookings';

test.describe('GET /notifications and PUT /notifications', () => {
    let bookingId: number | undefined;
    let notificationId: number | undefined;

    test.beforeAll(async ({ guestBookingApi, hostNotificationsApi }) => {
        const r = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2028-01-10', checkOut: '2028-01-13' }),
        );
        const body = await r.json();
        const createdBookingId = body.id as number;
        bookingId = createdBookingId;
        const n = await hostNotificationsApi.findNotification('BOOKING_REQUEST', createdBookingId);
        expect(n, 'BOOKING_REQUEST notification should exist after booking creation').toBeDefined();
        notificationId = n!.id;
    });

    test.afterAll(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('returns 200 with a notifications list and unreadCount', async ({ hostNotificationsApi }) => {
        const response = await hostNotificationsApi.getNotifications();
        await hostNotificationsApi.expectNotificationsListed(response);
    });

    test('returns only unread notifications when unreadOnly=true', async ({ hostNotificationsApi }) => {
        const response = await hostNotificationsApi.getNotifications(true);
        await hostNotificationsApi.expectOnlyUnread(response);
    });

    test('flips is_read to true for a valid notification ID', async ({ hostNotificationsApi }) => {
        const response = await hostNotificationsApi.markAsRead(notificationId!);
        await hostNotificationsApi.expectMarkedAsRead(response);
    });

    test('returns 404 for a non-existent notification ID', async ({ hostNotificationsApi }) => {
        const response = await hostNotificationsApi.markAsRead(9999999);
        await hostNotificationsApi.expectNotFound(response);
    });

    test('marks all as read then GET returns unreadCount 0', async ({ hostNotificationsApi }) => {
        await hostNotificationsApi.markAllRead();
        const response = await hostNotificationsApi.getNotifications();
        const body = await hostNotificationsApi.expectNotificationsListed(response);
        expect(body.unreadCount).toBe(0);
    });

    test('returns 401 for an unauthenticated mark-all-as-read request', async ({ hostNotificationsApi }) => {
        const response = await hostNotificationsApi.markAllReadUnauthenticated();
        await hostNotificationsApi.expectUnauthorized(response);
    });
});
