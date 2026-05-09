import type { FutureUser } from "@/services/contracts";

export interface AuthService {
  getCurrentUser(): Promise<FutureUser | null>;
  requireUser(): Promise<FutureUser>;
  signOut(): Promise<void>;
}

// TODO(auth): Replace this no-op contract with a secure provider adapter.
// Future concerns: session rotation, CSRF protection, MFA, OAuth linking, and edge-safe middleware.
export const authServicePlaceholder: AuthService = {
  async getCurrentUser() {
    return null;
  },
  async requireUser() {
    throw new Error("Auth is not implemented in the local mock MVP.");
  },
  async signOut() {
    return undefined;
  }
};
