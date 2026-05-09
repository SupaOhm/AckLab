import type { PaymentCheckoutRequest } from "@/services/contracts";

export interface PaymentService {
  createCheckoutSession(request: PaymentCheckoutRequest): Promise<{ url: string }>;
}

// TODO(payments): Integrate subscriptions and billing portal after plans are defined.
export const paymentServicePlaceholder: PaymentService = {
  async createCheckoutSession() {
    throw new Error("Payments are not implemented in the local mock MVP.");
  }
};
