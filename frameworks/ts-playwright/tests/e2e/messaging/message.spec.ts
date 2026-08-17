import {guestAuthFile, test} from "../../../fixtures";
import {getUnqiueMessage} from "../../../support/data/messages";

test.describe('contact host in property details', () => {
    test.use({ storageState: guestAuthFile });

    let message: string;

    test.beforeEach(() => {
        message = getUnqiueMessage();
    });

    test('guest sending a message from property details page appears in guest messages page', async ({pages}) => {
        await pages.propertyDetailsPage.sendMessageToHost(message);
        await pages.messagesPage.expectSentMessageInChat(message);
    });

    test('guest sending a message from property details page appears in host messages page', async ({pages, hostPages}) => {
        await pages.propertyDetailsPage.sendMessageToHost(message);
        await hostPages.messagesPage.expectReceivedMessageInChat(message);
    });

    // NOTE make sure the host is the last chat
    test('guest sending a message from messages page appears in host messages page', async ({pages, hostPages}) => {
        await pages.messagesPage.sendMessageToHost(message);
        await hostPages.messagesPage.expectReceivedMessageInChat(message);
    });
});

