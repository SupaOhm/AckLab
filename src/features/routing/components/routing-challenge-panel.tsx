import { CheckCircle2, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

import type { RoutingPathResult } from "../types";

export function RoutingChallengePanel({
  route,
  sourceId,
  destinationId
}: {
  route: RoutingPathResult;
  sourceId: string;
  destinationId: string;
}) {
  const challenges = [
    {
      id: "avoid-r3",
      label: "Make traffic avoid R3",
      complete: route.reachable && !route.path.includes("r3")
    },
    {
      id: "through-r2",
      label: "Make the route go through R2",
      complete: route.reachable && route.path.includes("r2")
    },
    {
      id: "disconnect",
      label: "Disconnect Client from Server",
      complete: sourceId === "client" && destinationId === "server" && !route.reachable
    }
  ];

  return (
    <section className="rounded-2xl border border-border/20 bg-card/45 p-3">
      <p className="text-sm font-semibold">Checkpoint</p>
      <p className="mt-1 text-xs text-muted-foreground">Change costs or links to satisfy one.</p>
      <div className="mt-3 grid gap-1.5">
        {challenges.map((challenge) => {
          const Icon = challenge.complete ? CheckCircle2 : Circle;

          return (
            <div
              key={challenge.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border/20 bg-secondary/12 px-2.5 py-2 text-sm",
                challenge.complete && "border-primary/35 bg-primary/10 text-primary"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{challenge.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
