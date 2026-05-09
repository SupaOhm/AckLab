import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ToolCard as ToolCardType } from "@/types/platform";

export function ToolCard({ tool }: { tool: ToolCardType }) {
  const live = tool.status === "Live";

  return (
    <Link
      href={tool.href}
      aria-disabled={!live}
      className={!live ? "pointer-events-none" : undefined}
    >
      <Card className="group h-full overflow-hidden transition-colors hover:border-primary/35">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <Badge variant={live ? "success" : "outline"}>{tool.status}</Badge>
            {live ? (
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            ) : (
              <LockKeyhole className="size-4 text-muted-foreground" />
            )}
          </div>
          <CardTitle>{tool.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-muted-foreground">{tool.description}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {tool.category}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
