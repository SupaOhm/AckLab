import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const routingProtocolModules: CurriculumModule[] = [
  ["bgp", "BGP", "Routes traffic between autonomous systems.", "advanced", ["BGP"]],
  ["ospf", "OSPF", "Finds internal network paths dynamically.", "advanced", ["OSPF"]]
].map(([id, title, shortDescription, difficulty, protocols]) =>
  module({
    id: String(id),
    title: String(title),
    shortDescription: String(shortDescription),
    category: "Routing Protocols",
    difficulty: difficulty as "advanced",
    estimatedTime: "15 min",
    prerequisites: ["dynamic-routing", "routing-table"],
    relatedModules: ["routing-visualizer"],
    osiLayer: 3,
    protocols: protocols as string[],
    type: "protocol"
  })
);
