"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, Globe2, MonitorSmartphone, Router } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const pathNodes = [
  {
    label: "Device",
    detail: "Creates the request.",
    status: "Sending request",
    icon: MonitorSmartphone
  },
  {
    label: "Router",
    detail: "Chooses the next hop.",
    status: "Forwarding packet",
    icon: Router
  },
  {
    label: "DNS",
    detail: "Finds the server address.",
    status: "Resolving DNS",
    icon: Globe2
  },
  {
    label: "Server",
    detail: "Returns the response.",
    status: "Server responding",
    icon: Database
  }
];

const packetPositions = ["8%", "36%", "64%", "90%"];

export function NetworkPathDiagram() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % pathNodes.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const visibleIndex = selectedIndex ?? activeIndex;
  const activeNode = pathNodes[activeIndex];
  const selectedNode = pathNodes[visibleIndex];

  return (
    <section className="relative min-h-[380px] overflow-hidden rounded-2xl border border-border/15 bg-card/30 p-5 shadow-sm sm:min-h-[430px] sm:p-7">
      <div className="network-grid absolute inset-0 opacity-10" />
      <div className="relative z-10 flex h-full min-h-[330px] flex-col justify-between gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Mini packet lab</p>
            <p className="mt-1 text-xs text-muted-foreground">Click a node to inspect it.</p>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {activeNode.status}
          </div>
        </div>

        <div className="relative flex-1">
          <div className="absolute left-[8%] right-[8%] top-1/2 hidden h-px bg-border/35 sm:block" />
          <div className="absolute left-[8%] right-[8%] top-[calc(50%-18px)] hidden h-9 rounded-full bg-primary/5 sm:block" />
          {!reduceMotion ? (
            <motion.div
              className="absolute top-[calc(50%-14px)] z-20 hidden rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 sm:block"
              animate={{ left: packetPositions }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
            >
              packet
            </motion.div>
          ) : (
            <div
              className="absolute top-[calc(50%-14px)] z-20 hidden rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:block"
              style={{ left: packetPositions[activeIndex] }}
            >
              packet
            </div>
          )}

          <div className="grid h-full gap-3 sm:grid-cols-4 sm:items-center">
            {pathNodes.map((node, index) => {
              const Icon = node.icon;
              const active = index === activeIndex;
              const selected = index === selectedIndex;

              return (
                <button
                  key={node.label}
                  type="button"
                  className={cn(
                    "relative z-10 flex min-h-20 items-center gap-3 rounded-xl border border-border/15 bg-background/55 p-3 text-left transition hover:border-primary/25 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:block sm:min-h-36 sm:p-4",
                    active && "border-primary/35 bg-primary/10",
                    selected && "ring-1 ring-primary/25"
                  )}
                  onClick={() => setSelectedIndex(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary transition",
                      active && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="sm:mt-4">
                    <p className="text-sm font-semibold">{node.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{node.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-secondary/12 p-4">
          <p className="text-xs text-muted-foreground">Node</p>
          <p className="mt-1 text-sm font-medium">
            {selectedNode.label}: {selectedNode.detail}
          </p>
        </div>
      </div>
    </section>
  );
}
