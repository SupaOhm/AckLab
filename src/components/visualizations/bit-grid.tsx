"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BitGridProps {
  octets: string[];
  cidr?: number;
}

export function BitGrid({ octets, cidr = 32 }: BitGridProps) {
  const bits = octets.join("").split("");

  return (
    <div
      className="grid grid-cols-8 gap-1 sm:grid-cols-16 lg:grid-cols-32"
      aria-label="Binary bit visualization"
    >
      {bits.map((bit, index) => {
        const networkBit = index < cidr;
        return (
          <motion.div
            key={`${index}-${bit}-${cidr}`}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "grid aspect-square min-h-8 place-items-center rounded-md border font-mono text-xs",
              networkBit
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
            )}
          >
            {bit}
          </motion.div>
        );
      })}
    </div>
  );
}
