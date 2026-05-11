import { initialRoutingLinks, initialRoutingNodes } from "@/features/routing/data/routing-topology";
import type { RoutingEdge, RoutingNode } from "@/types/networking";

export const routingNodes: RoutingNode[] = initialRoutingNodes.map(({ id, label, x, y, type }) => ({
  id,
  label,
  x,
  y,
  type
}));

export const routingEdges: RoutingEdge[] = initialRoutingLinks.map(({ from, to, cost }) => ({
  from,
  to,
  cost
}));
