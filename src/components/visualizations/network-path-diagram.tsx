"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, Globe2, MonitorSmartphone, Router } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const labNodes = [
  {
    label: "Device",
    hint: "10.0.0.24",
    detail: "Your device creates a packet.",
    summary: "Device starts the request.",
    icon: MonitorSmartphone,
    x: 16,
    y: 54
  },
  {
    label: "Router",
    hint: "gw.local",
    detail: "The router chooses the next hop.",
    summary: "Router forwards the packet.",
    icon: Router,
    x: 41,
    y: 32
  },
  {
    label: "DNS",
    hint: "1.1.1.1",
    detail: "DNS finds the server address.",
    summary: "DNS resolves the address.",
    icon: Globe2,
    x: 64,
    y: 56
  },
  {
    label: "Server",
    hint: "acklab.dev",
    detail: "The server sends a response.",
    summary: "Server sends a response.",
    icon: Database,
    x: 88,
    y: 34
  }
];

const packetLabels = ["SYN", "DNS?", "HTTP?", "RESPONSE"];
const packetX = labNodes.map((node) => node.x);
const packetY = labNodes.map((node) => node.y);

export function NetworkPathDiagram() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % labNodes.length);
    }, 1350);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const activeNode = labNodes[activeIndex];
  const selectedNode = labNodes[selectedIndex];
  const packetLabel = packetLabels[activeIndex];

  return (
    <section className="relative min-h-[430px] overflow-hidden rounded-3xl border border-border/20 bg-card/35 p-4 shadow-2xl shadow-black/20 sm:min-h-[500px] sm:p-5">
      <div className="network-grid absolute inset-0 opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,hsl(var(--primary)/0.12),transparent_34%),radial-gradient(circle_at_18%_78%,hsl(var(--primary)/0.08),transparent_30%)]" />

      <div className="relative z-10 flex h-full min-h-[390px] flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/15 bg-background/45 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-sm font-semibold">Live network path</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              Device - Router - DNS - Server
            </p>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            {packetLabel}
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_178px]">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/10 bg-background/30">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 76" aria-hidden="true">
              <defs>
                <marker
                  id="route-arrow"
                  markerHeight="5"
                  markerWidth="5"
                  orient="auto"
                  refX="4"
                  refY="2.5"
                >
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" />
                </marker>
                <filter id="hero-packet-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {labNodes.slice(0, -1).map((node, index) => {
                const next = labNodes[index + 1];
                const activeSegment = index === Math.max(activeIndex - 1, 0);

                return (
                  <g key={`${node.label}-${next.label}`} className="text-primary">
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={next.x}
                      y2={next.y}
                      stroke="currentColor"
                      strokeWidth="0.45"
                      strokeOpacity="0.22"
                      markerEnd="url(#route-arrow)"
                    />
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={next.x}
                      y2={next.y}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeOpacity={activeSegment ? "0.75" : "0"}
                    />
                  </g>
                );
              })}

              {!reduceMotion ? (
                <>
                  <motion.circle
                    r="2.4"
                    fill="currentColor"
                    className="text-primary/20"
                    animate={{ cx: packetX, cy: packetY, opacity: [0, 0.55, 0.12] }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    r="2"
                    fill="currentColor"
                    filter="url(#hero-packet-glow)"
                    className="text-primary"
                    animate={{ cx: packetX, cy: packetY }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              ) : (
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r="2"
                  fill="currentColor"
                  className="text-primary"
                />
              )}
            </svg>

            {!reduceMotion ? (
              <motion.div
                className="absolute z-20 rounded-full border border-primary/25 bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground shadow-sm shadow-primary/20"
                animate={{
                  left: packetX.map((x) => `${x}%`),
                  top: packetY.map((y) => `${y}%`)
                }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translate(-50%, -150%)" }}
              >
                {packetLabel}
              </motion.div>
            ) : (
              <div
                className="absolute z-20 rounded-full border border-primary/25 bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground"
                style={{
                  left: `${activeNode.x}%`,
                  top: `${activeNode.y}%`,
                  transform: "translate(-50%, -150%)"
                }}
              >
                {packetLabel}
              </div>
            )}

            {labNodes.map((node, index) => {
              const Icon = node.icon;
              const active = index === activeIndex;
              const selected = index === selectedIndex;

              return (
                <button
                  key={node.label}
                  type="button"
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelectedIndex(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <motion.span
                    className={cn(
                      "grid size-16 place-items-center rounded-2xl border bg-background/75 text-primary shadow-lg shadow-black/10 backdrop-blur transition-colors",
                      active ? "border-primary/35 bg-primary/12" : "border-border/20",
                      selected && "ring-1 ring-primary/30"
                    )}
                    animate={
                      active && !reduceMotion
                        ? { scale: [1, 1.045, 1], opacity: [1, 0.92, 1] }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: 1.35, repeat: active && !reduceMotion ? Infinity : 0 }}
                  >
                    <Icon className="size-7" />
                  </motion.span>
                  <span className="mt-2 block min-w-24">
                    <span className="block text-sm font-semibold text-foreground">
                      {node.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                      {node.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3">
            <InfoPanel label="Current event" value={selectedNode.summary} />
            <div className="rounded-2xl border border-border/15 bg-background/45 p-3">
              <p className="text-xs text-muted-foreground">Packet fields</p>
              <div className="mt-3 grid gap-2 font-mono text-[11px]">
                <Field label="type" value={packetLabel} />
                <Field label="from" value={labNodes[Math.max(activeIndex - 1, 0)].label} />
                <Field label="to" value={activeNode.label} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border/15 bg-background/45 p-2">
          {packetLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={cn(
                "rounded-xl px-2 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                index === activeIndex ? "bg-primary/12 text-primary" : "text-muted-foreground"
              )}
              onClick={() => {
                setActiveIndex(index);
                setSelectedIndex(index);
              }}
            >
              <span className="block font-mono text-[11px]">{label}</span>
              <span className="mt-1 block text-[10px]">{labNodes[index].label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/15 bg-background/45 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium leading-5">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary/12 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
