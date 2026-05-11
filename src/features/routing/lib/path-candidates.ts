import type { RouteCandidate, RoutingLabLink, RoutingLabNode } from "@/features/routing/types";

export function findRouteCandidates({
  links,
  nodes,
  selectedPath,
  sourceId,
  destinationId,
  limit = 3
}: {
  links: RoutingLabLink[];
  nodes: RoutingLabNode[];
  selectedPath: string[];
  sourceId: string;
  destinationId: string;
  limit?: number;
}): RouteCandidate[] {
  const enabledLinks = links.filter((link) => !link.disabled);
  const paths = enumerateSimplePaths({
    current: sourceId,
    destinationId,
    links: enabledLinks,
    maxDepth: nodes.length,
    visited: new Set([sourceId])
  })
    .map((path) => ({
      path,
      cost: pathCost(path, enabledLinks)
    }))
    .sort((left, right) => left.cost - right.cost)
    .slice(0, limit);

  if (paths.length === 0) {
    return [
      {
        id: "unavailable",
        path: [],
        cost: Number.POSITIVE_INFINITY,
        status: "unavailable",
        reason: "No enabled link sequence reaches the destination."
      }
    ];
  }

  return paths.map((candidate, index) => {
    const selected = samePath(candidate.path, selectedPath);
    const selectedCost = paths.find((path) => samePath(path.path, selectedPath))?.cost;

    return {
      id: candidate.path.join("-"),
      path: candidate.path,
      cost: candidate.cost,
      status: selected ? "selected" : "alternative",
      reason: selected
        ? "Lowest total cost."
        : selectedCost
          ? `Costs ${candidate.cost - selectedCost} more than selected.`
          : index === 0
            ? "Lowest available route."
            : "More expensive than the best available route."
    };
  });
}

function enumerateSimplePaths({
  current,
  destinationId,
  links,
  maxDepth,
  visited
}: {
  current: string;
  destinationId: string;
  links: RoutingLabLink[];
  maxDepth: number;
  visited: Set<string>;
}): string[][] {
  if (current === destinationId) {
    return [[current]];
  }

  if (visited.size >= maxDepth) {
    return [];
  }

  return links
    .filter((link) => link.from === current || link.to === current)
    .flatMap((link) => {
      const next = link.from === current ? link.to : link.from;

      if (visited.has(next)) {
        return [];
      }

      const nextVisited = new Set(visited);
      nextVisited.add(next);

      return enumerateSimplePaths({
        current: next,
        destinationId,
        links,
        maxDepth,
        visited: nextVisited
      }).map((path) => [current, ...path]);
    });
}

function pathCost(path: string[], links: RoutingLabLink[]) {
  return path.slice(0, -1).reduce((total, nodeId, index) => {
    const next = path[index + 1];
    const link = links.find(
      (item) =>
        (item.from === nodeId && item.to === next) || (item.to === nodeId && item.from === next)
    );

    return total + (link?.cost ?? 0);
  }, 0);
}

function samePath(left: string[], right: string[]) {
  return left.length === right.length && left.every((nodeId, index) => nodeId === right[index]);
}
