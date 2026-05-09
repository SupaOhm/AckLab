import type { RoutingEdge, RoutingNode } from "@/types/networking";

export function findShortestPath(
  nodes: RoutingNode[],
  edges: RoutingEdge[],
  start: string,
  end: string
) {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set(nodes.map((node) => node.id));

  nodes.forEach((node) => {
    distances.set(node.id, node.id === start ? 0 : Number.POSITIVE_INFINITY);
    previous.set(node.id, null);
  });

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (left, right) => (distances.get(left) ?? Infinity) - (distances.get(right) ?? Infinity)
    )[0];

    if (!current || current === end) {
      break;
    }

    unvisited.delete(current);

    const neighbors = edges.filter((edge) => edge.from === current || edge.to === current);

    neighbors.forEach((edge) => {
      const neighbor = edge.from === current ? edge.to : edge.from;

      if (!unvisited.has(neighbor)) {
        return;
      }

      const candidate = (distances.get(current) ?? Infinity) + edge.cost;

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

  return {
    path: path[0] === start ? path : [],
    cost: distances.get(end) ?? Infinity
  };
}

export function isPathEdge(path: string[], from: string, to: string) {
  return path.some((node, index) => {
    const next = path[index + 1];
    return (node === from && next === to) || (node === to && next === from);
  });
}
