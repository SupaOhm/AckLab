import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ModuleCard } from "@/components/curriculum/module-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getModules } from "@/data/curriculum";
import type { LearningPath } from "@/types/curriculum";

export function LearningPathCard({ path }: { path: LearningPath }) {
  const modules = getModules(path.moduleIds);
  const firstUnlocked = modules.find((module) => module.status === "unlocked");

  return (
    <section className="rounded-xl border border-border/20 bg-card/25 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <Badge variant="default">Guided path</Badge>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">{path.title}</h2>
          <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground">
            {path.shortDescription}
          </p>
        </div>
        {firstUnlocked ? (
          <Button asChild>
            <Link href={(firstUnlocked.route ?? `/learn/${firstUnlocked.id}`) as Route}>
              Start
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {modules.slice(0, 8).map((module) => (
          <ModuleCard key={module.id} module={module} compact />
        ))}
      </div>
    </section>
  );
}
