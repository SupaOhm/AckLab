"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { StepTimeline } from "@/components/visualizations/step-timeline";

const steps = [
  {
    label: "Ready",
    title: "Connection idle",
    description: "The client is ready to request a reliable TCP session."
  },
  {
    label: "SYN",
    title: "Client sends SYN",
    description: "The client proposes an initial sequence number and asks to synchronize state."
  },
  {
    label: "SYN-ACK",
    title: "Server replies SYN-ACK",
    description: "The server acknowledges the client sequence and sends its own sequence number."
  },
  {
    label: "ACK",
    title: "Client sends ACK",
    description: "The client acknowledges the server sequence. The TCP connection is established."
  }
] as const;

export function TcpHandshakeVisualizer() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [playing]);

  const active = steps[step];
  const direction = step === 2 ? "server" : "client";
  const timelineSteps = steps.slice(1);

  return (
    <div className="grid gap-8">
      <ToolWorkspace
        title="Packet exchange"
        description="Play the handshake one packet at a time. The client starts, the server responds, then the client confirms."
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="relative min-h-[430px] overflow-hidden rounded-xl bg-background/38 p-6">
            <div className="network-grid absolute inset-0 opacity-20" />
            <div className="relative z-10 flex h-[340px] items-center justify-between">
              <Node label="Client" subtitle="10.0.0.12" />
              <div className="absolute left-[18%] right-[18%] top-1/2 h-px bg-border/70" />
              <div className="absolute left-[24%] right-[24%] top-[calc(50%+28px)] hidden justify-between text-xs text-muted-foreground sm:flex">
                <span>request connection</span>
                <span>confirm state</span>
              </div>
              <Node label="Server" subtitle="203.0.113.10" align="right" />
              {step > 0 ? (
                <motion.div
                  key={step}
                  className="absolute top-[calc(50%-20px)] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
                  initial={{ left: direction === "client" ? "18%" : "74%", opacity: 0, scale: 0.9 }}
                  animate={{ left: direction === "client" ? "74%" : "18%", opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                >
                  {active.label}
                </motion.div>
              ) : null}
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
              steps={timelineSteps}
              activeIndex={Math.max(step - 1, 0)}
              onSelect={(index) => {
                setPlaying(false);
                setStep(index + 1);
              }}
            />
          </div>
        </div>
      </ToolWorkspace>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <ExplanationPanel title={active.title}>
          <p>{active.description}</p>
          <p>
            TCP uses this exchange so both sides agree that they can send and receive data before
            application payloads begin.
          </p>
        </ExplanationPanel>
        <PracticePrompt prompt="Replay the flow and name which packet proves the server received the first SYN." />
      </div>
    </div>
  );
}

function Node({
  label,
  subtitle,
  align = "left"
}: {
  label: string;
  subtitle: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <div className="grid size-28 place-items-center rounded-xl border border-primary/30 bg-primary/10">
        <div className="size-12 rounded-lg bg-primary/85" />
      </div>
      <p className="mt-3 font-semibold">{label}</p>
      <p className="font-mono text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
