export interface RateLimitService {
  check(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }>;
}

// TODO(rate-limit): Implement at the edge/API boundary before exposing public write endpoints.
export const rateLimitServicePlaceholder: RateLimitService = {
  async check(_key, limit) {
    return { allowed: true, remaining: limit };
  }
};
