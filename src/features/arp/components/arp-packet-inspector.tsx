import { Radio, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArpFrame, ArpStep } from "@/features/arp/types";

export function ArpPacketInspector({ frame, step }: { frame: ArpFrame | null; step: ArpStep }) {
  if (!frame) {
    return (
      <section className="rounded-xl border border-border/15 bg-background/45 p-4">
        <h3 className="text-sm font-semibold">Frame details</h3>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {step.visualMode === "target-match"
            ? "Local decision: Host B compares the ARP target IP with its own IP. No ARP Reply has been sent yet."
            : step.delivery === "cache" || step.delivery === "local"
              ? step.visibleResult
              : "Start the lab to inspect the ARP request and reply."}
        </p>
      </section>
    );
  }

  const fields = [
    ["operation", frame.kind],
    ["delivery", frame.direction],
    ["sender IP", frame.sourceIp],
    ["sender MAC", frame.sourceMac],
    ["target IP", frame.targetIp],
    ["target MAC", frame.targetMac]
  ];

  return (
    <section className="rounded-xl border border-border/15 bg-background/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Frame details</h3>
        <Badge
          variant={frame.direction === "broadcast" ? "default" : "success"}
          className="gap-1.5"
        >
          {frame.direction === "broadcast" ? (
            <Radio className="size-3" />
          ) : (
            <Route className="size-3" />
          )}
          {frame.direction}
        </Badge>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{frame.summary}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-secondary/12 px-2.5 py-2">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="mt-1 break-all font-mono text-xs">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
