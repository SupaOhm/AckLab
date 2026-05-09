import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface LearningPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function LearningPageHeader({
  eyebrow,
  title,
  description,
  children
}: LearningPageHeaderProps) {
  return (
    <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Badge variant="outline" className="bg-background/40">
          {eyebrow}
        </Badge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">{description}</p>
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
