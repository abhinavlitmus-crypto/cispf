import { NEWSLETTER_SUBSCRIBE } from "@/constants/api-endpoints";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/api/websitePage";

export type NewsletterSubscribePayload = { name: string; email: string; consent: boolean };

// Outcomes the backend reports in data.status (success) or extra.status (failure).
export type NewsletterStatus =
  | "subscribed"
  | "confirmation_required"
  | "already_subscribed"
  | "processing"
  | "unsubscribed"
  | "ineligible"
  | "failed"
  | "rate_limited";

export async function subscribeToNewsletter(payload: NewsletterSubscribePayload) {
  return axiosInstance.post<ApiResponse<{ status: NewsletterStatus }>>(NEWSLETTER_SUBSCRIBE, payload);
}
