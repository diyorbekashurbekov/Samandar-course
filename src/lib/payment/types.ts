// Provider-agnostic contract for course payments. `src/lib/payment/kaspi.ts`
// is the only file that knows about Kaspi specifically — swapping to a
// different provider (or adding a second one) later means implementing this
// interface again and changing the single export in `src/lib/payment/index.ts`.
// Mirrors the same split used for lesson video storage (see src/lib/video/).

export type CreatePaymentInput = {
  /** Our own Payment.id — passed through so the provider can echo it back on
   * return-redirect / webhook, letting us resolve the row without trusting
   * anything else in the callback. */
  orderId: string;
  amountKzt: number;
  description: string;
};

export type CreatePaymentResult = {
  /** Where to send the browser to complete payment (Kaspi-hosted checkout / QR page). */
  checkoutUrl: string;
  /** Kaspi's own identifier for this payment — stored as Payment.providerReference. */
  providerReference: string;
};

export type PaymentStatusResult = {
  providerReference: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
};

export interface PaymentProvider {
  /** Starts a checkout session with the provider for a single Payment row. */
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /**
   * Verifies that a webhook request actually came from the provider, using
   * the *raw* request body (never the parsed one — signatures are computed
   * over exact bytes). Must run before the payload is trusted in any way.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean;
  /** Parses an already-signature-verified webhook body into a status result. */
  parseWebhookPayload(rawBody: string): PaymentStatusResult;
  /**
   * Independently asks the provider for a payment's current status, rather
   * than trusting a webhook body. Used as a reconciliation fallback (e.g. the
   * payment return page, if a webhook hasn't arrived yet) — never required
   * for the webhook path itself, since a verified signature is already
   * authoritative there.
   */
  checkPaymentStatus(providerReference: string): Promise<PaymentStatusResult>;
}
