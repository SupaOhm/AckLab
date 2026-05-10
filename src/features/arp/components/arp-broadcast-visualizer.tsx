"use client";

import { ArrowRight, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ArpCacheTable } from "@/features/arp/components/arp-cache-table";
import { ArpPacketInspector } from "@/features/arp/components/arp-packet-inspector";
import { ArpStepPanel } from "@/features/arp/components/arp-step-panel";
import { ArpTopology } from "@/features/arp/components/arp-topology";
import { useArpSimulation } from "@/features/arp/hooks/use-arp-simulation";
import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ArpStep } from "@/features/arp/types";

export function ArpBroadcastVisualizer() {
  const [expandedOpen, setExpandedOpen] = useState(false);
  const {
    activeFrame,
    activeStep,
    cache,
    canGoNext,
    hosts,
    stepIndex,
    steps,
    nextStep,
    reset,
    selectStep,
    start
  } = useArpSimulation();

  const started = stepIndex > 0;
  const primaryAction = started ? nextStep : start;
  const primaryLabel = started ? "Next step" : "Start";

  useEffect(() => {
    if (!expandedOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpandedOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedOpen]);

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="ARP broadcast lab"
        description="Discover the MAC address needed to deliver a frame inside one LAN."
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-w-0 gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/15 bg-background/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={activeFrame?.direction === "broadcast" ? "default" : "outline"}>
                  {activeFrame?.direction ?? activeStep.delivery}
                </Badge>
                <span className="text-sm text-muted-foreground">{activeStep.flowLabel}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={primaryAction} disabled={started && !canGoNext}>
                  {started ? <ArrowRight className="size-4" /> : <Play className="size-4" />}
                  {primaryLabel}
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              </div>
            </div>

            <ArpTopology
              frame={activeFrame}
              hosts={hosts}
              step={activeStep}
              onExpand={() => setExpandedOpen(true)}
            />
          </div>

          <div className="grid content-start gap-4">
            <ArpCacheTable entries={cache} highlighted={activeStep.highlightCache} />
            <ArpPacketInspector frame={activeFrame} step={activeStep} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <ArpTeachingPanel step={activeStep} />
          <ArpStepPanel activeIndex={stepIndex} steps={steps} onSelect={selectStep} />
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <ExplanationPanel title={activeStep.title}>
          <p>{activeStep.description}</p>
          <p>
            {activeFrame
              ? activeFrame.summary
              : "ARP resolves an IPv4 address to the Ethernet MAC address needed on the local network."}
          </p>
        </ExplanationPanel>
        <PracticePrompt prompt="Pause after the broadcast. Which hosts receive the ARP Request, and which host is allowed to reply?" />
      </div>

      {expandedOpen ? (
        <ArpExpandedModal
          activeFrame={activeFrame}
          activeStep={activeStep}
          canGoNext={canGoNext}
          hosts={hosts}
          onClose={() => setExpandedOpen(false)}
          onPrimaryAction={primaryAction}
          onReset={reset}
          primaryLabel={primaryLabel}
          started={started}
        />
      ) : null}
    </div>
  );
}

function ArpExpandedModal({
  activeFrame,
  activeStep,
  canGoNext,
  hosts,
  onClose,
  onPrimaryAction,
  onReset,
  primaryLabel,
  started
}: {
  activeFrame: ReturnType<typeof useArpSimulation>["activeFrame"];
  activeStep: ReturnType<typeof useArpSimulation>["activeStep"];
  canGoNext: boolean;
  hosts: ReturnType<typeof useArpSimulation>["hosts"];
  onClose: () => void;
  onPrimaryAction: () => void;
  onReset: () => void;
  primaryLabel: string;
  started: boolean;
}) {
  const [staticOnOpen, setStaticOnOpen] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setStaticOnOpen(false));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arp-expanded-title"
    >
      <section className="grid max-h-[76vh] w-[min(76vw,980px,calc(100vw-40px))] gap-3 overflow-hidden rounded-2xl border border-border/25 bg-card/95 p-4 shadow-2xl shadow-primary/10 ring-1 ring-primary/10 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={activeFrame?.direction === "broadcast" ? "default" : "outline"}>
                {activeFrame?.direction ?? activeStep.delivery}
              </Badge>
              <h2 id="arp-expanded-title" className="text-lg font-semibold tracking-tight">
                {activeStep.title}
              </h2>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {activeStep.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <Button size="sm" onClick={onPrimaryAction} disabled={started && !canGoNext}>
              {started ? <ArrowRight className="size-4" /> : <Play className="size-4" />}
              {primaryLabel}
            </Button>
            <Button size="sm" variant="outline" onClick={onReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close expanded view">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <ArpTopology
          frame={activeFrame}
          hosts={hosts}
          step={activeStep}
          className="bg-background/45 p-3 sm:p-4"
          maxScale={1}
          staticFrame={staticOnOpen}
        />
      </section>
    </div>
  );
}

function ArpTeachingPanel({ step }: { step: ArpStep }) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/7 p-5 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge variant={step.delivery === "broadcast" ? "default" : "outline"}>
            {step.delivery === "broadcast"
              ? "ARP Request = broadcast"
              : step.delivery === "unicast"
                ? "ARP Reply/data = unicast"
                : "local decision"}
          </Badge>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h3>
        </div>
        <div className="rounded-xl bg-background/45 px-3 py-2 font-mono text-xs text-muted-foreground">
          {step.flowLabel}
        </div>
      </div>

      <p className="mt-4 max-w-[72ch] text-sm leading-7 text-foreground">{step.description}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-background/40 p-4">
          <p className="text-xs font-medium text-primary">Why it matters</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.whyItMatters}</p>
        </div>
        <div className="rounded-xl bg-background/40 p-4">
          <p className="text-xs font-medium text-primary">Visible result</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.visibleResult}</p>
        </div>
      </div>
    </section>
  );
}
