import type { AuditEvent } from "@/services/contracts";

export interface AuditService {
  record(event: AuditEvent): Promise<void>;
}

// TODO(audit): Persist immutable audit events for admin, billing, and security operations.
export const auditServicePlaceholder: AuditService = {
  async record() {
    return undefined;
  }
};
