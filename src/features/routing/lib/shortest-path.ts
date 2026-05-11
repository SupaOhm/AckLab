import type { RoutingLabLink, RoutingLabNode, RoutingPathResult } from "@/features/routing/types";

type ShortestPathNode = Pick<RoutingLabNode, "id">;
type ShortestPathLink = Pick<RoutingLabLink, "from" | "to" | "cost" | "disabled">;

export function findShortestPath(
  nodes: ShortestPathNode[],
  links: ShortestPathLink[],
  start: string,
  end: string
): RoutingPathResult {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set(nodes.map((node) => node.id));
  const visitedOrder: string[] = [];

  nodes.forEach((node) => {
    distances.set(node.id, node.id === start ? 0 : Number.POSITIVE_INFINITY);
    previous.set(node.id, null);
  });

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (left, right) => (distances.get(left) ?? Infinity) - (distances.get(right) ?? Infinity)
    )[0];

    if (!current || (distances.get(current) ?? Infinity) === Number.POSITIVE_INFINITY) {
      break;
    }

    unvisited.delete(current);
    visitedOrder.push(current);

    if (current === end) {
      break;
    }

    const neighbors = links.filter(
      (link) => !link.disabled && (link.from === current || link.to === current)
    );

    neighbors.forEach((link) => {
      const neighbor = link.from === current ? link.to : link.from;

      if (!unvisited.has(neighbor)) {
        return;
      }

      const candidate = (distances.get(current) ?? Infinity) + link.cost;

      if (candidate < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, candidate);
        previous.set(neighbor, current);
      }
    });
  }

  const path: string[] = [];
  let current: string | null = end;

  while (current) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  const cost = distances.get(end) ?? Infinity;
  const reachable = path[0] === start && Number.isFinite(cost);

  return {
    path: reachable ? path : [],
    cost,
    reachable,
    visitedOrder
  };
}

export function isPathLink(path: string[], from: string, to: string) {
  return path.some((node, index) => {
    const next = path[index + 1];
    return (node === from && next === to) || (node === to && next === from);
  });
}
