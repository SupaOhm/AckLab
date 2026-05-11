import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type {
  RouteCandidate,
  RouteChangeRecord,
  RoutingLabNode,
  RoutingPathResult
} from "../types";

export function RouteComparisonPanel({
  candidates,
  changeRecord,
  currentRoute,
  nodes
}: {
  candidates: RouteCandidate[];
  changeRecord: RouteChangeRecord | null;
  currentRoute: RoutingPathResult;
  nodes: RoutingLabNode[];
}) {
  const changed =
    changeRecord &&
    (changeRecord.previousRoute.reachable !== currentRoute.reachable ||
      pathLabel(nodes, changeRecord.previousRoute.path) !== pathLabel(nodes, currentRoute.path) ||
      changeRecord.previousRoute.cost !== currentRoute.cost);

  return (
    <section className="rounded-2xl border border-border/25 bg-card/55 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Route comparison</p>
          <p className="mt-1 text-xs text-muted-foreground">Why this route wins.</p>
        </div>
        {changeRecord ? (
          <Badge variant={changed ? "default" : "outline"}>
            {changed ? "route changed" : "same route"}
          </Badge>
        ) : null}
      </div>

      {changeRecord ? (
        <div className="mt-4 grid gap-3 rounded-xl bg-secondary/14 p-3 sm:grid-cols-2">
          <RouteSnapshot label="Before" nodes={nodes} route={changeRecord.previousRoute} />
          <RouteSnapshot label="Now" nodes={nodes} route={currentRoute} />
          <p className="sm:col-span-2 text-sm leading-6 text-muted-foreground">
            {changeReason(changed, changeRecord, currentRoute, nodes)}
          </p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className={cn(
              "grid gap-2 rounded-xl border border-border/20 bg-secondary/12 p-3 md:grid-cols-[minmax(0,1fr)_80px_110px]",
              candidate.status === "selected" && "border-primary/35 bg-primary/10",
              candidate.status === "unavailable" && "border-destructive/25 bg-destructive/10"
            )}
          >
            <div className="min-w-0">
              <p className="break-words font-mono text-xs">
                {candidate.path.length > 0 ? pathLabel(nodes, candidate.path) : "No path"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{candidate.reason}</p>
            </div>
            <p className="font-mono text-sm">
              {Number.isFinite(candidate.cost) ? candidate.cost : "-"}
            </p>
            <Badge variant={candidate.status === "selected" ? "default" : "outline"}>
              {candidate.status}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

function RouteSnapshot({
  label,
  nodes,
  route
}: {
  label: string;
  nodes: RoutingLabNode[];
  route: RoutingPathResult;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-mono text-xs">
        {route.reachable ? pathLabel(nodes, route.path) : "No route"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {route.reachable ? `cost ${route.cost}` : "unreachable"}
      </p>
    </div>
  );
}

function changeReason(
  changed: boolean | null,
  changeRecord: RouteChangeRecord,
  currentRoute: RoutingPathResult,
  nodes: RoutingLabNode[]
) {
  if (!currentRoute.reachable) {
    return `${changeRecord.label}. The selected endpoints are no longer connected by enabled links.`;
  }

  if (changed) {
    return `${changeRecord.label}. The lab recomputed the path and selected ${pathLabel(
      nodes,
      currentRoute.path
    )} because it now has the lowest total cost.`;
  }

  return `${changeRecord.label}. The route did not change because the previous path is still the cheapest available option.`;
}

function pathLabel(nodes: RoutingLabNode[], path: string[]) {
  return path.map((id) => nodes.find((node) => node.id === id)?.label ?? id).join(" -> ");
}
