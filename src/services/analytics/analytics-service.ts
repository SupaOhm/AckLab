export interface AnalyticsService {
  track(eventName: string, properties?: Record<string, unknown>): void;
}

// TODO(analytics): Add privacy-aware event collection and consent-aware providers.
export const analyticsServicePlaceholder: AnalyticsService = {
  track() {
    return undefined;
  }
};
