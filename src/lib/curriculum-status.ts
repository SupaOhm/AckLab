import type {
  CurriculumAvailability,
  CurriculumModule,
  CurriculumStatus
} from "@/types/curriculum";

function resolveBaseAvailability(status: CurriculumStatus, module: CurriculumModule) {
  if (status === "unlocked") {
    return "available" satisfies CurriculumAvailability;
  }

  if (status === "locked") {
    return "locked" satisfies CurriculumAvailability;
  }

  return module.type === "lab" || module.type === "tool"
    ? ("comingSoon" satisfies CurriculumAvailability)
    : ("locked" satisfies CurriculumAvailability);
}

export function getCurriculumAvailability(
  module: CurriculumModule,
  completed = false
): CurriculumAvailability {
  if (completed && module.status === "unlocked") {
    return "completed";
  }

  return resolveBaseAvailability(module.status, module);
}

export function isModuleAvailable(module: CurriculumModule) {
  return module.status === "unlocked";
}
