import { cn } from "@/lib/utils";

interface StepTimelineProps {
  steps: Array<{
    label: string;
    title: string;
    description?: string;
  }>;
  activeIndex: number;
  onSelect?: (index: number) => void;
}

export function StepTimeline({ steps, activeIndex, onSelect }: StepTimelineProps) {
  return (
    <div className="grid gap-3">
      {steps.map((step, index) => (
        <button
          key={`${step.label}-${step.title}`}
          type="button"
          disabled={!onSelect}
          className={cn(
            "group flex gap-3 rounded-lg p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            index === activeIndex ? "bg-primary/10" : "hover:bg-secondary/35"
          )}
          onClick={() => onSelect?.(index)}
        >
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
              index === activeIndex
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground"
            )}
          >
            {index + 1}
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">{step.title}</span>
            {step.description ? (
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {step.description}
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
}
