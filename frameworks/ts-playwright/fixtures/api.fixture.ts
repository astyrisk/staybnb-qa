import { test as base } from '@playwright/test';
import { AuthApiClient } from '../api/auth/auth.client';
import { BookingApiClient } from '../api/booking/booking.client';
import { HostingApiClient } from '../api/hosting/hosting.client';
import { NotificationsApiClient } from '../api/notifications/notifications.client';
import { ReviewsApiClient } from '../api/reviews/reviews.client';
import { MessagesApiClient } from '../api/messages/messages.client';
import { env } from '../support/env';

interface ApiFixtures {
    authApi: AuthApiClient;
    guestToken: string;
    hostToken: string;
    guestUserId: number;
    hostUserId: number;
    guestBookingApi: BookingApiClient;
    hostBookingApi: BookingApiClient;
    hostingApi: HostingApiClient;
    guestHostingApi: HostingApiClient;
    hostNotificationsApi: NotificationsApiClient;
    guestNotificationsApi: NotificationsApiClient;
    guestReviewsApi: ReviewsApiClient;
    hostReviewsApi: ReviewsApiClient;
    guestMessagesApi: MessagesApiClient;
    hostMessagesApi: MessagesApiClient;
}

export const test = base.extend<ApiFixtures>({
    authApi: async ({ request }, use) => {
        await use(new AuthApiClient(request));
    },

    guestToken: async ({ request }, use) => {
        const auth = new AuthApiClient(request);
        const response = await auth.login(env.GUEST_USER_EMAIL, env.GUEST_USER_PASSWORD);
        const { token } = await response.json();
        await use(token as string);
    },

    hostToken: async ({ request }, use) => {
        const auth = new AuthApiClient(request);
        const response = await auth.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        const { token } = await response.json();
        await use(token as string);
    },

    guestUserId: async ({ request }, use) => {
        const auth = new AuthApiClient(request);
        const response = await auth.login(env.GUEST_USER_EMAIL, env.GUEST_USER_PASSWORD);
        const { user } = await response.json();
        await use(user.id as number);
    },

    hostUserId: async ({ request }, use) => {
        const auth = new AuthApiClient(request);
        const response = await auth.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        const { user } = await response.json();
        await use(user.id as number);
    },

    guestBookingApi: async ({ request, guestToken }, use) => {
        await use(new BookingApiClient(request, guestToken));
    },

    hostBookingApi: async ({ request, hostToken }, use) => {
        await use(new BookingApiClient(request, hostToken));
    },

    hostingApi: async ({ request, hostToken }, use) => {
        await use(new HostingApiClient(request, hostToken));
    },

    guestHostingApi: async ({ request, guestToken }, use) => {
        await use(new HostingApiClient(request, guestToken));
    },

    hostNotificationsApi: async ({ request, hostToken }, use) => {
        await use(new NotificationsApiClient(request, hostToken));
    },

    guestNotificationsApi: async ({ request, guestToken }, use) => {
        await use(new NotificationsApiClient(request, guestToken));
    },

    guestReviewsApi: async ({ request, guestToken }, use) => {
        await use(new ReviewsApiClient(request, guestToken));
    },

    hostReviewsApi: async ({ request, hostToken }, use) => {
        await use(new ReviewsApiClient(request, hostToken));
    },

    guestMessagesApi: async ({ request, guestToken }, use) => {
        await use(new MessagesApiClient(request, guestToken));
    },

    hostMessagesApi: async ({ request, hostToken }, use) => {
        await use(new MessagesApiClient(request, hostToken));
    },
});
