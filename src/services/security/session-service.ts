export interface SessionService {
  rotate(sessionId: string): Promise<string>;
  revoke(sessionId: string): Promise<void>;
}

// TODO(session): Use secure cookies, rotation, revocation, and device/session audit trails.
export const sessionServicePlaceholder: SessionService = {
  async rotate(sessionId) {
    return sessionId;
  },
  async revoke() {
    return undefined;
  }
};
