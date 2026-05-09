import type { Packet } from "@/lib/simulation/types";

interface PacketInspectorProps {
  packet: Packet | null;
}

export function PacketInspector({ packet }: PacketInspectorProps) {
  if (!packet) {
    return (
      <section className="rounded-xl border border-border/15 bg-secondary/10 p-5">
        <p className="text-sm font-semibold">Packet inspector</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Trigger a network event to inspect packet headers, payloads, and protocol meaning here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border/15 bg-secondary/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Packet inspector</p>
          <h3 className="mt-2 text-lg font-semibold">{packet.label}</h3>
        </div>
        <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {packet.protocol}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="rounded-lg bg-background/45 p-3">
          <p className="text-xs text-muted-foreground">Path</p>
          <p className="mt-1 font-medium">
            {packet.from} to {packet.to}
          </p>
        </div>
        {packet.headers.map((header) => (
          <div key={header.label} className="rounded-lg bg-background/45 p-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs text-muted-foreground">{header.label}</p>
              <p className="font-mono text-sm text-foreground">{header.value}</p>
            </div>
            {header.description ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{header.description}</p>
            ) : null}
          </div>
        ))}
        {packet.payload ? (
          <div className="rounded-lg bg-background/45 p-3">
            <p className="text-xs text-muted-foreground">Payload</p>
            <p className="mt-1 font-mono text-sm text-foreground">{packet.payload}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
