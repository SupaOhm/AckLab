"use client";

import { ArrowRight, CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { PrerequisiteChips } from "@/components/curriculum/prerequisite-chips";
import { StatusBadge } from "@/components/curriculum/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getCurriculumAvailability, isModuleAvailable } from "@/lib/curriculum-status";
import { cn } from "@/lib/utils";
import type { CurriculumModule } from "@/types/curriculum";

interface ModuleCardProps {
  module: CurriculumModule;
  compact?: boolean;
  showPrerequisites?: boolean;
}

export function ModuleCard({
  module,
  compact = false,
  showPrerequisites = false
}: ModuleCardProps) {
  const { hydrated, isCompleted } = useLearningProgress();
  const completed = hydrated && isModuleAvailable(module) && isCompleted(module.id);
  const availability = getCurriculumAvailability(module, completed);
  const available = availability === "available" || availability === "completed";
  const planned = availability === "locked" || availability === "comingSoon";
  const ctaLabel =
    availability === "completed"
      ? "Review"
      : availability === "available"
        ? "Open"
        : availability === "locked"
          ? "Preview"
          : "Planned";

  return (
    <Link href={(module.route ?? `/learn/${module.id}`) as Route} className="group block h-full">
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-colors hover:border-primary/25",
          available && "hover:bg-card/90",
          availability === "completed" && "border-emerald-400/20 bg-emerald-400/6",
          availability === "locked" && "border-dashed border-border/30 bg-card/15",
          availability === "comingSoon" && "border-dashed border-border/25 bg-card/10 opacity-80"
        )}
      >
        {planned ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-background/10" />
        ) : null}
        <CardHeader className={compact ? "space-y-3 p-4" : undefined}>
          <div className="flex items-center justify-between gap-3">
            <StatusBadge availability={availability} />
            {availability === "completed" ? (
              <CheckCircle2 className="size-4 text-emerald-300/80" />
            ) : available ? (
              <ArrowRight className="size-4 text-primary/60 transition-transform group-hover:translate-x-1" />
            ) : availability === "locked" ? (
              <LockKeyhole className="size-4 text-muted-foreground/50" />
            ) : (
              <Clock3 className="size-4 text-muted-foreground/50" />
            )}
          </div>
          <CardTitle className={compact ? "text-base" : undefined}>{module.title}</CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-4", compact && "p-4 pt-0")}>
          <p className="text-sm leading-6 text-muted-foreground">{module.shortDescription}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{module.difficulty}</Badge>
            <Badge variant="outline">{module.estimatedTime}</Badge>
            {module.osiLayer ? <Badge variant="outline">L{module.osiLayer}</Badge> : null}
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                availability === "completed" && "border-emerald-400/30 text-emerald-300",
                availability === "available" && "border-primary/25 text-primary",
                planned && "text-muted-foreground"
              )}
            >
              {ctaLabel}
            </Badge>
          </div>
          {showPrerequisites ? <PrerequisiteChips ids={module.prerequisites} /> : null}
        </CardContent>
      </Card>
    </Link>
  );
}
