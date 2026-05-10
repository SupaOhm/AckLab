import type { CurriculumModule, LearningPath } from "@/types/curriculum";

import { networkLayerConceptModules, networkLayerLabModules } from "./addressing";
import {
  applicationLabModules,
  applicationProtocolModules,
  upperLayerConceptModules
} from "./application";
import { cloudModules } from "./cloud";
import { deviceModules } from "./devices";
import { foundationModules } from "./foundations";
import { upcomingLabModules } from "./labs";
import { linkLayerModules } from "./link";
import { beginnerPath, goalPaths, labModuleIds, protocolExplorerIds } from "./paths";
import { routingProtocolModules } from "./protocols";
import { securityModules } from "./security";
import { transportLabModules, transportModules } from "./transport";

export const curriculumModules: CurriculumModule[] = [
  ...foundationModules,
  ...deviceModules,
  ...linkLayerModules,
  ...networkLayerConceptModules,
  ...networkLayerLabModules,
  ...transportModules,
  ...transportLabModules,
  ...upperLayerConceptModules,
  ...applicationProtocolModules,
  ...applicationLabModules,
  ...securityModules,
  ...cloudModules,
  ...upcomingLabModules,
  ...routingProtocolModules
];

export const osiLayerPath: LearningPath[] = [1, 2, 3, 4, 5, 6, 7].map((layer) => ({
  id: `osi-layer-${layer}`,
  title: `Layer ${layer}`,
  shortDescription: layerName(layer),
  moduleIds: curriculumModules
    .filter((item) => item.osiLayer === layer)
    .slice(0, 10)
    .map((item) => item.id)
}));

export { beginnerPath, goalPaths, labModuleIds, protocolExplorerIds };

export function getModuleById(id: string) {
  return curriculumModules.find((item) => item.id === id);
}

export function getModules(ids: string[]) {
  return ids
    .map((id) => getModuleById(id))
    .filter((item): item is CurriculumModule => Boolean(item));
}

export function getUnlockedModules() {
  return curriculumModules.filter((item) => item.status === "unlocked");
}

export function getLockedModules() {
  return curriculumModules.filter((item) => item.status !== "unlocked");
}

function layerName(layer: number) {
  return (
    {
      1: "Physical",
      2: "Data Link",
      3: "Network",
      4: "Transport",
      5: "Session",
      6: "Presentation",
      7: "Application"
    }[layer] ?? "OSI"
  );
}
