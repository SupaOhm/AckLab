import type { RoutingEdge, RoutingNode } from "@/types/networking";

export const routingNodes: RoutingNode[] = [
  { id: "client", label: "Client", x: 8, y: 50, type: "endpoint" },
  { id: "r1", label: "R1", x: 28, y: 28, type: "router" },
  { id: "r2", label: "R2", x: 28, y: 72, type: "router" },
  { id: "r3", label: "R3", x: 54, y: 24, type: "router" },
  { id: "r4", label: "R4", x: 58, y: 70, type: "router" },
  { id: "server", label: "Server", x: 88, y: 50, type: "endpoint" }
];

export const routingEdges: RoutingEdge[] = [
  { from: "client", to: "r1", cost: 2 },
  { from: "client", to: "r2", cost: 4 },
  { from: "r1", to: "r3", cost: 2 },
  { from: "r1", to: "r4", cost: 6 },
  { from: "r2", to: "r4", cost: 2 },
  { from: "r2", to: "r3", cost: 5 },
  { from: "r3", to: "server", cost: 3 },
  { from: "r4", to: "server", cost: 2 },
  { from: "r3", to: "r4", cost: 1 }
];
