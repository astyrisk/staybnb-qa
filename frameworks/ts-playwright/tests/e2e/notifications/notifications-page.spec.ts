import { test, screenshotSelector, hostAuthFile, guestAuthFile } from '../../../fixtures';
import { PageManager } from '../../../fixtures';
import { getUnqiueMessage } from '../../../support/data/messages';

test.describe('notifications page — with fresh notification', () => {
    test.use({ storageState: hostAuthFile });

    test.beforeEach(async ({ browser, pages }) => {
        const guestContext = await browser.newContext({ storageState: guestAuthFile });
        await new PageManager(await guestContext.newPage())
            .propertyDetailsPage.sendMessageToHost(getUnqiueMessage());
        await guestContext.close();
        await pages.notificationsPage.goto();
    });

    test.afterEach(async ({ pages }) => {
        await pages.notificationsPage.goto();
        if (await pages.notificationsPage.markAllReadBtn.isVisible()) {
            await pages.notificationsPage.clickMarkAllAsRead();
        }
    });

    test('unread notifications show the unread indicator', screenshotSelector('.notification-card.unread'), async ({ pages }) => {
        await pages.notificationsPage.expectUnreadCardHasIndicator();
    });

    test('clicking a message notification navigates to messages', screenshotSelector('.notification-card'), async ({ pages }) => {
        await pages.notificationsPage.clickFirstUnreadMessageNotification();
        await pages.notificationsPage.expectNavigatedToMessages();
    });

    test('mark all as read clears all unread cards', screenshotSelector('.notifications-list'), async ({ pages }) => {
        await pages.notificationsPage.clickMarkAllAsRead();
        await pages.notificationsPage.expectNoUnreadCards();
    });

    test('bell badge disappears after marking all as read', screenshotSelector('.notification-bell'), async ({ pages }) => {
        await pages.notificationsPage.clickMarkAllAsRead();
        await pages.navbar.expectNotificationBadgeHidden();
    });
});

test.describe('notifications page — read state', () => {
    test.use({ storageState: hostAuthFile });

    test('read notifications do not show the unread indicator', screenshotSelector('.notification-card'), async ({ pages }) => {
        await pages.notificationsPage.goto();
        await pages.notificationsPage.expectReadCardHasNoIndicator();
    });
});

test.describe('notifications page — empty state', () => {
    test('shows empty state when user has no notifications', screenshotSelector('.notifications-empty'), async ({ pages, registered }) => {
        await pages.notificationsPage.goto();
        await pages.notificationsPage.expectEmptyState();
    });
});

test.describe('notifications page — unauthenticated', () => {
    test('redirects to login when not authenticated', async ({ pages, loggedOut }) => {
        await pages.notificationsPage.goto();
        await pages.notificationsPage.expectRedirectedToLogin();
    });
});
