"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Packet Exchange</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border/70 bg-background/70 p-6">
            <div className="network-grid absolute inset-0 opacity-35" />
            <div className="relative z-10 flex h-[330px] items-center justify-between">
              <Node label="Client" subtitle="10.0.0.12" />
              <div className="absolute left-[18%] right-[18%] top-1/2 h-px bg-border" />
              <Node label="Server" subtitle="203.0.113.10" align="right" />
              {step > 0 ? (
                <motion.div
                  key={step}
                  className="absolute top-[calc(50%-18px)] rounded-md border border-primary/50 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-2xl shadow-primary/20"
                  initial={{ left: direction === "client" ? "18%" : "74%", opacity: 0, scale: 0.9 }}
                  animate={{ left: direction === "client" ? "74%" : "18%", opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                >
                  {active.label}
                </motion.div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Handshake Timeline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex flex-wrap gap-2">
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
          <div className="grid gap-3">
            {steps.map((item, index) => (
              <button
                key={item.label}
                className={`rounded-md border p-3 text-left transition-colors ${
                  index === step
                    ? "border-primary/60 bg-primary/12"
                    : "border-border/70 bg-secondary/25 hover:bg-secondary/50"
                }`}
                onClick={() => {
                  setPlaying(false);
                  setStep(index);
                }}
              >
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <div className="grid size-24 place-items-center rounded-lg border border-primary/35 bg-primary/12 shadow-xl shadow-primary/10">
        <div className="size-10 rounded-md bg-primary/85" />
      </div>
      <p className="mt-3 font-semibold">{label}</p>
      <p className="font-mono text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
