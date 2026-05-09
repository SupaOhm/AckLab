"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routingEdges, routingNodes } from "@/data/routing";
import { findShortestPath, isPathEdge } from "@/features/networking/lib/routing-utils";

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
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Router Graph</CardTitle>
            <Button size="sm" onClick={() => setPacketKey((key) => key + 1)}>
              <Play className="size-4" />
              Send packet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-border/70 bg-background/70">
            <div className="network-grid absolute inset-0 opacity-35" />
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
                      strokeWidth={active ? 3 : 1.5}
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
                  className={`absolute grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border text-sm font-semibold transition-colors ${
                    selectedNode === node.id
                      ? "border-accent bg-accent/15 text-accent"
                      : inPath
                        ? "border-primary/55 bg-primary/15 text-primary"
                        : "border-border bg-card text-foreground"
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
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-xl shadow-accent/30"
              initial={pathPositions[0]}
              animate={{ left: packetLeft, top: packetTop }}
              transition={{ duration: 3.2, ease: "easeInOut" }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Routing Decision</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="rounded-lg border border-border/70 bg-secondary/30 p-4">
            <p className="text-sm font-medium">Shortest path</p>
            <p className="mt-2 font-mono text-lg text-primary">{shortest.path.join(" -> ")}</p>
            <p className="mt-2 text-sm text-muted-foreground">Total cost: {shortest.cost}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Selected node
            </p>
            <div className="mt-3 rounded-lg border border-border/70 bg-secondary/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{selected.label}</p>
                <Badge variant="outline">{selected.type}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This MVP uses local mock topology data and Dijkstra path selection. Future versions
                can swap this domain contract for live topology or telemetry APIs.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setPacketKey((key) => key + 1)}>
            <RotateCcw className="size-4" />
            Replay path
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
