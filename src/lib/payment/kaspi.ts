import crypto from "node:crypto";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider, PaymentStatusResult } from "./types";

// Kaspi Pay merchant integration. The general shape here (create an order,
// redirect the customer to a Kaspi-hosted checkout, then trust a signed
// server-to-server webhook over the browser redirect) matches how Kaspi Pay
// and comparable merchant payment APIs work, but the exact endpoint paths,
// request/response field names, and signature scheme below are illustrative
// placeholders driven entirely by env config — they MUST be confirmed
// against the actual Kaspi Pay merchant API docs for the provisioned
// merchant account before this can take a real payment.
const BASE_URL = process.env.KASPI_API_BASE_URL ?? "";
const MERCHANT_ID = process.env.KASPI_MERCHANT_ID ?? "";
const API_KEY = process.env.KASPI_API_KEY ?? "";
const WEBHOOK_SECRET = process.env.KASPI_WEBHOOK_SECRET ?? "";
const APP_BASE_URL = process.env.APP_BASE_URL ?? "http://localhost:3000";

function assertConfigured() {
  if (!BASE_URL || !MERCHANT_ID || !API_KEY || !WEBHOOK_SECRET) {
    throw new Error(
      "Kaspi payment provider is not configured — set KASPI_API_BASE_URL, KASPI_MERCHANT_ID, KASPI_API_KEY, and KASPI_WEBHOOK_SECRET.",
    );
  }
}

type KaspiWebhookPayload = {
  orderId: string;
  paymentId: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  amount: number;
};

function mapStatus(status: KaspiWebhookPayload["status"]): PaymentStatusResult["status"] {
  switch (status) {
    case "SUCCESS":
      return "PAID";
    case "FAILED":
      return "FAILED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}

export const kaspiProvider: PaymentProvider = {
  async createPayment({ orderId, amountKzt, description }: CreatePaymentInput): Promise<CreatePaymentResult> {
    assertConfigured();

    const response = await fetch(`${BASE_URL}/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        merchantId: MERCHANT_ID,
        orderId,
        amount: amountKzt,
        currency: "KZT",
        description,
        returnUrl: `${APP_BASE_URL}/payments/${orderId}`,
        webhookUrl: `${APP_BASE_URL}/api/payments/kaspi/webhook`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Kaspi payment creation failed with status ${response.status}`);
    }

    const data = (await response.json()) as { paymentId: string; checkoutUrl: string };
    return { checkoutUrl: data.checkoutUrl, providerReference: data.paymentId };
  },

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!signatureHeader) return false;
    assertConfigured();

    const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody, "utf8").digest("hex");

    // Constant-time comparison — a plain `===` would leak timing information
    // an attacker could use to forge a valid signature byte-by-byte.
    const expectedBuf = Buffer.from(expected, "hex");
    const receivedBuf = Buffer.from(signatureHeader, "hex");
    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  },

  parseWebhookPayload(rawBody: string): PaymentStatusResult {
    const payload = JSON.parse(rawBody) as KaspiWebhookPayload;
    return { providerReference: payload.paymentId, status: mapStatus(payload.status) };
  },

  async checkPaymentStatus(providerReference: string): Promise<PaymentStatusResult> {
    assertConfigured();

    const response = await fetch(`${BASE_URL}/v1/payments/${providerReference}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!response.ok) {
      throw new Error(`Kaspi payment status check failed with status ${response.status}`);
    }

    const data = (await response.json()) as { paymentId: string; status: KaspiWebhookPayload["status"] };
    return { providerReference: data.paymentId, status: mapStatus(data.status) };
  },
};
