import type { FutureUser, UserRole } from "@/services/contracts";

export interface RbacService {
  can(user: FutureUser | null, permission: string): boolean;
  hasRole(user: FutureUser | null, role: UserRole): boolean;
}

// TODO(rbac): Map permissions to product capabilities once authenticated users exist.
export const rbacServicePlaceholder: RbacService = {
  can() {
    return false;
  },
  hasRole(user, role) {
    return Boolean(user?.roles.includes(role));
  }
};
