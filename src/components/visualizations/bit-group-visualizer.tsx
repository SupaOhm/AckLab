"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BitGroupVisualizerProps {
  octets: string[];
  cidr?: number;
  compact?: boolean;
}

export function BitGroupVisualizer({
  octets,
  cidr = 32,
  compact = false
}: BitGroupVisualizerProps) {
  let bitIndex = 0;

  return (
    <div className="space-y-4" aria-label="Grouped binary bit visualization">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          Network prefix
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-300" />
          Host space
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {octets.map((octet, octetIndex) => (
          <div key={`${octetIndex}-${octet}`} className="rounded-lg bg-background/45 p-3">
            <p className="mb-2 text-xs text-muted-foreground">Octet {octetIndex + 1}</p>
            <div className="grid grid-cols-8 gap-1">
              {octet.split("").map((bit, localIndex) => {
                const currentIndex = bitIndex++;
                const networkBit = currentIndex < cidr;
                const boundaryAfter = currentIndex === cidr - 1 && cidr < 32;

                return (
                  <motion.div
                    key={`${currentIndex}-${bit}-${cidr}`}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "relative grid aspect-square place-items-center rounded-md font-mono text-sm",
                      compact && "text-xs",
                      networkBit
                        ? "bg-primary/14 text-primary ring-1 ring-primary/22"
                        : "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/16"
                    )}
                  >
                    {bit}
                    {boundaryAfter && localIndex !== 7 ? (
                      <span className="absolute -right-1.5 top-0 h-full w-px bg-foreground/60" />
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
