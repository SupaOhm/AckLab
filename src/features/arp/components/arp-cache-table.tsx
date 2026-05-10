import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ArpCacheEntry } from "@/features/arp/types";

export function ArpCacheTable({
  entries,
  highlighted = false
}: {
  entries: ArpCacheEntry[];
  highlighted?: boolean;
}) {
  const learned = entries.some((entry) => entry.state === "learned");

  return (
    <section
      className={cn(
        "rounded-xl border border-border/15 bg-background/45 p-4 transition-colors",
        highlighted && "border-primary/35 bg-primary/8"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Host A ARP cache</h3>
        <Badge variant={learned ? "success" : "outline"}>
          {learned ? "new entry learned" : "cache miss"}
        </Badge>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-border/15">
        <div className="grid grid-cols-2 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground">
          <span>IP address</span>
          <span>MAC address</span>
        </div>
        {entries.map((entry) => (
          <div
            key={entry.ipAddress}
            className={cn(
              "grid grid-cols-2 gap-3 px-3 py-3 font-mono text-xs transition-colors",
              entry.state === "learned" && "bg-emerald-400/8"
            )}
          >
            <span>{entry.ipAddress}</span>
            <span className={entry.state === "learned" ? "text-primary" : "text-muted-foreground"}>
              {entry.macAddress}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {learned
          ? "Host A can reuse this mapping for the next local frame."
          : "No usable MAC address yet. Host A must ask with ARP."}
      </p>
    </section>
  );
}
