"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { beginnerPath, getModules, goalPaths, labModuleIds } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import type { LearningPath } from "@/types/curriculum";

type ChoiceId = "new" | "basics" | "cyber" | "tools";

interface Choice {
  id: ChoiceId;
  label: string;
  helper: string;
  path: LearningPath;
  ctaHref: string;
  ctaLabel: string;
}

const cyberPath = goalPaths.find((path) => path.id === "cybersecurity") ?? goalPaths[0];
const toolsPath: LearningPath = {
  id: "tools-only",
  title: "Tools-only route",
  shortDescription: "Jump straight into the working labs.",
  moduleIds: labModuleIds.slice(0, 6)
};

const choices: Choice[] = [
  {
    id: "new",
    label: "I'm new to networking",
    helper: "Start with bits, IPs, then routing.",
    path: beginnerPath,
    ctaHref: "/learn/start",
    ctaLabel: "Start first 3 steps"
  },
  {
    id: "basics",
    label: "I know basics",
    helper: "Jump to subnetting and packet paths.",
    path: {
      id: "basics",
      title: "Skip to applied fundamentals",
      shortDescription: "Subnetting, routing, DNS, and TCP labs.",
      moduleIds: ["subnet-visualizer", "routing-visualizer", "dns-flow", "tcp-handshake"]
    },
    ctaHref: "/tools/subnet",
    ctaLabel: "Open subnet lab"
  },
  {
    id: "cyber",
    label: "I want cybersecurity",
    helper: "Begin with TCP, DNS, and ports.",
    path: cyberPath,
    ctaHref: "/visualizers/tcp-handshake",
    ctaLabel: "Open TCP lab"
  },
  {
    id: "tools",
    label: "I want tools only",
    helper: "Skip the path and browse labs.",
    path: toolsPath,
    ctaHref: "/tools",
    ctaLabel: "Browse tools"
  }
];

export function BeginnerOnboardingCard() {
  const [selectedId, setSelectedId] = useState<ChoiceId>("new");
  const selected = choices.find((choice) => choice.id === selectedId) ?? choices[0];
  const modules = getModules(selected.path.moduleIds).slice(0, 4);

  return (
    <section className="rounded-2xl border border-border/20 bg-card/30 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="default">Start here</Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Pick your starting point.</h2>
        </div>
        <Button asChild className="sm:mt-1">
          <Link href={selected.ctaHref as Route}>
            {selected.ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={cn(
              "rounded-xl border border-border/20 bg-background/35 p-4 text-left text-sm transition hover:border-primary/25 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedId === choice.id && "border-primary/35 bg-primary/10"
            )}
            onClick={() => setSelectedId(choice.id)}
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-medium">{choice.label}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {choice.helper}
                </span>
              </span>
              {selectedId === choice.id ? <CheckCircle2 className="size-4 text-primary" /> : null}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4">
        <p className="text-xs text-muted-foreground">Recommended</p>
        <p className="mt-1 text-sm font-semibold">{selected.path.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {selected.path.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {modules.map((module) => (
            <Badge key={module.id} variant={module.status === "unlocked" ? "default" : "outline"}>
              {module.title}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
