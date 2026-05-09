import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getModules } from "@/data/curriculum";
import type { LearningPath } from "@/types/curriculum";

export function GoalPathSelector({ paths }: { paths: LearningPath[] }) {
  return (
    <section id="goals" className="scroll-mt-24">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Choose by goal</h2>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">
          Different goals use the same fundamentals in different orders.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paths.map((path) => {
          const modules = getModules(path.moduleIds);
          const first = modules.find((module) => module.status === "unlocked") ?? modules[0];

          return (
            <article key={path.id} className="rounded-xl border border-border/20 bg-card/25 p-5">
              <h3 className="text-lg font-semibold">{path.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {path.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {modules.slice(0, 4).map((module) => (
                  <Badge
                    key={module.id}
                    variant={module.status === "unlocked" ? "default" : "outline"}
                  >
                    {module.title}
                  </Badge>
                ))}
              </div>
              {first ? (
                <Button asChild variant="ghost" className="mt-5 px-0 text-primary">
                  <Link href={(first.route ?? `/learn/${first.id}`) as Route}>
                    Start here
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
