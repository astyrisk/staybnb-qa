import { apiTest as test, expect } from '../../../fixtures';
import { MessagesApiClient } from '../../../api/messages/messages.client';
import { validMessagePayload } from '../../../support/data/messages';
import { validUser } from '../../../support/data/users';
import { seededProperty } from '../../../support/data/properties';

test.describe('POST /messages', () => {
    test('guest sends a message to host with a propertyId and receives 201', async ({ guestMessagesApi, hostUserId }) => {
        const response = await guestMessagesApi.sendMessage(validMessagePayload(hostUserId));
        await guestMessagesApi.expectMessageSent(response);
    });

    test('returns 400 when content is empty', async ({ guestMessagesApi, hostUserId }) => {
        const response = await guestMessagesApi.sendMessage({
            receiverId: hostUserId,
            propertyId: Number(seededProperty.id),
            content: '',
        });
        await guestMessagesApi.expectValidationError(response);
    });

    test('returns 400 when sender and receiver are the same user', async ({ guestMessagesApi, guestUserId }) => {
        const response = await guestMessagesApi.sendMessage({
            receiverId: guestUserId,
            propertyId: Number(seededProperty.id),
            content: 'Hello myself',
        });
        await guestMessagesApi.expectValidationError(response);
    });
});

test.describe('GET /messages/conversations', () => {
    test('returns 200 with correct conversation shape', async ({ guestMessagesApi, hostUserId }) => {
        await guestMessagesApi.sendMessage(validMessagePayload(hostUserId));
        const response = await guestMessagesApi.getConversations();
        await guestMessagesApi.expectConversationsListed(response);
    });
});

test.describe('PUT /messages/conversations/:id/read', () => {
    test('marks conversation as read and unread count drops to 0', async ({ guestMessagesApi, hostMessagesApi, hostUserId, guestUserId }) => {
        await guestMessagesApi.sendMessage(validMessagePayload(hostUserId));

        const convsR = await hostMessagesApi.getConversations();
        const convs = await convsR.json();
        const conv = convs.conversations.find((c: { otherUser: { id: number } }) => c.otherUser.id === guestUserId);
        expect(conv, 'Conversation with guest should exist on host side').toBeDefined();

        const readResponse = await hostMessagesApi.markConversationRead(conv.conversationId);
        await hostMessagesApi.expectConversationMarkedRead(readResponse);

        const afterR = await hostMessagesApi.getConversations();
        const after = await afterR.json();
        const updated = after.conversations.find((c: { conversationId: string }) => c.conversationId === conv.conversationId);
        expect(Number(updated?.unreadCount)).toBe(0);
    });

    test('returns 403 when a non-participant tries to mark a conversation as read', async ({ guestMessagesApi, hostUserId, authApi, request }) => {
        await guestMessagesApi.sendMessage(validMessagePayload(hostUserId));

        const convsR = await guestMessagesApi.getConversations();
        const convs = await convsR.json();
        const conv = convs.conversations.find((c: { otherUser: { id: number } }) => c.otherUser.id === hostUserId);
        expect(conv, 'Conversation with host should exist on guest side').toBeDefined();

        const user = validUser();
        const reg = await authApi.register(user.firstName, user.lastName, user.email, user.password);
        const { token } = await reg.json();
        const strangerClient = new MessagesApiClient(request, token);

        const response = await strangerClient.markConversationRead(conv.conversationId);
        await guestMessagesApi.expectForbidden(response);
    });
});
