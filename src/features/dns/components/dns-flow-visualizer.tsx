"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

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

  return (
    <div className="grid gap-8">
      <ToolWorkspace
        title="Recursive DNS lookup"
        description="Follow the question from your browser to the server that can answer it."
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="relative min-h-[360px] overflow-hidden rounded-xl bg-background/35 p-6">
            <div className="network-grid absolute inset-0 opacity-18" />
            <div className="relative z-10 grid gap-4 md:grid-cols-6">
              {nodes.map((node, index) => (
                <button
                  key={node}
                  type="button"
                  className={`relative flex min-h-28 flex-col items-center justify-center rounded-xl p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    index === step
                      ? "bg-primary/12 text-primary ring-1 ring-primary/30"
                      : index < step
                        ? "bg-secondary/28 text-foreground"
                        : "bg-secondary/16 text-muted-foreground"
                  }`}
                  onClick={() => {
                    setPlaying(false);
                    setStep(index);
                  }}
                >
                  <span className="mb-3 grid size-7 place-items-center rounded-full border border-current text-xs">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold">{node}</span>
                </button>
              ))}
              <motion.div
                key={step}
                className="absolute top-[calc(50%-7px)] hidden size-3 rounded-full bg-accent shadow-lg shadow-accent/25 md:block"
                initial={{ left: `${Math.max((step - 1) * 17.8 + 8, 8)}%`, opacity: 0.4 }}
                animate={{ left: `${Math.min(step * 17.8 + 8, 92)}%`, opacity: 1 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-background/38 p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              <Button onClick={() => setPlaying((value) => !value)}>
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                {playing ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPlaying(false);
                  setStep(0);
                }}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
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

      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
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
