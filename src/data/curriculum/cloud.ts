import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const cloudModules: CurriculumModule[] = [
  ["load-balancer", "Load balancer", "Distributes requests across services."],
  ["cdn", "CDN", "Caches content close to users."],
  ["reverse-proxy", "Reverse proxy", "Fronts services and forwards requests."],
  ["api-gateway", "API gateway", "Central entry point for APIs."],
  ["vpc", "VPC", "A private cloud network boundary."],
  ["cloud-subnets", "Subnets in cloud", "Address ranges inside a cloud network."],
  ["security-groups", "Security groups", "Cloud-native traffic rules."],
  ["zero-trust", "Zero Trust basics", "Verify access continuously instead of trusting location."]
].map(([id, title, shortDescription]) =>
  module({
    id,
    title,
    shortDescription,
    category: "Cloud & Modern Networks",
    difficulty: "intermediate",
    estimatedTime: "10 min",
    prerequisites: ["subnet-visualizer", "firewalls"],
    relatedModules: ["vpc", "security-groups"],
    type: "concept"
  })
);
