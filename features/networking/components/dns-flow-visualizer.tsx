"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dnsFlowSteps } from "@/data/dns";

const nodes = ["Browser", "Resolver", "Root", "TLD", "Authoritative", "Answer"];

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

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Recursive DNS Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border/70 bg-background/70 p-6">
            <div className="network-grid absolute inset-0 opacity-35" />
            <div className="relative z-10 grid h-[340px] grid-cols-2 gap-4 md:grid-cols-6">
              {nodes.map((node, index) => (
                <div key={node} className="flex flex-col items-center justify-center gap-3">
                  <div
                    className={`grid size-20 place-items-center rounded-lg border text-center text-xs font-semibold ${
                      index <= step
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-secondary/35 text-muted-foreground"
                    }`}
                  >
                    {node}
                  </div>
                  <div className="hidden h-px w-full bg-border md:block" />
                </div>
              ))}
              <motion.div
                key={step}
                className="absolute top-[46%] size-4 rounded-full bg-accent shadow-xl shadow-accent/30"
                initial={{ left: `${Math.max((step - 1) * 18, 0)}%`, opacity: 0.4 }}
                animate={{ left: `${Math.min(step * 18, 90)}%`, opacity: 1 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Steps</CardTitle>
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
          {dnsFlowSteps.map((item, index) => (
            <button
              key={item.id}
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
        </CardContent>
      </Card>
    </div>
  );
}
