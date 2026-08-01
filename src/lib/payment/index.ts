import { kaspiProvider } from "./kaspi";
import type { PaymentProvider } from "./types";

export const paymentProvider: PaymentProvider = kaspiProvider;
export type { PaymentProvider, CreatePaymentInput, CreatePaymentResult, PaymentStatusResult } from "./types";
