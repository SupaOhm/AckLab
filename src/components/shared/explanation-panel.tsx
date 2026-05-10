import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ExplanationPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ExplanationPanel({ title, children, className }: ExplanationPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/35 bg-secondary/18 p-6 text-sm leading-7 text-muted-foreground",
        className
      )}
    >
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
