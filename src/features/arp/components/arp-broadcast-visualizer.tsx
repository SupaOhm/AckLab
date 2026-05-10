"use client";

import { ArrowRight, Play, RotateCcw } from "lucide-react";

import { ExpandableVisualizerPane } from "@/components/shared/expandable-visualizer-pane";
import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArpCacheTable } from "@/features/arp/components/arp-cache-table";
import { ArpPacketInspector } from "@/features/arp/components/arp-packet-inspector";
import { ArpStepPanel } from "@/features/arp/components/arp-step-panel";
import { ArpTopology } from "@/features/arp/components/arp-topology";
import { useArpSimulation } from "@/features/arp/hooks/use-arp-simulation";
import type { ArpStep } from "@/features/arp/types";

export function ArpBroadcastVisualizer() {
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
  const controls = (
    <>
      <Button size="sm" onClick={primaryAction} disabled={started && !canGoNext}>
        {started ? <ArrowRight className="size-4" /> : <Play className="size-4" />}
        {primaryLabel}
      </Button>
      <Button size="sm" variant="outline" onClick={reset}>
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </>
  );

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
              <div className="flex flex-wrap gap-2">{controls}</div>
            </div>

            <ExpandableVisualizerPane
              title={activeStep.title}
              description={activeStep.description}
              controls={controls}
              expandedChildren={({ staticOnOpen }) => (
                <ArpTopology
                  frame={activeFrame}
                  hosts={hosts}
                  step={activeStep}
                  className="bg-background/45 p-3 sm:p-4"
                  maxScale={1}
                  staticFrame={staticOnOpen}
                />
              )}
            >
              <ArpTopology frame={activeFrame} hosts={hosts} step={activeStep} />
            </ExpandableVisualizerPane>
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
