"use client";

import { Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { ExpandableVisualizerPane } from "@/components/shared/expandable-visualizer-pane";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { initialRoutingLinks, initialRoutingNodes } from "@/features/routing/data/routing-topology";
import { findRouteCandidates } from "@/features/routing/lib/path-candidates";
import { findShortestPath } from "@/features/routing/lib/shortest-path";

import { RouteComparisonPanel } from "./route-comparison-panel";
import { RoutingChallengePanel } from "./routing-challenge-panel";
import { RoutingControlPanel } from "./routing-control-panel";
import { RoutingExplanationPanel } from "./routing-explanation-panel";
import { RoutingGraph } from "./routing-graph";
import { RoutingScenarioPresets, type RoutingScenarioId } from "./routing-scenario-presets";
import { RoutingWorkflowPanel } from "./routing-workflow-panel";
import type { RouteChangeRecord, RoutingLabLink, RoutingSelection } from "../types";

export function RoutingVisualizer() {
  const [links, setLinks] = useState(() => initialRoutingLinks.map((link) => ({ ...link })));
  const [sourceId, setSourceId] = useState("client");
  const [destinationId, setDestinationId] = useState("server");
  const [selected, setSelected] = useState<RoutingSelection>({ type: "node", id: "client" });
  const [packetKey, setPacketKey] = useState(0);
  const [recomputeCount, setRecomputeCount] = useState(0);
  const [changeRecord, setChangeRecord] = useState<RouteChangeRecord | null>(null);

  const route = useMemo(
    () => findShortestPath(initialRoutingNodes, links, sourceId, destinationId),
    [destinationId, links, sourceId]
  );
  const candidates = useMemo(
    () =>
      findRouteCandidates({
        destinationId,
        links,
        nodes: initialRoutingNodes,
        selectedPath: route.path,
        sourceId
      }),
    [destinationId, links, route.path, sourceId]
  );
  const source = nodeById(sourceId);
  const destination = nodeById(destinationId);
  const primaryAlternative = candidates.find((candidate) => candidate.status === "alternative");
  const workflowStep = recomputeCount > 0 ? 4 : selected?.type === "link" ? 2 : 1;

  function markRouteChanged(label: string) {
    setChangeRecord({ label, previousRoute: route });
    setRecomputeCount((count) => count + 1);
    setPacketKey(0);
  }

  function updateSource(nodeId: string) {
    if (nodeId === destinationId) {
      return;
    }
    setSourceId(nodeId);
    setSelected({ type: "node", id: nodeId });
    markRouteChanged(`Source changed to ${nodeById(nodeId).label}`);
  }

  function updateDestination(nodeId: string) {
    if (nodeId === sourceId) {
      return;
    }
    setDestinationId(nodeId);
    setSelected({ type: "node", id: nodeId });
    markRouteChanged(`Destination changed to ${nodeById(nodeId).label}`);
  }

  function updateLinkCost(linkId: string, cost: number) {
    const link = links.find((item) => item.id === linkId);

    if (!link || link.cost === cost) {
      return;
    }

    setLinks((current) => current.map((link) => (link.id === linkId ? { ...link, cost } : link)));
    setSelected({ type: "link", id: linkId });
    markRouteChanged(`${linkLabel(link)} cost changed from ${link.cost} to ${cost}`);
  }

  function toggleLink(linkId: string) {
    const link = links.find((item) => item.id === linkId);

    if (!link) {
      return;
    }

    setLinks((current) =>
      current.map((link) => (link.id === linkId ? { ...link, disabled: !link.disabled } : link))
    );
    setSelected({ type: "link", id: linkId });
    markRouteChanged(`${linkLabel(link)} ${link.disabled ? "enabled" : "disabled"}`);
  }

  function resetTopology() {
    setLinks(initialRoutingLinks.map((link) => ({ ...link })));
    setSourceId("client");
    setDestinationId("server");
    setSelected({ type: "node", id: "client" });
    setPacketKey(0);
    setRecomputeCount(0);
    setChangeRecord(null);
  }

  function applyScenario(scenario: RoutingScenarioId) {
    const nextLinks = scenarioLinks(scenario);

    setLinks(nextLinks);
    setSourceId("client");
    setDestinationId("server");
    setSelected({ type: "node", id: "client" });
    markRouteChanged(scenarioLabel(scenario));
  }

  const controls = (
    <>
      <Button size="sm" onClick={() => setPacketKey((key) => key + 1)} disabled={!route.reachable}>
        <Play className="size-4" />
        Send packet
      </Button>
      <Button size="sm" variant="outline" onClick={resetTopology}>
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </>
  );

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="Routing lab"
        description="Change link costs or fail a link. The lab recomputes the lowest-cost route."
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/15 bg-background/40 p-3">
          <div>
            <p className="text-sm font-semibold">
              {source.label} to {destination.label}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {route.reachable
                ? `${route.path.map((id) => nodeById(id).label).join(" -> ")} · cost ${route.cost}`
                : "no route"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{controls}</div>
        </div>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid min-w-0 gap-4">
            <ExpandableVisualizerPane
              title="Routing topology"
              description={
                route.reachable
                  ? `Selected path cost: ${route.cost}. Disable links or edit costs to force a new route.`
                  : "No enabled path connects the selected endpoints."
              }
              controls={controls}
              size="wide"
              expandedChildren={({ staticOnOpen }) => (
                <RoutingGraph
                  links={links}
                  nodes={initialRoutingNodes}
                  packetKey={packetKey}
                  route={route}
                  selected={selected}
                  destinationId={destinationId}
                  sourceId={sourceId}
                  onSelectLink={(linkId) => setSelected({ type: "link", id: linkId })}
                  onSelectNode={(nodeId) => setSelected({ type: "node", id: nodeId })}
                  staticOnOpen={staticOnOpen}
                  large
                />
              )}
            >
              <RoutingGraph
                links={links}
                nodes={initialRoutingNodes}
                packetKey={packetKey}
                route={route}
                selected={selected}
                destinationId={destinationId}
                sourceId={sourceId}
                onSelectLink={(linkId) => setSelected({ type: "link", id: linkId })}
                onSelectNode={(nodeId) => setSelected({ type: "node", id: nodeId })}
              />
            </ExpandableVisualizerPane>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <RoutingExplanationPanel
                destination={destination}
                links={links}
                nodes={initialRoutingNodes}
                primaryAlternative={primaryAlternative}
                recomputeCount={recomputeCount}
                route={route}
                selected={selected}
                source={source}
              />
              <RouteComparisonPanel
                candidates={candidates}
                changeRecord={changeRecord}
                currentRoute={route}
                nodes={initialRoutingNodes}
              />
            </div>
          </div>

          <div className="grid content-start gap-5">
            <RoutingControlPanel
              destinationId={destinationId}
              links={links}
              nodes={initialRoutingNodes}
              routePath={route.path}
              selected={selected}
              sourceId={sourceId}
              onChangeCost={updateLinkCost}
              onResetTopology={resetTopology}
              onSelectDestination={updateDestination}
              onSelectLink={(linkId) => setSelected({ type: "link", id: linkId })}
              onSelectSource={updateSource}
              onToggleLink={toggleLink}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <RoutingWorkflowPanel activeStep={workflowStep} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <RoutingScenarioPresets onApplyScenario={applyScenario} />
            <RoutingChallengePanel
              destinationId={destinationId}
              route={route}
              sourceId={sourceId}
            />
          </div>
        </div>
      </ToolWorkspace>

      <PracticePrompt prompt="Disable the cheapest link on the route. Which backup path does the packet take next?" />
    </div>
  );
}

function nodeById(id: string) {
  return initialRoutingNodes.find((node) => node.id === id) ?? initialRoutingNodes[0];
}

function linkLabel(link: Pick<RoutingLabLink, "from" | "to">) {
  return `${nodeById(link.from).label}-${nodeById(link.to).label}`;
}

function scenarioLinks(scenario: RoutingScenarioId) {
  const links = initialRoutingLinks.map((link) => ({ ...link }));

  if (scenario === "expensive-r1") {
    return links.map((link) =>
      ["client-r1", "r1-r3"].includes(link.id) ? { ...link, cost: link.cost + 6 } : link
    );
  }

  if (scenario === "link-failure") {
    return links.map((link) => (link.id === "r3-server" ? { ...link, disabled: true } : link));
  }

  if (scenario === "no-route") {
    return links.map((link) =>
      ["client-r1", "client-r2"].includes(link.id) ? { ...link, disabled: true } : link
    );
  }

  return links;
}

function scenarioLabel(scenario: RoutingScenarioId) {
  const labels: Record<RoutingScenarioId, string> = {
    normal: "Normal network restored",
    "expensive-r1": "R1 path made expensive",
    "link-failure": "R3 to Server link disabled",
    "no-route": "Client uplinks disabled"
  };

  return labels[scenario];
}
