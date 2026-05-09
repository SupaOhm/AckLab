import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ToolWorkspace({ title, description, children, className }: ToolWorkspaceProps) {
  return (
    <section className={cn("rounded-xl border border-border/20 bg-card/30 p-5 sm:p-8", className)}>
      {title || description ? (
        <div className="mb-8 max-w-2xl">
          {title ? <h2 className="text-lg font-semibold tracking-tight">{title}</h2> : null}
          {description ? (
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
