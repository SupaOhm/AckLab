export type UserRole = "student" | "instructor" | "admin";

export interface FutureUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
}

export interface AuditEvent {
  actorId: string;
  action: string;
  resource: string;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CourseProgressSnapshot {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  updatedAt: Date;
}

export interface PaymentCheckoutRequest {
  userId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface ApiClientContract {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TBody>(path: string, body: TBody): Promise<TResponse>;
}
