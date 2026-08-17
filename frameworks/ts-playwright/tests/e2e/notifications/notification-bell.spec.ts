import { test, screenshotSelector, hostAuthFile } from '../../../fixtures';
import { env } from '../../../support/env';

test.describe('notification bell — logged in with notifications', () => {
    test.use({ storageState: hostAuthFile });

    test.beforeEach(async ({ page }) => {
        await page.goto(env.BASE_URL);
    });

    test('bell icon is visible when logged in', screenshotSelector('.notification-bell'), async ({ pages }) => {
        await pages.navbar.expectNotificationBellVisible();
    });

    test('bell badge shows unread count when user has unread notifications', screenshotSelector('.notification-bell'), async ({ pages }) => {
        await pages.navbar.expectNotificationBadgeVisible();
    });
});

test.describe('notification bell — fresh user with no notifications', () => {
    test('badge is hidden when user has no unread notifications', screenshotSelector('.notification-bell'), async ({ pages, registered }) => {
        await pages.navbar.expectNotificationBadgeHidden();
    });
});

test.describe('notification bell — logged out', () => {
    test('bell is not visible when logged out', screenshotSelector('.navbar-right'), async ({ pages, loggedOut }) => {
        await pages.navbar.expectNotificationBellHidden();
    });
});
