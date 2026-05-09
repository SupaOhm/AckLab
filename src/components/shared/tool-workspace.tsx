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
    <section
      className={cn(
        "rounded-xl border border-border/45 bg-card/45 p-4 shadow-sm shadow-black/5 backdrop-blur sm:p-6",
        className
      )}
    >
      {title || description ? (
        <div className="mb-6 max-w-3xl">
          {title ? <h2 className="text-xl font-semibold tracking-normal">{title}</h2> : null}
          {description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
