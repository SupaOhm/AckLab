"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routingEdges, routingNodes } from "@/data/routing";
import { findShortestPath, isPathEdge } from "@/features/routing/lib/routing-utils";

export function RoutingVisualizer() {
  const [selectedNode, setSelectedNode] = useState("client");
  const [packetKey, setPacketKey] = useState(0);
  const shortest = useMemo(
    () => findShortestPath(routingNodes, routingEdges, "client", "server"),
    []
  );

  const selected = routingNodes.find((node) => node.id === selectedNode) ?? routingNodes[0];
  const pathPositions = shortest.path
    .map((id) => routingNodes.find((node) => node.id === id))
    .filter(Boolean)
    .map((node) => ({ left: `${node!.x}%`, top: `${node!.y}%` }));
  const packetLeft = pathPositions.map((position) => position.left);
  const packetTop = pathPositions.map((position) => position.top);

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="Routing workspace"
        description="The highlighted route is the lowest-cost known path from the source to the destination."
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          {/* Graph area */}
          <div className="relative min-h-[420px] overflow-hidden rounded-xl bg-secondary/8">
            <div className="network-grid absolute inset-0 opacity-10" />
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              {routingEdges.map((edge) => {
                const from = routingNodes.find((node) => node.id === edge.from)!;
                const to = routingNodes.find((node) => node.id === edge.to)!;
                const active = isPathEdge(shortest.path, edge.from, edge.to);

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      stroke={active ? "var(--primary)" : "var(--border)"}
                      strokeWidth={active ? 3 : 1}
                      strokeOpacity={active ? 0.7 : 0.4}
                    />
                    <text
                      x={`${(from.x + to.x) / 2}%`}
                      y={`${(from.y + to.y) / 2}%`}
                      fill="currentColor"
                      className="text-xs text-muted-foreground"
                    >
                      {edge.cost}
                    </text>
                  </g>
                );
              })}
            </svg>
            {routingNodes.map((node) => {
              const inPath = shortest.path.includes(node.id);
              return (
                <button
                  key={node.id}
                  className={`absolute grid size-18 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selectedNode === node.id
                      ? "bg-accent/10 text-accent ring-1 ring-accent/25"
                      : inPath
                        ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                        : "bg-card/70 text-foreground ring-1 ring-border/25"
                  }`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelectedNode(node.id)}
                >
                  {node.label}
                </button>
              );
            })}
            <motion.div
              key={packetKey}
              className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/80"
              initial={pathPositions[0]}
              animate={{ left: packetLeft, top: packetTop }}
              transition={{ duration: 3.2, ease: "easeInOut" }}
            />
          </div>

          {/* Sidebar controls */}
          <aside className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPacketKey((key) => key + 1)}>
                <Play className="size-4" />
                Send packet
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPacketKey((key) => key + 1)}>
                <RotateCcw className="size-4" />
                Replay
              </Button>
            </div>
            <div className="rounded-lg bg-primary/6 p-4">
              <p className="text-sm font-medium">Lowest-cost path</p>
              <p className="mt-2 font-mono text-base text-primary">{shortest.path.join(" → ")}</p>
              <p className="mt-2 text-sm text-muted-foreground">Total cost: {shortest.cost}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Selected node</p>
              <div className="mt-2 rounded-lg bg-secondary/12 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{selected.label}</p>
                  <Badge variant="outline">{selected.type}</Badge>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Click nodes to inspect them while the highlighted path stays visible.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <ExplanationPanel title="Route decision">
          <p>
            The packet follows the lowest-cost known path. In this topology, that means{" "}
            <span className="font-mono text-foreground">{shortest.path.join(" → ")}</span>.
          </p>
          <p>
            Real routers make similar decisions using routing tables built by static routes or
            dynamic routing protocols.
          </p>
        </ExplanationPanel>
        <PracticePrompt prompt="Find the link costs along the highlighted path. Add them together and confirm the total route cost." />
      </div>
    </div>
  );
}
