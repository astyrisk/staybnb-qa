import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const NOTIFICATIONS_BASE = `${env.API_BASE_URL}/notifications`;

export interface Notification {
    id: number;
    type: string;
    reference_type: string;
    reference_id: number;
    is_read: boolean;
    title: string;
    message: string;
}

export interface NotificationsBody {
    notifications: Notification[];
    unreadCount: number;
}

export class NotificationsApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    getNotifications(unreadOnly?: boolean): Promise<APIResponse> {
        return this.request.get(NOTIFICATIONS_BASE, {
            params: unreadOnly ? { unreadOnly: 'true' } : {},
            headers: this.headers(),
        });
    }

    markAsRead(id: number | string): Promise<APIResponse> {
        return this.request.put(`${NOTIFICATIONS_BASE}/${id}/read`, {
            headers: this.headers(),
        });
    }

    markAllRead(): Promise<APIResponse> {
        return this.request.put(`${NOTIFICATIONS_BASE}/read-all`, {
            headers: this.headers(),
        });
    }

    markAllReadUnauthenticated(): Promise<APIResponse> {
        return this.request.put(`${NOTIFICATIONS_BASE}/read-all`);
    }

    async findNotification(type: string, referenceId: number): Promise<Notification | undefined> {
        const response = await this.getNotifications();
        const body = await response.json() as NotificationsBody;
        return body.notifications?.find(n => n.type === type && n.reference_id === referenceId);
    }

    async expectNotificationExists(type: string, referenceId: number): Promise<void> {
        const notification = await this.findNotification(type, referenceId);
        expect(notification, `Expected notification of type ${type} for booking ${referenceId}`).toBeDefined();
        expect(notification?.reference_type).toBe('booking');
        expect(notification?.is_read).toBe(false);
    }

    async expectNotificationsListed(response: APIResponse): Promise<NotificationsBody> {
        expect(response.status()).toBe(200);
        const body = await response.json() as NotificationsBody;
        expect(Array.isArray(body.notifications)).toBe(true);
        expect(typeof body.unreadCount).toBe('number');
        return body;
    }

    async expectOnlyUnread(response: APIResponse): Promise<void> {
        const body = await this.expectNotificationsListed(response);
        expect(body.notifications.every(n => !n.is_read)).toBe(true);
    }

    async expectMarkedAsRead(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.message).toBeDefined();
    }

    async expectNotFound(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(404);
    }

    async expectUnauthorized(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(401);
    }
}
