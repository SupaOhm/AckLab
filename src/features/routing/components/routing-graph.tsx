"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { isPathLink } from "../lib/shortest-path";
import type { RoutingLabLink, RoutingLabNode, RoutingPathResult, RoutingSelection } from "../types";

const graphWidth = 900;
const graphHeight = 520;
const nodeWidth = 126;
const nodeHeight = 100;

export function RoutingGraph({
  links,
  nodes,
  packetKey,
  route,
  selected,
  destinationId,
  sourceId,
  onSelectLink,
  onSelectNode,
  staticOnOpen = false,
  large = false
}: {
  links: RoutingLabLink[];
  nodes: RoutingLabNode[];
  packetKey: number;
  route: RoutingPathResult;
  selected: RoutingSelection;
  destinationId: string;
  sourceId: string;
  onSelectLink: (linkId: string) => void;
  onSelectNode: (nodeId: string) => void;
  staticOnOpen?: boolean;
  large?: boolean;
}) {
  const pathPoints = route.path
    .map((id) => nodes.find((node) => node.id === id))
    .filter(Boolean)
    .map((node) => ({ x: node!.x, y: node!.y }));
  const packetTarget = pathPoints.at(-1) ?? pathPoints[0];
  const showPacket = packetKey > 0 && route.reachable && pathPoints.length > 1;
  const sortedLinks = [...links].sort((left, right) => {
    const leftPriority = linkRenderPriority(left, route);
    const rightPriority = linkRenderPriority(right, route);

    return leftPriority - rightPriority;
  });

  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl border border-border/20 bg-card/35 p-3 shadow-xl shadow-black/10">
      <div className="network-grid absolute inset-0 opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_48%,hsl(var(--primary)/0.08),transparent_30%),radial-gradient(circle_at_84%_40%,hsl(var(--primary)/0.08),transparent_28%)]" />
      <svg
        className={cn(
          "relative z-10 block h-auto w-full",
          large ? "min-h-[520px]" : "min-h-[390px]"
        )}
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        role="img"
        aria-label="Routing topology graph"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="routing-packet-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="14"
          y="14"
          width={graphWidth - 28}
          height={graphHeight - 28}
          rx="24"
          className="fill-background/20 stroke-border/20"
        />

        <g aria-label="Routing links">
          {sortedLinks.map((link) => (
            <RoutingEdge
              key={link.id}
              link={link}
              nodes={nodes}
              route={route}
              selected={selected}
              onSelectLink={onSelectLink}
            />
          ))}
        </g>

        {showPacket ? (
          <motion.circle
            key={packetKey}
            r="8"
            filter="url(#routing-packet-glow)"
            className="fill-primary stroke-primary-foreground"
            strokeWidth="2"
            initial={
              staticOnOpen
                ? { cx: packetTarget.x, cy: packetTarget.y, opacity: 1 }
                : { cx: pathPoints[0].x, cy: pathPoints[0].y, opacity: 0.8 }
            }
            animate={
              staticOnOpen
                ? { cx: packetTarget.x, cy: packetTarget.y, opacity: 1 }
                : {
                    cx: pathPoints.map((point) => point.x),
                    cy: pathPoints.map((point) => point.y),
                    opacity: 1
                  }
            }
            transition={{
              duration: staticOnOpen ? 0 : Math.max(1.8, route.path.length * 0.62),
              ease: "easeInOut"
            }}
          />
        ) : null}

        <g aria-label="Routing nodes">
          {nodes.map((node) => (
            <RoutingNode
              key={node.id}
              destinationId={destinationId}
              node={node}
              route={route}
              selected={selected}
              sourceId={sourceId}
              onSelectNode={onSelectNode}
            />
          ))}
        </g>

        {!route.reachable ? (
          <g>
            <rect
              x="250"
              y="424"
              width="400"
              height="62"
              rx="18"
              className="fill-destructive/10 stroke-destructive/25"
            />
            <text
              x="450"
              y="452"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              No route available
            </text>
            <text x="450" y="472" textAnchor="middle" className="fill-muted-foreground text-xs">
              Enable a link or lower costs to reconnect the selected endpoints.
            </text>
          </g>
        ) : null}
      </svg>
    </section>
  );
}

function RoutingEdge({
  link,
  nodes,
  route,
  selected,
  onSelectLink
}: {
  link: RoutingLabLink;
  nodes: RoutingLabNode[];
  route: RoutingPathResult;
  selected: RoutingSelection;
  onSelectLink: (linkId: string) => void;
}) {
  const from = nodes.find((node) => node.id === link.from)!;
  const to = nodes.find((node) => node.id === link.to)!;
  const edge = edgeEndpoints(from, to);
  const active = route.reachable && isPathLink(route.path, link.from, link.to);
  const selectedLink = selected?.type === "link" && selected.id === link.id;
  const changed = link.cost !== link.initialCost || link.disabled;
  const label = edgeLabelPoint(from, to, link.labelOffset);

  return (
    <g>
      <line
        x1={edge.x1}
        y1={edge.y1}
        x2={edge.x2}
        y2={edge.y2}
        className={cn(
          active ? "stroke-primary" : "stroke-border",
          link.disabled && "stroke-muted-foreground",
          "transition-colors"
        )}
        strokeWidth={active ? 6 : selectedLink ? 4 : 2.5}
        strokeOpacity={link.disabled ? 0.28 : active ? 0.92 : 0.5}
        strokeDasharray={link.disabled ? "10 9" : undefined}
        strokeLinecap="round"
      />
      <line
        x1={edge.x1}
        y1={edge.y1}
        x2={edge.x2}
        y2={edge.y2}
        stroke="transparent"
        strokeWidth="28"
        className="cursor-pointer"
        onClick={() => onSelectLink(link.id)}
      />
      <g
        role="button"
        tabIndex={0}
        className="cursor-pointer focus:outline-none"
        aria-label={`Inspect link ${from.label} to ${to.label}`}
        onClick={() => onSelectLink(link.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectLink(link.id);
          }
        }}
      >
        <rect
          x={label.x - 38}
          y={label.y - 16}
          width="76"
          height="32"
          rx="16"
          className={cn(
            link.disabled
              ? "fill-background/90 stroke-border/45"
              : "fill-background/95 stroke-border/35",
            changed && !link.disabled && "fill-amber-400/15 stroke-amber-400/40",
            selectedLink && "fill-primary/15 stroke-primary/50"
          )}
        />
        <text
          x={label.x}
          y={label.y + 4}
          textAnchor="middle"
          className={cn(
            "fill-foreground font-mono text-[12px] font-semibold",
            link.disabled && "fill-muted-foreground",
            changed && !link.disabled && "fill-amber-200",
            selectedLink && "fill-primary"
          )}
        >
          {link.disabled ? "down" : link.cost}
          {changed && !link.disabled ? " edit" : ""}
        </text>
      </g>
    </g>
  );
}

function RoutingNode({
  destinationId,
  node,
  route,
  selected,
  sourceId,
  onSelectNode
}: {
  destinationId: string;
  node: RoutingLabNode;
  route: RoutingPathResult;
  selected: RoutingSelection;
  sourceId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  const inPath = route.path.includes(node.id);
  const selectedNode = selected?.type === "node" && selected.id === node.id;
  const visited = route.visitedOrder.includes(node.id);
  const isSource = node.id === sourceId;
  const isDestination = node.id === destinationId;
  const x = node.x - nodeWidth / 2;
  const y = node.y - nodeHeight / 2;

  return (
    <g
      role="button"
      tabIndex={0}
      className="cursor-pointer focus:outline-none"
      aria-label={`Inspect ${node.label}`}
      onClick={() => onSelectNode(node.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectNode(node.id);
        }
      }}
    >
      <rect
        x={x}
        y={y}
        width={nodeWidth}
        height={nodeHeight}
        rx="18"
        className={cn(
          "fill-card/90 stroke-border/35 transition-colors",
          visited && "fill-card stroke-border/45",
          inPath && "fill-primary/10 stroke-primary/40",
          selectedNode && "fill-accent/10 stroke-accent/55"
        )}
        strokeWidth={selectedNode ? 2.5 : inPath ? 2 : 1.5}
      />
      <NodeGlyph node={node} x={node.x} y={y + 22} />
      {(isSource || isDestination) && (
        <g>
          <rect
            x={node.x - 38}
            y={y + 43}
            width="76"
            height="18"
            rx="9"
            className="fill-primary/15 stroke-primary/25"
          />
          <text
            x={node.x}
            y={y + 56}
            textAnchor="middle"
            className="fill-primary text-[10px] font-medium"
          >
            {isSource ? "source" : "destination"}
          </text>
        </g>
      )}
      <text
        x={node.x}
        y={y + (isSource || isDestination ? 76 : 66)}
        textAnchor="middle"
        className={cn(
          "fill-foreground text-sm font-semibold",
          inPath && "fill-primary",
          selectedNode && "fill-accent"
        )}
      >
        {node.label}
      </text>
      <text
        x={node.x}
        y={y + (isSource || isDestination ? 91 : 84)}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[10px]"
      >
        {node.address}
      </text>
    </g>
  );
}

function NodeGlyph({ node, x, y }: { node: RoutingLabNode; x: number; y: number }) {
  return (
    <g>
      <rect
        x={x - 18}
        y={y - 15}
        width="36"
        height="30"
        rx="10"
        className="fill-primary/12 stroke-primary/25"
      />
      {node.type === "router" ? (
        <>
          <circle cx={x} cy={y} r="8" className="fill-primary/25 stroke-primary" />
          <path
            d={`M${x - 10} ${y}H${x + 10}M${x} ${y - 10}V${y + 10}`}
            className="stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : node.id === "server" ? (
        <>
          <rect
            x={x - 9}
            y={y - 10}
            width="18"
            height="20"
            rx="3"
            className="fill-primary/25 stroke-primary"
          />
          <path
            d={`M${x - 5} ${y - 3}H${x + 5}M${x - 5} ${y + 4}H${x + 5}`}
            className="stroke-primary"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x={x - 11}
            y={y - 8}
            width="22"
            height="15"
            rx="2"
            className="fill-primary/25 stroke-primary"
          />
          <path
            d={`M${x - 14} ${y + 11}H${x + 14}`}
            className="stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}

function linkRenderPriority(link: RoutingLabLink, route: RoutingPathResult) {
  if (route.reachable && isPathLink(route.path, link.from, link.to)) {
    return 2;
  }

  if (link.disabled) {
    return 1;
  }

  return 0;
}

function edgeEndpoints(from: RoutingLabNode, to: RoutingLabNode) {
  const start = pointOnNodeEdge(from, to);
  const end = pointOnNodeEdge(to, from);

  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y
  };
}

function pointOnNodeEdge(from: RoutingLabNode, to: RoutingLabNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const halfWidth = nodeWidth / 2;
  const halfHeight = nodeHeight / 2;
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);

  return {
    x: from.x + dx * scale,
    y: from.y + dy * scale
  };
}

function edgeLabelPoint(
  from: RoutingLabNode,
  to: RoutingLabNode,
  offset: RoutingLabLink["labelOffset"]
) {
  return {
    x: (from.x + to.x) / 2 + (offset?.x ?? 0),
    y: (from.y + to.y) / 2 + (offset?.y ?? 0)
  };
}
