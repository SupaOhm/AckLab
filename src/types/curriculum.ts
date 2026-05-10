export type CurriculumDifficulty = "beginner" | "intermediate" | "advanced";

export type CurriculumStatus = "unlocked" | "locked" | "comingSoon";
export type CurriculumAvailability = "available" | "completed" | "locked" | "comingSoon";

export type CurriculumModuleType = "concept" | "lab" | "tool" | "protocol" | "path";

export interface CurriculumModule {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  difficulty: CurriculumDifficulty;
  status: CurriculumStatus;
  estimatedTime: string;
  prerequisites: string[];
  relatedModules: string[];
  osiLayer?: number;
  protocols?: string[];
  type: CurriculumModuleType;
  route?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  shortDescription: string;
  moduleIds: string[];
  goal?: string;
}
