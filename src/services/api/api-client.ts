import type { ApiClientContract } from "@/services/contracts";

// TODO(api): Swap for a typed fetch client with auth headers, retry policy, and request tracing.
export const apiClientPlaceholder: ApiClientContract = {
  async get() {
    throw new Error("API layer is not implemented in the local mock MVP.");
  },
  async post() {
    throw new Error("API layer is not implemented in the local mock MVP.");
  }
};
