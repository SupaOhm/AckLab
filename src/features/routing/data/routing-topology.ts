import type { RoutingLabLink, RoutingLabNode } from "@/features/routing/types";

export const initialRoutingNodes: RoutingLabNode[] = [
  {
    id: "client",
    label: "Client",
    x: 90,
    y: 260,
    type: "endpoint",
    address: "10.0.0.10"
  },
  { id: "r1", label: "R1", x: 300, y: 140, type: "router", address: "10.0.1.1" },
  { id: "r2", label: "R2", x: 300, y: 380, type: "router", address: "10.0.2.1" },
  { id: "r3", label: "R3", x: 570, y: 140, type: "router", address: "10.0.3.1" },
  { id: "r4", label: "R4", x: 570, y: 380, type: "router", address: "10.0.4.1" },
  {
    id: "server",
    label: "Server",
    x: 810,
    y: 260,
    type: "endpoint",
    address: "10.0.9.20"
  }
];

export const initialRoutingLinks: RoutingLabLink[] = [
  {
    id: "client-r1",
    from: "client",
    to: "r1",
    cost: 2,
    initialCost: 2,
    description: "Upper path from the client",
    group: "Client access",
    labelOffset: { x: -14, y: -16 }
  },
  {
    id: "client-r2",
    from: "client",
    to: "r2",
    cost: 4,
    initialCost: 4,
    description: "Lower path from the client",
    group: "Client access",
    labelOffset: { x: -14, y: 18 }
  },
  {
    id: "r1-r3",
    from: "r1",
    to: "r3",
    cost: 2,
    initialCost: 2,
    description: "Fast upper-core link",
    group: "Core router links",
    labelOffset: { x: 0, y: -18 }
  },
  {
    id: "r1-r4",
    from: "r1",
    to: "r4",
    cost: 6,
    initialCost: 6,
    description: "Cross route to lower router",
    group: "Core router links",
    labelOffset: { x: -22, y: -16 }
  },
  {
    id: "r2-r4",
    from: "r2",
    to: "r4",
    cost: 2,
    initialCost: 2,
    description: "Lower-core link",
    group: "Core router links",
    labelOffset: { x: 0, y: 18 }
  },
  {
    id: "r2-r3",
    from: "r2",
    to: "r3",
    cost: 5,
    initialCost: 5,
    description: "Backup cross-core link",
    group: "Core router links",
    labelOffset: { x: 26, y: 16 }
  },
  {
    id: "r3-r4",
    from: "r3",
    to: "r4",
    cost: 1,
    initialCost: 1,
    description: "Core crossover link",
    group: "Core router links",
    labelOffset: { x: 36, y: 0 }
  },
  {
    id: "r3-server",
    from: "r3",
    to: "server",
    cost: 3,
    initialCost: 3,
    description: "Upper path to destination",
    group: "Server access",
    labelOffset: { x: 12, y: -18 }
  },
  {
    id: "r4-server",
    from: "r4",
    to: "server",
    cost: 2,
    initialCost: 2,
    description: "Lower path to destination",
    group: "Server access",
    labelOffset: { x: 12, y: 18 }
  }
];
