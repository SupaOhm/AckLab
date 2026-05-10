"use client";

import { useEffect, useRef } from "react";

import type { NetworkEvent } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

import { tcpTimelineEmptyHint } from "../data/tcp-steps";
import type { TcpPacket } from "../lib/tcp-simulation";

export function TcpPacketInspector({ packet }: { packet: TcpPacket | null }) {
  if (!packet) {
    return (
      <section className="rounded-2xl border border-border/25 bg-card/55 p-4">
        <p className="text-sm font-semibold">Packet inspector</p>
        <p className="mt-2 text-xs text-muted-foreground">Packets appear after Connect.</p>
      </section>
    );
  }

  const fields = [
    ["flags", packet.flags.join(", ")],
    ["seq", String(packet.sequenceNumber)],
    ["ack", String(packet.acknowledgementNumber)],
    ["src port", String(packet.sourcePort)],
    ["dst port", String(packet.destinationPort)],
    ["payload", String(packet.payload?.length ?? 0)]
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-border/25 bg-card/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Packet inspector</p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
          {packet.label}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-secondary/18 px-2.5 py-2">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="mt-1 break-all font-mono text-xs">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TcpTimeline({
  events,
  activePacketId,
  onSelectPacket
}: {
  events: NetworkEvent[];
  activePacketId?: string;
  onSelectPacket: (packetId: string) => void;
}) {
  const scrollRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const timeline = scrollRef.current;
    if (!timeline) {
      return;
    }
    timeline.scrollTo({ left: timeline.scrollWidth, behavior: "smooth" });
  }, [events.length]);

  return (
    <section className="min-w-0 rounded-2xl border border-border/25 bg-card/55 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">Timeline</p>
        <span className="text-xs text-muted-foreground">{events.length} packets</span>
      </div>
      {events.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{tcpTimelineEmptyHint}</p>
      ) : (
        <div className="relative mt-3 min-w-0">
          <ol
            ref={scrollRef}
            className="flex h-[72px] min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 pr-8"
          >
            {events.map((event) => {
              const active = event.packetId === activePacketId;
              return (
                <li key={event.id} className="shrink-0">
                  <button
                    type="button"
                    className={cn(
                      "min-w-24 rounded-xl border border-border/20 bg-secondary/15 px-3 py-2 text-left transition hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "border-primary/30 bg-primary/12"
                    )}
                    onClick={() => event.packetId && onSelectPacket(event.packetId)}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {event.timestampLabel}
                    </span>
                    <span className="mt-1 block text-xs font-medium">
                      {event.title.replace(" sent", "")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/80 to-transparent" />
        </div>
      )}
    </section>
  );
}
