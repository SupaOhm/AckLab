import type { ProtocolState } from "@/lib/simulation/types";

interface ProtocolStatePanelProps {
  title: string;
  states: ProtocolState[];
}

export function ProtocolStatePanel({ title, states }: ProtocolStatePanelProps) {
  return (
    <section className="rounded-xl border border-border/15 bg-secondary/10 p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-4 space-y-3">
        {states.map((state) => (
          <div key={state.label} className="rounded-lg bg-background/45 p-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs text-muted-foreground">{state.label}</p>
              <p className="font-mono text-sm font-semibold text-primary">{state.value}</p>
            </div>
            {state.description ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{state.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
