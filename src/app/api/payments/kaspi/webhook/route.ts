import { applyPaymentStatus } from "@/lib/data/payment";
import { paymentProvider } from "@/lib/payment";

// Server-to-server callback from Kaspi — not a page a browser navigates to,
// so it's a plain Route Handler rather than a Server Action, and it is NOT
// covered by the proxy.ts auth matcher (there is no user session here to
// check). Trust comes entirely from the signature, verified below over the
// exact raw request bytes before the payload is parsed or acted on in any
// way — this is the "Payment Verification" stage between the Payment Layer
// and the Enrollment Engine described in the architecture: this route never
// touches prisma.enrollment itself, it only calls applyPaymentStatus
// (src/lib/data/payment.ts), which is the sole place that then calls
// grantEnrollment once a payment is confirmed PAID.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-kaspi-signature");

  if (!paymentProvider.verifyWebhookSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let result;
  try {
    result = paymentProvider.parseWebhookPayload(rawBody);
  } catch {
    return new Response("Malformed payload", { status: 400 });
  }

  // Idempotent by construction: a replayed/duplicated webhook for the same
  // providerReference finds the Payment already past PENDING and is a no-op
  // (see applyPaymentStatus) — always still answer 200 so Kaspi doesn't keep
  // retrying a delivery we've already handled.
  const outcome = await applyPaymentStatus(result.providerReference, result.status);
  if (!outcome.applied && outcome.reason === "not_found") {
    return new Response("Unknown payment", { status: 404 });
  }

  return Response.json({ received: true });
}
