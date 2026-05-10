import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ArpStep } from "@/features/arp/types";

export function ArpStepPanel({
  activeIndex,
  steps,
  onSelect
}: {
  activeIndex: number;
  steps: ArpStep[];
  onSelect: (index: number) => void;
}) {
  return (
    <section className="rounded-xl border border-border/15 bg-background/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Discovery flow</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {activeIndex + 1}/{steps.length}
        </span>
      </div>
      <div className="mt-4 flex gap-1">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Go to ${step.title}`}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              index <= activeIndex && "bg-primary",
              index === activeIndex && "ring-1 ring-primary/30"
            )}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            type="button"
            variant="ghost"
            className={cn(
              "h-auto justify-start gap-3 px-3 py-2 text-left",
              index === activeIndex && "bg-primary/10 text-primary"
            )}
            onClick={() => onSelect(index)}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current font-mono text-[11px]">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="block text-xs font-medium">{step.title}</span>
                <Badge variant={step.delivery === "broadcast" ? "default" : "outline"}>
                  {step.delivery}
                </Badge>
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                {step.visibleResult}
              </span>
            </span>
            {index === activeIndex ? <ArrowRight className="size-3.5 shrink-0" /> : null}
          </Button>
        ))}
      </div>
    </section>
  );
}
