import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const MESSAGES_BASE = `${env.API_BASE_URL}/messages`;

export interface SendMessagePayload {
    receiverId?: number;
    propertyId?: number | string;
    content?: string;
}

interface OtherUser {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
}

interface LastMessage {
    content: string;
    senderId: number;
    createdAt: string;
}

export interface Conversation {
    conversationId: string;
    otherUser: OtherUser;
    lastMessage: LastMessage;
    unreadCount: string | number;
    property?: { id: number; title: string };
}

export interface ConversationsBody {
    conversations: Conversation[];
}

export class MessagesApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    sendMessage(payload: SendMessagePayload): Promise<APIResponse> {
        return this.request.post(MESSAGES_BASE, {
            data: payload,
            headers: this.headers(),
        });
    }

    getConversations(): Promise<APIResponse> {
        return this.request.get(`${MESSAGES_BASE}/conversations`, {
            headers: this.headers(),
        });
    }

    markConversationRead(conversationId: string): Promise<APIResponse> {
        return this.request.put(`${MESSAGES_BASE}/conversations/${conversationId}/read`, {
            headers: this.headers(),
        });
    }

    markConversationReadWith(conversationId: string, token: string): Promise<APIResponse> {
        return this.request.put(`${MESSAGES_BASE}/conversations/${conversationId}/read`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async expectMessageSent(response: APIResponse): Promise<{ id: number; conversation_id: string }> {
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.message).toBeDefined();
        expect(body.message.id).toBeDefined();
        expect(body.message.conversation_id).toBeDefined();
        return body.message;
    }

    async expectConversationsListed(response: APIResponse): Promise<ConversationsBody> {
        expect(response.status()).toBe(200);
        const body = await response.json() as ConversationsBody;
        expect(Array.isArray(body.conversations)).toBe(true);
        expect(body.conversations.length).toBeGreaterThan(0);
        const conv = body.conversations[0];
        expect(conv.conversationId).toBeDefined();
        expect(conv.otherUser).toBeDefined();
        expect(typeof conv.otherUser.id).toBe('number');
        expect(conv.otherUser.first_name).toBeDefined();
        expect(conv.lastMessage).toBeDefined();
        expect(conv.lastMessage.content).toBeDefined();
        expect(conv.unreadCount).toBeDefined();
        return body;
    }

    async expectConversationMarkedRead(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
    }

    async expectValidationError(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(400);
    }

    async expectForbidden(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(403);
    }
}
