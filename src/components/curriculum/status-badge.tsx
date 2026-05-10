import { CheckCircle2, Clock3, LockKeyhole, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CurriculumAvailability, CurriculumStatus } from "@/types/curriculum";

interface StatusBadgeProps {
  status?: CurriculumStatus;
  availability?: CurriculumAvailability;
}

export function StatusBadge({ status, availability }: StatusBadgeProps) {
  const resolved = availability ?? (status === "unlocked" ? "available" : "comingSoon");

  if (resolved === "completed") {
    return (
      <Badge variant="success" className="gap-1.5">
        <CheckCircle2 className="size-3" />
        Completed
      </Badge>
    );
  }

  if (resolved === "available") {
    return (
      <Badge variant="success" className="gap-1.5">
        <Sparkles className="size-3" />
        Available
      </Badge>
    );
  }

  if (resolved === "locked") {
    return (
      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
        <LockKeyhole className="size-3" />
        Locked
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <Clock3 className="size-3" />
      Coming soon
    </Badge>
  );
}
