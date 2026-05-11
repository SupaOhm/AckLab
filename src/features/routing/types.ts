export type RoutingNodeType = "endpoint" | "router";

export interface RoutingLabNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: RoutingNodeType;
  address: string;
}

export interface RoutingLabLink {
  id: string;
  from: string;
  to: string;
  cost: number;
  initialCost: number;
  description: string;
  group: "Client access" | "Core router links" | "Server access";
  labelOffset?: {
    x: number;
    y: number;
  };
  disabled?: boolean;
}

export interface RoutingPathResult {
  path: string[];
  cost: number;
  reachable: boolean;
  visitedOrder: string[];
}

export interface RouteCandidate {
  id: string;
  path: string[];
  cost: number;
  status: "selected" | "alternative" | "unavailable";
  reason: string;
}

export interface RouteChangeRecord {
  label: string;
  previousRoute: RoutingPathResult;
}

export type RoutingSelection = { type: "node"; id: string } | { type: "link"; id: string } | null;
