"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { ExpandableVisualizerPane } from "@/components/shared/expandable-visualizer-pane";
import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { StepTimeline } from "@/components/visualizations/step-timeline";
import { dnsFlowSteps } from "@/data/dns";

const nodes = ["Browser", "Resolver", "Root", "TLD", "Authoritative", "Website IP"];

export function DnsFlowVisualizer() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= dnsFlowSteps.length - 1) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [playing]);

  const active = dnsFlowSteps[step];
  const controls = (
    <>
      <Button size="sm" onClick={() => setPlaying((value) => !value)}>
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        {playing ? "Pause" : "Play"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setPlaying(false);
          setStep(0);
        }}
      >
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </>
  );

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="Recursive DNS lookup"
        description="Follow the question from your browser to the server that can answer it."
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          <ExpandableVisualizerPane
            title={active.title}
            description={active.description}
            controls={controls}
            expandedChildren={({ staticOnOpen }) => (
              <DnsCanvas step={step} onSelectStep={setStep} staticOnOpen={staticOnOpen} large />
            )}
          >
            <DnsCanvas step={step} onSelectStep={setStep} />
          </ExpandableVisualizerPane>

          {/* Controls + step timeline */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">{controls}</div>
            <StepTimeline
              steps={dnsFlowSteps.map((item) => ({
                label: item.id,
                title: item.title,
                description: item.description
              }))}
              activeIndex={step}
              onSelect={(index) => {
                setPlaying(false);
                setStep(index);
              }}
            />
          </div>
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <ExplanationPanel title={active.title}>
          <p>{active.description}</p>
          <p>
            DNS is a chain of referrals. Most servers do not know the final answer, but they know
            which server should be asked next.
          </p>
        </ExplanationPanel>
        <PracticePrompt prompt="Pause on the TLD step. What does the TLD server return: the website IP, or the authoritative nameserver to ask next?" />
      </div>
    </div>
  );
}

function DnsCanvas({
  step,
  onSelectStep,
  staticOnOpen = false,
  large = false
}: {
  step: number;
  onSelectStep: (step: number) => void;
  staticOnOpen?: boolean;
  large?: boolean;
}) {
  const target = `${Math.min(step * 17.8 + 8, 92)}%`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-secondary/8 p-6 ${large ? "min-h-[460px]" : "min-h-[320px]"}`}
    >
      <div className="network-grid absolute inset-0 opacity-10" />
      <div className="relative z-10 grid gap-3 md:grid-cols-6">
        {nodes.map((node, index) => (
          <button
            key={node}
            type="button"
            className={`relative flex min-h-24 flex-col items-center justify-center rounded-xl p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              index === step
                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                : index < step
                  ? "bg-secondary/15 text-foreground"
                  : "bg-secondary/8 text-muted-foreground"
            }`}
            onClick={() => onSelectStep(index)}
          >
            <span className="mb-2.5 grid size-6 place-items-center rounded-full border border-current text-[11px]">
              {index + 1}
            </span>
            <span className="text-xs font-semibold">{node}</span>
          </button>
        ))}
        <motion.div
          key={step}
          className="absolute top-[calc(50%-5px)] hidden size-2.5 rounded-full bg-accent/80 md:block"
          initial={
            staticOnOpen
              ? { left: target, opacity: 1 }
              : { left: `${Math.max((step - 1) * 17.8 + 8, 8)}%`, opacity: 0.4 }
          }
          animate={{ left: target, opacity: 1 }}
          transition={{ duration: staticOnOpen ? 0 : 0.65, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
