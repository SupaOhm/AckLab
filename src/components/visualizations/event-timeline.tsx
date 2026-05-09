import type { NetworkEvent } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  events: NetworkEvent[];
  activePacketId?: string;
  onSelectPacket?: (packetId: string) => void;
}

export function EventTimeline({ events, activePacketId, onSelectPacket }: EventTimelineProps) {
  return (
    <section className="rounded-xl border border-border/15 bg-secondary/10 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">Event timeline</p>
        <span className="text-xs text-muted-foreground">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Network events will appear here as you connect, send data, and close the simulated socket.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {events.map((event) => {
            const active = event.packetId === activePacketId;
            const content = (
              <>
                <span className="font-mono text-xs text-muted-foreground">
                  {event.timestampLabel}
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {event.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {event.description}
                </span>
              </>
            );

            return (
              <li key={event.id}>
                {event.packetId && onSelectPacket ? (
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg border border-transparent bg-background/35 p-3 text-left transition hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "border-primary/30 bg-primary/10"
                    )}
                    onClick={() => onSelectPacket(event.packetId as string)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="rounded-lg bg-background/35 p-3">{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
