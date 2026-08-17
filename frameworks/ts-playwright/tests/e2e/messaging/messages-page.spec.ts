import { guestAuthFile, test, screenshotSelector } from '../../../fixtures';

test.describe('messages page - guest with existing conversations', () => {
    test.use({ storageState: guestAuthFile });

    test.beforeEach(async ({ pages }) => {
        await pages.messagesPage.goto();
    });

    test.describe('conversation list', () => {
        test('conversation list is displayed', screenshotSelector('.conversations-list'), async ({ pages }) => {
            await pages.messagesPage.expectConversationListVisible();
        });

        test('each conversation shows the other user name', screenshotSelector('.conversation-item'), async ({ pages }) => {
            await pages.messagesPage.expectFirstConversationHasName();
        });

        test('each conversation shows last message preview', screenshotSelector('.conversation-item'), async ({ pages }) => {
            await pages.messagesPage.expectFirstConversationHasPreview();
        });

        test('each conversation shows the related property name', screenshotSelector('.conversation-item'), async ({ pages }) => {
            await pages.messagesPage.expectFirstConversationHasProperty();
        });

        test('each conversation shows a timestamp', screenshotSelector('.conversation-item'), async ({ pages }) => {
            await pages.messagesPage.expectFirstConversationHasTimestamp();
        });
    });

    test.describe('message thread', () => {
        test('clicking a conversation opens the thread', screenshotSelector('.messages-thread'), async ({ pages }) => {
            await pages.messagesPage.clickFirstConversation();
            await pages.messagesPage.expectThreadVisible();
        });

        test('thread header shows the other user name', screenshotSelector('.thread-header'), async ({ pages }) => {
            await pages.messagesPage.expectThreadHeaderHasName();
        });

        test('thread header shows the related property', screenshotSelector('.thread-header'), async ({ pages }) => {
            await pages.messagesPage.expectThreadHeaderHasProperty();
        });

        test('sent messages are displayed in the thread', screenshotSelector('.messages-list'), async ({ pages }) => {
            await pages.messagesPage.expectSentMessagesExist();
        });

        test('received messages are displayed in the thread', screenshotSelector('.messages-list'), async ({ pages }) => {
            await pages.messagesPage.expectReceivedMessagesExist();
        });

        test('each message shows text and timestamp', screenshotSelector('.messages-list'), async ({ pages }) => {
            await pages.messagesPage.expectMessagesHaveTextAndTimestamp();
        });

        test('thread auto-scrolls to the newest message', screenshotSelector('.messages-list'), async ({ pages }) => {
            await pages.messagesPage.expectLastMessageInViewport();
        });
    });
});

test.describe('messages page - new user with no conversations', () => {
    test('shows empty state when user has no conversations', async ({ pages, registered }) => {
        await pages.messagesPage.goto();
        await pages.messagesPage.expectNoConversations();
    });
});
