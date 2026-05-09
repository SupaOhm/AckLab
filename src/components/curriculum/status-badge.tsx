import { LockKeyhole, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CurriculumStatus } from "@/types/curriculum";

export function StatusBadge({ status }: { status: CurriculumStatus }) {
  if (status === "unlocked") {
    return (
      <Badge variant="success" className="gap-1.5">
        <Sparkles className="size-3" />
        Unlocked
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <LockKeyhole className="size-3" />
      Coming soon
    </Badge>
  );
}
