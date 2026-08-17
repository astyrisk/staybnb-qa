import {BasePage} from "../base.page";
import {env} from "../../support/env";
import {expect, Page} from "@playwright/test";

export class MessagesPage extends BasePage {
    static PATH = env.BASE_URL + '/messages/';

    // Thread
    readonly LAST_SENT_MESSAGE= this.page.locator('.message.sent .message-content').last();
    readonly LAST_RECEIVED_MESSAGE= this.page.locator('.message.received .message-content').last();
    readonly INPUT_FORM = this.page.getByPlaceholder('Type a message...');
    readonly SEND_BUTTON = this.page.getByRole("button", {name: "Send"});

    // Conversation list
    readonly CONVERSATION_ITEMS = this.page.locator('.conversation-item');
    private readonly FIRST_CONVERSATION = this.page.locator('.conversation-item').first();
    private readonly FIRST_CONVERSATION_NAME = this.FIRST_CONVERSATION.locator('.conversation-name');
    private readonly FIRST_CONVERSATION_PREVIEW = this.FIRST_CONVERSATION.locator('.conversation-preview');
    private readonly FIRST_CONVERSATION_PROPERTY = this.FIRST_CONVERSATION.locator('.conversation-property');
    private readonly FIRST_CONVERSATION_TIME = this.FIRST_CONVERSATION.locator('.conversation-time');

    // Thread
    private readonly THREAD = this.page.locator('.messages-thread');
    private readonly THREAD_USER_NAME = this.page.locator('.thread-user-name');
    private readonly THREAD_PROPERTY = this.page.locator('.thread-property');
    private readonly SENT_MESSAGES = this.page.locator('.message.sent');
    private readonly RECEIVED_MESSAGES = this.page.locator('.message.received');
    private readonly FIRST_MESSAGE_CONTENT = this.page.locator('.message .message-content').first();
    private readonly FIRST_MESSAGE_TIME = this.page.locator('.message .message-time').first();
    private readonly LAST_MESSAGE = this.page.locator('.message').last();

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(MessagesPage.PATH);
    }

    async sendMessageToHost(message: string) {
        await this.goto();
        await this.INPUT_FORM.fill(message);
        await this.SEND_BUTTON.click();
    }

    async expectSentMessageInChat(message: string) {
        await this.goto();
        expect(await this.LAST_SENT_MESSAGE.textContent()).toContain(message);
    }

    async expectReceivedMessageInChat(message: string) {
        await this.goto()
        expect(await this.LAST_RECEIVED_MESSAGE.textContent()).toContain(message);
    }

    async expectConversationListVisible() {
        await expect(this.FIRST_CONVERSATION).toBeVisible();
    }

    async expectFirstConversationHasName() {
        await expect(this.FIRST_CONVERSATION_NAME).not.toBeEmpty();
    }

    async expectFirstConversationHasPreview() {
        await expect(this.FIRST_CONVERSATION_PREVIEW).not.toBeEmpty();
    }

    async expectFirstConversationHasProperty() {
        await expect(this.FIRST_CONVERSATION_PROPERTY).not.toBeEmpty();
    }

    async expectFirstConversationHasTimestamp() {
        await expect(this.FIRST_CONVERSATION_TIME).not.toBeEmpty();
    }

    async expectNoConversations() {
        await expect(this.page.locator('.messages-empty')).toBeVisible();
        await expect(this.page.locator('.messages-empty h2')).toHaveText('No messages yet');
    }

    async clickFirstConversation() {
        await this.FIRST_CONVERSATION.click();
    }

    async expectThreadVisible() {
        await expect(this.THREAD).toBeVisible();
    }

    async expectThreadHeaderHasName() {
        await expect(this.THREAD_USER_NAME).not.toBeEmpty();
    }

    async expectThreadHeaderHasProperty() {
        await expect(this.THREAD_PROPERTY).not.toBeEmpty();
    }

    async expectSentMessagesExist() {
        await expect(this.SENT_MESSAGES.first()).toBeVisible();
    }

    async expectReceivedMessagesExist() {
        await expect(this.RECEIVED_MESSAGES.first()).toBeVisible();
    }

    async expectMessagesHaveTextAndTimestamp() {
        await expect(this.FIRST_MESSAGE_CONTENT).not.toBeEmpty();
        await expect(this.FIRST_MESSAGE_TIME).not.toBeEmpty();
    }

    async expectLastMessageInViewport() {
        await expect(this.LAST_MESSAGE).toBeInViewport();
    }
}