import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  "Choose endpoints",
  "Inspect path",
  "Change network",
  "Recalculate",
  "Explain result"
];

export function RoutingWorkflowPanel({ activeStep }: { activeStep: number }) {
  return (
    <section className="rounded-2xl border border-border/20 bg-card/45 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">Lab flow</p>
        <Badge variant="outline">routing response</Badge>
      </div>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-5">
        {steps.map((step, index) => {
          const active = index <= activeStep;

          return (
            <div
              key={step}
              className={cn(
                "rounded-lg border border-border/15 bg-secondary/10 px-2.5 py-2",
                active && "border-primary/30 bg-primary/10"
              )}
            >
              <p className={cn("text-xs", active ? "text-primary" : "text-muted-foreground")}>
                {index + 1}
              </p>
              <p className="mt-0.5 text-xs font-medium sm:text-sm">{step}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
