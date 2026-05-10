import type { ReactNode } from "react";

interface PracticePromptProps {
  title?: string;
  prompt: string;
  children?: ReactNode;
}

export function PracticePrompt({
  title = "Quick practice",
  prompt,
  children
}: PracticePromptProps) {
  return (
    <section className="rounded-xl border border-dashed border-primary/30 bg-primary/[.05] p-6">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{prompt}</p>
      {children ? <div className="mt-4 flex flex-wrap gap-2">{children}</div> : null}
    </section>
  );
}
