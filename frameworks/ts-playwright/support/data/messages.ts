import { seededProperty } from './properties';

export const MESSAGE_TO_SEND = "hello sir";

export const getUnqiueMessage = (): string => {
    return MESSAGE_TO_SEND + " " + Date.now();
}

export interface MessagePayload {
    receiverId: number;
    propertyId: number;
    content: string;
}

export const validMessagePayload = (receiverId: number, overrides: Partial<MessagePayload> = {}): MessagePayload => ({
    receiverId,
    propertyId: Number(seededProperty.id),
    content: 'Hello, I have a question about your property.',
    ...overrides,
});
