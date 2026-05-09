import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { PrerequisiteChips } from "@/components/curriculum/prerequisite-chips";
import { StatusBadge } from "@/components/curriculum/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const unlocked = module.status === "unlocked";

  return (
    <Link href={(module.route ?? `/learn/${module.id}`) as Route} className="group block h-full">
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-colors hover:border-primary/25",
          !unlocked && "opacity-70 hover:opacity-90"
        )}
      >
        <CardHeader className={compact ? "space-y-3 p-4" : undefined}>
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={module.status} />
            {unlocked ? (
              <ArrowRight className="size-4 text-primary/60 transition-transform group-hover:translate-x-1" />
            ) : (
              <LockKeyhole className="size-4 text-muted-foreground/50" />
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
          </div>
          {showPrerequisites ? <PrerequisiteChips ids={module.prerequisites} /> : null}
        </CardContent>
      </Card>
    </Link>
  );
}
