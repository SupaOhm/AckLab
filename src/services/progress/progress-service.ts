import type { CourseProgressSnapshot } from "@/services/contracts";

export interface ProgressService {
  getProgress(userId: string, courseId: string): Promise<CourseProgressSnapshot | null>;
  saveProgress(snapshot: CourseProgressSnapshot): Promise<void>;
}

// TODO(progress): Persist course state once auth and storage are available.
export const progressServicePlaceholder: ProgressService = {
  async getProgress() {
    return null;
  },
  async saveProgress() {
    return undefined;
  }
};
