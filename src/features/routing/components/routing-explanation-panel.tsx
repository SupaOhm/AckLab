import { Badge } from "@/components/ui/badge";

import type {
  RouteCandidate,
  RoutingLabLink,
  RoutingLabNode,
  RoutingPathResult,
  RoutingSelection
} from "../types";

export function RoutingExplanationPanel({
  destination,
  links,
  nodes,
  primaryAlternative,
  recomputeCount,
  route,
  selected,
  source
}: {
  destination: RoutingLabNode;
  links: RoutingLabLink[];
  nodes: RoutingLabNode[];
  primaryAlternative?: RouteCandidate;
  recomputeCount: number;
  route: RoutingPathResult;
  selected: RoutingSelection;
  source: RoutingLabNode;
}) {
  const selectedNode =
    selected?.type === "node" ? nodes.find((node) => node.id === selected.id) : null;
  const selectedLink =
    selected?.type === "link" ? links.find((link) => link.id === selected.id) : null;
  const selectedLinkNodes = selectedLink
    ? [
        nodes.find((node) => node.id === selectedLink.from),
        nodes.find((node) => node.id === selectedLink.to)
      ]
    : [];

  return (
    <section className="rounded-2xl border border-border/25 bg-card/55 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Route decision</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {source.label} to {destination.label}
          </p>
        </div>
        <Badge variant={route.reachable ? "default" : "outline"}>
          {route.reachable ? `cost ${route.cost}` : "no route"}
        </Badge>
      </div>

      <div className="mt-4 rounded-xl bg-primary/10 p-3">
        <p className="text-xs font-medium text-primary">Chosen path</p>
        <p className="mt-2 break-words font-mono text-sm text-primary">
          {route.reachable ? route.path.map((id) => nodeLabel(nodes, id)).join(" -> ") : "none"}
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {route.reachable && primaryAlternative
          ? `${nodeLabel(nodes, route.path[0])} uses ${route.path
              .map((id) => nodeLabel(nodes, id))
              .join(
                " -> "
              )} because its total cost is ${route.cost}. The alternative ${primaryAlternative.path
              .map((id) => nodeLabel(nodes, id))
              .join(" -> ")} costs ${primaryAlternative.cost}.`
          : route.reachable
            ? "The route with the lowest total link cost is selected. Disabled links are ignored."
            : "No enabled link sequence currently connects the selected source and destination."}
      </p>

      {recomputeCount > 0 ? (
        <p className="mt-2 text-xs text-primary">Route recomputed after the latest change.</p>
      ) : null}

      <div className="mt-4 rounded-xl bg-secondary/14 p-3">
        {selectedNode ? (
          <>
            <p className="text-xs font-medium text-muted-foreground">Selected node</p>
            <p className="mt-1 font-semibold">{selectedNode.label}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{selectedNode.address}</p>
          </>
        ) : selectedLink && selectedLinkNodes[0] && selectedLinkNodes[1] ? (
          <>
            <p className="text-xs font-medium text-muted-foreground">Selected link</p>
            <p className="mt-1 font-mono text-sm">
              {selectedLinkNodes[0].label} {"->"} {selectedLinkNodes[1].label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedLink.disabled
                ? "This link is down, so packets cannot use it."
                : `Current cost is ${selectedLink.cost}.`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Click a node or link to inspect it.</p>
        )}
      </div>
    </section>
  );
}

function nodeLabel(nodes: RoutingLabNode[], id: string) {
  return nodes.find((node) => node.id === id)?.label ?? id;
}
