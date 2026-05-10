import type { CurriculumModule } from "@/types/curriculum";

const unlockedLabs = new Set([
  "binary-converter",
  "subnet-visualizer",
  "tcp-handshake",
  "dns-flow",
  "osi-model",
  "routing-visualizer",
  "arp-broadcast-lab"
]);

const routeById: Record<string, string> = {
  "binary-converter": "/tools/binary",
  "subnet-visualizer": "/tools/subnet",
  "tcp-handshake": "/visualizers/tcp-handshake",
  "dns-flow": "/visualizers/dns-flow",
  "osi-model": "/visualizers/osi-model",
  "routing-visualizer": "/visualizers/routing",
  "arp-broadcast-lab": "/visualizers/arp-broadcast"
};

export function module(input: Omit<CurriculumModule, "status" | "route">): CurriculumModule {
  const status = unlockedLabs.has(input.id) ? "unlocked" : "comingSoon";

  return {
    ...input,
    status,
    route: routeById[input.id] ?? `/learn/${input.id}`
  };
}
