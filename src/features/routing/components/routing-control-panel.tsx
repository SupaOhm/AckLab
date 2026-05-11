"use client";

import { Link2Off, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { isPathLink } from "../lib/shortest-path";
import type { RoutingLabLink, RoutingLabNode, RoutingSelection } from "../types";

const linkGroups: RoutingLabLink["group"][] = [
  "Client access",
  "Core router links",
  "Server access"
];

export function RoutingControlPanel({
  destinationId,
  links,
  nodes,
  selected,
  sourceId,
  routePath,
  onChangeCost,
  onResetTopology,
  onSelectDestination,
  onSelectLink,
  onSelectSource,
  onToggleLink
}: {
  destinationId: string;
  links: RoutingLabLink[];
  nodes: RoutingLabNode[];
  selected: RoutingSelection;
  sourceId: string;
  routePath: string[];
  onChangeCost: (linkId: string, cost: number) => void;
  onResetTopology: () => void;
  onSelectDestination: (nodeId: string) => void;
  onSelectLink: (linkId: string) => void;
  onSelectSource: (nodeId: string) => void;
  onToggleLink: (linkId: string) => void;
}) {
  const disabledCount = links.filter((link) => link.disabled).length;
  const changedCount = links.filter(
    (link) => link.cost !== link.initialCost || link.disabled
  ).length;

  return (
    <aside className="grid content-start gap-4">
      <section className="rounded-2xl border border-border/25 bg-card/55 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Route endpoints</p>
            <p className="mt-1 text-xs text-muted-foreground">Choose packet direction.</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onResetTopology}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <EndpointSelect
            id="route-source"
            label="Source"
            nodes={nodes}
            value={sourceId}
            disabledNodeId={destinationId}
            onChange={onSelectSource}
          />
          <EndpointSelect
            id="route-destination"
            label="Destination"
            nodes={nodes}
            value={destinationId}
            disabledNodeId={sourceId}
            onChange={onSelectDestination}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/25 bg-card/45 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Link editor</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Lower cost is preferred. Disabled links are ignored.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Badge variant="outline">{disabledCount} down</Badge>
            {changedCount > 0 ? <Badge variant="secondary">{changedCount} edited</Badge> : null}
          </div>
        </div>

        <div className="mt-4 max-h-[520px] overflow-y-auto pr-1">
          <div className="grid gap-4">
            {linkGroups.map((group) => (
              <div key={group}>
                <p className="mb-2 text-xs font-medium text-muted-foreground">{group}</p>
                <div className="grid gap-1.5">
                  {links
                    .filter((link) => link.group === group)
                    .map((link) => {
                      const from = nodes.find((node) => node.id === link.from)!;
                      const to = nodes.find((node) => node.id === link.to)!;
                      const selectedLink = selected?.type === "link" && selected.id === link.id;
                      const changed = link.cost !== link.initialCost || link.disabled;
                      const inSelectedPath = isPathLink(routePath, link.from, link.to);

                      return (
                        <div
                          key={link.id}
                          className={cn(
                            "grid gap-2 rounded-xl border border-border/15 bg-secondary/10 p-2.5",
                            selectedLink && "border-primary/35 bg-primary/10",
                            changed && !selectedLink && "border-amber-400/25 bg-amber-400/8",
                            link.disabled && "opacity-75"
                          )}
                        >
                          <button
                            type="button"
                            className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => onSelectLink(link.id)}
                          >
                            <span className="block text-sm font-medium">
                              {from.label} {"<->"} {to.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                              {link.description}
                            </span>
                          </button>

                          <div className="grid grid-cols-[minmax(0,1fr)_68px_auto] items-center gap-2">
                            <div className="flex min-w-0 flex-wrap gap-1.5">
                              {changed ? (
                                <Badge variant={link.disabled ? "outline" : "secondary"}>
                                  {link.disabled ? "disabled" : "edited"}
                                </Badge>
                              ) : null}
                              {inSelectedPath ? <Badge variant="default">path</Badge> : null}
                              {selectedLink ? <Badge variant="default">selected</Badge> : null}
                            </div>
                            <Input
                              type="number"
                              min={1}
                              value={link.cost}
                              disabled={link.disabled}
                              className="h-8 px-2"
                              aria-label={`Cost for ${from.label} to ${to.label}`}
                              onChange={(event) => {
                                const nextCost = Number(event.target.value);
                                if (Number.isFinite(nextCost) && nextCost > 0) {
                                  onChangeCost(link.id, Math.round(nextCost));
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant={link.disabled ? "default" : "outline"}
                              className="h-8 px-2"
                              onClick={() => onToggleLink(link.id)}
                            >
                              <Link2Off className="size-4" />
                              <span className="sr-only">
                                {link.disabled ? "Enable" : "Disable"}
                              </span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}

function EndpointSelect({
  disabledNodeId,
  id,
  label,
  nodes,
  value,
  onChange
}: {
  disabledNodeId: string;
  id: string;
  label: string;
  nodes: RoutingLabNode[];
  value: string;
  onChange: (nodeId: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onChange={(event) => onChange(event.target.value)}
      >
        {nodes.map((node) => (
          <option key={node.id} value={node.id} disabled={node.id === disabledNodeId}>
            {node.label}
          </option>
        ))}
      </select>
    </div>
  );
}
