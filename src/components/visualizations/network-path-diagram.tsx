"use client";

import { motion } from "framer-motion";
import { Database, Globe2, MonitorSmartphone, Router } from "lucide-react";

const pathNodes = [
  {
    label: "Device",
    detail: "starts request",
    icon: MonitorSmartphone
  },
  {
    label: "Router",
    detail: "forwards packet",
    icon: Router
  },
  {
    label: "DNS",
    detail: "finds address",
    icon: Globe2
  },
  {
    label: "Server",
    detail: "sends response",
    icon: Database
  }
];

export function NetworkPathDiagram() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/15 bg-card/30 p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold">How a request travels</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          Watch data move through the same building blocks you practice in the tools.
        </p>
      </div>
      <div className="relative grid gap-5 sm:grid-cols-4">
        <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-border/30 sm:block" />
        <motion.div
          className="absolute top-[30px] hidden size-2.5 rounded-full bg-primary/70 sm:block"
          animate={{ left: ["9%", "35%", "62%", "88%"] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {pathNodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.label} className="relative z-10 flex items-center gap-3 sm:block">
              <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-primary/15 bg-primary/6 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="sm:mt-4">
                <p className="text-sm font-semibold">{node.label}</p>
                <p className="text-xs leading-5 text-muted-foreground">{node.detail}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground/40">0{index + 1}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
