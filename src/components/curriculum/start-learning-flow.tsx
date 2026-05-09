"use client";

import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { StatusBadge } from "@/components/curriculum/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getModules } from "@/data/curriculum";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/utils";

const startModuleIds = ["binary-converter", "subnet-visualizer", "routing-basics"];

export function StartLearningFlow() {
  const modules = getModules(startModuleIds);
  const { hydrated, isCompleted, toggleCompleted } = useLearningProgress();
  const unlockedModules = modules.filter((module) => module.status === "unlocked");
  const completedCount = unlockedModules.filter((module) => isCompleted(module.id)).length;
  const progressPercent =
    unlockedModules.length > 0 ? Math.round((completedCount / unlockedModules.length) * 100) : 0;
  const nextModule =
    unlockedModules.find((module) => !isCompleted(module.id)) ??
    modules.find((module) => module.status !== "unlocked");

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border/20 bg-card/25 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="default">Beginner route</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {completedCount === unlockedModules.length
                ? "Unlocked steps complete."
                : "Start here."}
            </h2>
          </div>
          {nextModule ? (
            <Button asChild>
              <Link href={(nextModule.route ?? `/learn/${nextModule.id}`) as Route}>
                {nextModule.status === "unlocked" ? "Continue" : "See what comes next"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>
              {completedCount}/{unlockedModules.length} unlocked complete
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-secondary/40">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {modules.map((module, index) => {
          const unlocked = module.status === "unlocked";
          const completed = hydrated && isCompleted(module.id);
          const current = unlocked && !completed;

          return (
            <article
              key={module.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-border/20 bg-card/25 p-4 transition-colors sm:p-5",
                completed && "border-emerald-400/20 bg-emerald-400/8",
                current && "border-primary/30 bg-primary/6",
                !unlocked && "border-dashed opacity-70"
              )}
            >
              <div className="grid gap-5 md:grid-cols-[88px_1fr_auto] md:items-center">
                <div className="flex items-center gap-3 md:block">
                  <div
                    className={cn(
                      "grid size-12 place-items-center rounded-xl font-mono text-sm",
                      completed
                        ? "bg-emerald-400/12 text-emerald-300"
                        : unlocked
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/30 text-muted-foreground"
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </div>
                  <div className="h-px flex-1 bg-border/30 md:mx-auto md:mt-3 md:h-12 md:w-px" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={module.status} />
                    {completed ? (
                      <Badge variant="success">Done</Badge>
                    ) : current ? (
                      <Badge variant="default">Next</Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">{module.title}</h2>
                  <p className="mt-1 max-w-[60ch] text-sm leading-6 text-muted-foreground">
                    {module.shortDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                  {unlocked ? (
                    <>
                      <Button asChild>
                        <Link href={(module.route ?? `/learn/${module.id}`) as Route}>
                          {completed ? "Review lab" : "Open lab"}
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant={completed ? "secondary" : "outline"}
                        onClick={() => toggleCompleted(module.id)}
                      >
                        {completed ? "Completed" : "Mark completed"}
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="outline">
                      <Link href={(module.route ?? `/learn/${module.id}`) as Route}>
                        <LockKeyhole className="size-4" />
                        Coming soon
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
