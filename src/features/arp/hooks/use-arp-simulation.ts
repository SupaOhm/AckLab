"use client";

import { useState } from "react";

import { arpFrames, arpHosts, arpSteps } from "@/features/arp/data/arp-steps";
import type { ArpCacheEntry } from "@/features/arp/types";

const initialCache: ArpCacheEntry[] = [
  {
    ipAddress: arpHosts.find((host) => host.id === "host-b")?.ipAddress ?? "192.168.1.25",
    macAddress: "unknown",
    state: "missing"
  }
];

export function useArpSimulation() {
  const [stepIndex, setStepIndex] = useState(0);

  const activeStep = arpSteps[stepIndex];
  const activeFrame = activeStep.frameId
    ? (arpFrames.find((frame) => frame.id === activeStep.frameId) ?? null)
    : null;
  const cache: ArpCacheEntry[] =
    stepIndex >= 5
      ? [
          {
            ipAddress: "192.168.1.25",
            macAddress: "BB:BB:BB:BB:BB:25",
            state: "learned"
          }
        ]
      : initialCache;

  const canGoNext = stepIndex < arpSteps.length - 1;

  function start() {
    setStepIndex(1);
  }

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, arpSteps.length - 1));
  }

  function reset() {
    setStepIndex(0);
  }

  function selectStep(index: number) {
    setStepIndex(Math.min(Math.max(index, 0), arpSteps.length - 1));
  }

  return {
    activeFrame,
    activeStep,
    cache,
    canGoNext,
    hosts: arpHosts,
    stepIndex,
    steps: arpSteps,
    nextStep,
    reset,
    selectStep,
    start
  };
}
