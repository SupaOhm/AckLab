"use client";

import { AlertTriangle, Gauge, Network, Unplug } from "lucide-react";

import { Button } from "@/components/ui/button";

export type RoutingScenarioId = "normal" | "expensive-r1" | "link-failure" | "no-route";

const scenarios = [
  {
    id: "normal",
    label: "Normal network",
    icon: Network,
    description: "Restore all links."
  },
  {
    id: "expensive-r1",
    label: "Expensive R1 path",
    icon: Gauge,
    description: "Force traffic toward R2."
  },
  {
    id: "link-failure",
    label: "Link failure",
    icon: Unplug,
    description: "Drop a route link."
  },
  {
    id: "no-route",
    label: "No route challenge",
    icon: AlertTriangle,
    description: "Disconnect the client."
  }
] as const;

export function RoutingScenarioPresets({
  onApplyScenario
}: {
  onApplyScenario: (scenario: RoutingScenarioId) => void;
}) {
  return (
    <section className="rounded-2xl border border-border/20 bg-card/45 p-3">
      <p className="text-sm font-semibold">Preset experiments</p>
      <p className="mt-1 text-xs text-muted-foreground">Try a network condition quickly.</p>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;

          return (
            <Button
              key={scenario.id}
              type="button"
              variant="outline"
              className="h-auto justify-start gap-2 px-2.5 py-2 text-left"
              onClick={() => onApplyScenario(scenario.id)}
            >
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-xs sm:text-sm">{scenario.label}</span>
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {scenario.description}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
