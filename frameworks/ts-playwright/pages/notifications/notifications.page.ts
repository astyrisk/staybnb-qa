import {BasePage} from "../base.page";
import {expect, Locator, Page} from "@playwright/test";
import {env} from "../../support/env";
import {Booking} from "../../support/data/bookings";

export class NotificationsPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/notifications";

    readonly notificationCards: Locator = this.page.locator('.notification-card');
    readonly notificationList: Locator = this.page.locator('.notifications-list');
    readonly unreadCards: Locator = this.page.locator('.notification-card.unread');
    readonly readCards: Locator = this.page.locator('.notification-card:not(.unread)');
    readonly emptyState: Locator = this.page.locator('.notifications-empty');
    readonly markAllReadBtn: Locator = this.page.locator('.mark-all-read-btn');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(NotificationsPage.PATH);
    }

    private notificationTitleFor(booking: Booking): Locator {
        return this.notificationList.locator(`a[href*="/bookings/${booking.bookingID}"] .notification-title`);
    }

    async expectBookingNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'New booking request' }).first()
        ).toBeVisible();
    }

    async expectCancellationNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking cancelled' }).first()
        ).toBeVisible();
    }

    async expectConfirmationNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking confirmed' }).first()
        ).toBeVisible();
    }

    async expectDeclineNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking declined' }).first()
        ).toBeVisible();
    }

    async expectUnreadCardHasIndicator() {
        const firstUnread = this.unreadCards.first();
        await firstUnread.waitFor({ state: 'visible' });
        await expect(firstUnread.locator('.unread-indicator')).toBeVisible();
    }

    async expectReadCardHasNoIndicator() {
        const firstRead = this.readCards.first();
        await firstRead.waitFor({ state: 'visible' });
        await expect(firstRead.locator('.unread-indicator')).not.toBeVisible();
    }

    async expectEmptyState() {
        await expect(this.emptyState).toBeVisible();
    }

    async clickFirstUnreadMessageNotification() {
        await this.notificationList
            .locator('a[href*="/messages"]')
            .filter({ has: this.page.locator('.notification-card.unread') })
            .first()
            .click();
    }

    async clickMarkAllAsRead() {
        const responsePromise = this.page.waitForResponse(
            r => r.url().includes('/notifications/read-all') && r.request().method() === 'PUT'
        );
        await this.markAllReadBtn.click();
        await responsePromise;
        await this.page.reload();
    }

    async expectNoUnreadCards() {
        await expect(this.unreadCards).toHaveCount(0);
    }

    async expectRedirectedToLogin() {
        await expect(this.page).toHaveURL(/\/login/);
    }

    async expectNavigatedToMessages() {
        await expect(this.page).toHaveURL(/\/messages/);
    }
}