import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const REVIEWS_BASE = `${env.API_BASE_URL}/reviews`;

export interface CreateReviewPayload {
    bookingId?: number;
    rating?: number | null;
    comment?: string;
    reviewType?: string;
}

interface ReviewBody {
    id: number;
    bookingId: number;
    rating: number;
    reviewType: string;
    comment?: string;
}

export class ReviewsApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    createReview(payload: CreateReviewPayload): Promise<APIResponse> {
        return this.request.post(REVIEWS_BASE, {
            data: payload,
            headers: this.headers(),
        });
    }

    async expectReviewCreated(response: APIResponse): Promise<ReviewBody> {
        expect(response.status()).toBe(201);
        const body = await response.json() as ReviewBody;
        expect(body.id).toBeDefined();
        expect(body.rating).toBeDefined();
        return body;
    }

    async expectConflict(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(409);
    }

    async expectValidationError(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(400);
    }

    async expectForbidden(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(403);
    }
}
