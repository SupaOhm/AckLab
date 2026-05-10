"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Monitor, Radio, Server } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ArpFrame, ArpHost, ArpStep } from "@/features/arp/types";

const canvasWidth = 820;
const canvasHeight = 500;

const hostPlacement: Record<string, { left: number; top: number; width: number }> = {
  "host-a": { left: 28, top: 200, width: 224 },
  switch: { left: 270, top: 198, width: 280 },
  "host-b": { left: 568, top: 52, width: 224 },
  "host-c": { left: 568, top: 346, width: 224 }
};

export function ArpTopology({
  frame,
  hosts,
  step,
  className,
  maxScale = 1.06,
  staticFrame = false
}: {
  frame: ArpFrame | null;
  hosts: ArpHost[];
  step: ArpStep;
  className?: string;
  maxScale?: number;
  staticFrame?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduceMotion = useReducedMotion();
  const broadcastActive = frame?.direction === "broadcast";
  const replyActive = frame?.id === "arp-reply";
  const dataActive = frame?.id === "data-frame";

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    function updateScale() {
      const availableWidth = container?.clientWidth ?? canvasWidth;
      setScale(Math.min(maxScale, availableWidth / canvasWidth));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, [maxScale]);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/15 bg-card/25 p-4 shadow-xl shadow-black/10 sm:p-6",
        className
      )}
    >
      <div className="network-grid absolute inset-0 opacity-10" />
      <div
        ref={containerRef}
        className="relative z-10 w-full"
        style={{ height: canvasHeight * scale }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left"
          }}
        >
          <svg
            className="absolute inset-0 size-full"
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            aria-hidden="true"
          >
            <line
              x1="252"
              y1="250"
              x2="270"
              y2="250"
              className="stroke-border/45"
              strokeWidth="2"
            />
            <line
              x1="550"
              y1="250"
              x2="568"
              y2="106"
              className="stroke-border/45"
              strokeWidth="2"
            />
            <line
              x1="550"
              y1="250"
              x2="568"
              y2="400"
              className="stroke-border/45"
              strokeWidth="2"
            />
            <line
              x1="252"
              y1="250"
              x2="270"
              y2="250"
              className={cn("stroke-primary/0", frame && step.showPacket && "stroke-primary/70")}
              strokeWidth="3"
            />
            <line
              x1="550"
              y1="250"
              x2="568"
              y2="106"
              className={cn(
                "stroke-primary/0",
                step.showPacket &&
                  (broadcastActive || replyActive || dataActive) &&
                  "stroke-primary/70"
              )}
              strokeWidth="3"
            />
            <line
              x1="550"
              y1="250"
              x2="568"
              y2="400"
              className={cn(
                "stroke-primary/0",
                step.showPacket && broadcastActive && "stroke-primary/45"
              )}
              strokeWidth="3"
            />
          </svg>

          {hosts.map((host) => (
            <TopologyNode
              key={host.id}
              host={host}
              active={step.highlightHostIds.includes(host.id)}
              badge={step.hostBadges?.[host.id]}
              dimmed={step.dimHostIds?.includes(host.id) ?? false}
              highlightTargetIp={step.targetIpHighlightHostIds?.includes(host.id) ?? false}
              strongMatch={step.visualMode === "target-match" && host.id === "host-b"}
            />
          ))}
          {frame && step.showPacket ? (
            <FrameAnimation frame={frame} reduceMotion={reduceMotion} staticFrame={staticFrame} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TopologyNode({
  host,
  active,
  badge,
  dimmed,
  highlightTargetIp,
  strongMatch
}: {
  host: ArpHost;
  active: boolean;
  badge?: string;
  dimmed: boolean;
  highlightTargetIp: boolean;
  strongMatch: boolean;
}) {
  const Icon = host.role === "switch" ? Cpu : host.role === "target" ? Server : Monitor;
  const isSwitch = host.role === "switch";
  const placement = hostPlacement[host.id];

  return (
    <div
      className="absolute"
      style={{ left: placement.left, top: placement.top, width: placement.width }}
    >
      <div
        className={cn(
          "rounded-2xl border border-border/20 bg-background/70 p-3 shadow-lg shadow-black/10 backdrop-blur transition-colors",
          isSwitch && "p-4",
          active && "border-primary/35 bg-primary/10 ring-1 ring-primary/20",
          strongMatch &&
            "border-emerald-400/70 bg-emerald-400/10 shadow-emerald-950/20 ring-2 ring-emerald-400/40",
          dimmed && "opacity-45 grayscale"
        )}
      >
        <div className={cn("flex items-start gap-3", isSwitch && "items-center")}>
          <div
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
              isSwitch && "size-12"
            )}
          >
            <Icon className={cn("size-5", isSwitch && "size-6")} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  "text-sm font-semibold leading-5",
                  isSwitch && "whitespace-nowrap text-base"
                )}
              >
                {host.label}
              </p>
              {badge ? (
                <Badge
                  variant={strongMatch ? "success" : "outline"}
                  className={cn("px-1.5 py-0 text-[10px]", isSwitch && "shrink-0")}
                >
                  {badge}
                </Badge>
              ) : null}
            </div>
            <p
              className={cn(
                "mt-1 rounded-md font-mono text-[11px] leading-4 text-muted-foreground",
                highlightTargetIp && "bg-emerald-400/12 px-1.5 py-0.5 text-emerald-300"
              )}
            >
              {host.ipAddress}
            </p>
          </div>
        </div>
        {host.role !== "switch" ? (
          <p className="mt-3 break-all font-mono text-[11px] leading-4 text-muted-foreground">
            {host.macAddress}
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">LAN segment</Badge>
            <Badge variant="secondary">Layer 2 forwarding</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function FrameAnimation({
  frame,
  reduceMotion,
  staticFrame
}: {
  frame: ArpFrame;
  reduceMotion: boolean | null;
  staticFrame: boolean;
}) {
  const points =
    frame.direction === "broadcast"
      ? [
          { left: "258px", top: "184px" },
          { left: "410px", top: "172px" },
          { left: "560px", top: "118px" },
          { left: "560px", top: "390px" }
        ]
      : frame.from === "host-b"
        ? [
            { left: "560px", top: "118px" },
            { left: "410px", top: "172px" },
            { left: "258px", top: "184px" }
          ]
        : [
            { left: "258px", top: "184px" },
            { left: "410px", top: "172px" },
            { left: "560px", top: "118px" }
          ];

  return (
    <>
      {frame.direction === "broadcast" ? (
        <>
          <MovingFrame
            frame={frame}
            points={points.slice(0, 3)}
            reduceMotion={reduceMotion}
            staticFrame={staticFrame}
          />
          <MovingFrame
            frame={frame}
            points={[points[0], points[1], points[3]]}
            reduceMotion={reduceMotion}
            staticFrame={staticFrame}
            variant="copy"
          />
        </>
      ) : (
        <MovingFrame
          frame={frame}
          points={points}
          reduceMotion={reduceMotion}
          staticFrame={staticFrame}
        />
      )}
    </>
  );
}

function MovingFrame({
  frame,
  points,
  reduceMotion,
  staticFrame,
  variant = "main"
}: {
  frame: ArpFrame;
  points: Array<{ left: string; top: string }>;
  reduceMotion: boolean | null;
  staticFrame: boolean;
  variant?: "main" | "copy";
}) {
  const target = points.at(-1) ?? points[0];
  const broadcast = frame.direction === "broadcast";

  return (
    <motion.div
      key={`${frame.id}-${variant}`}
      className={cn(
        "absolute z-40 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold opacity-100 shadow-md backdrop-blur",
        broadcast
          ? "border-primary/35 bg-primary text-primary-foreground shadow-primary/25"
          : "border-emerald-400/35 bg-emerald-400 text-emerald-950 shadow-emerald-950/20"
      )}
      initial={reduceMotion || staticFrame ? target : points[0]}
      animate={target}
      transition={{ duration: reduceMotion || staticFrame ? 0 : 0.9, ease: "easeInOut" }}
    >
      {broadcast ? <Radio className="size-3" /> : null}
      {frame.label}
    </motion.div>
  );
}
