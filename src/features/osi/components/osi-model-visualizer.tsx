"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { ExpandableVisualizerPane } from "@/components/shared/expandable-visualizer-pane";
import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { osiLayers } from "@/data/osi";

export function OsiModelVisualizer() {
  const [selected, setSelected] = useState(osiLayers[0]);
  const [packetIndex, setPacketIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const controls = (
    <>
      <Button size="sm" onClick={() => setPlaying(true)}>
        <Play className="size-4" />
        Traverse
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setPlaying(false);
          setPacketIndex(0);
        }}
      >
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </>
  );

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = window.setInterval(() => {
      setPacketIndex((index) => {
        if (index >= osiLayers.length - 1) {
          setPlaying(false);
          return index;
        }

        return index + 1;
      });
    }, 900);

    return () => window.clearInterval(interval);
  }, [playing]);

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="Layer stack"
        description="Click a layer to see what it adds to the data. Traverse shows a packet moving down the stack."
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          {/* Layer list */}
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">OSI layers</h2>
              <div className="flex gap-2">{controls}</div>
            </div>
            <ExpandableVisualizerPane
              title={`${selected.name} layer`}
              description={selected.summary}
              controls={controls}
              expandedChildren={() => (
                <OsiLayerStack
                  packetIndex={packetIndex}
                  selectedNumber={selected.number}
                  setSelected={setSelected}
                  large
                />
              )}
            >
              <OsiLayerStack
                packetIndex={packetIndex}
                selectedNumber={selected.number}
                setSelected={setSelected}
              />
            </ExpandableVisualizerPane>
          </section>

          {/* Encapsulation view */}
          <section className="space-y-5">
            <h2 className="text-sm font-semibold">Encapsulation view</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Each layer wraps the payload with the information it needs to deliver it.
            </p>
            <div className="grid gap-1.5">
              {["Data", "Segment", "Packet", "Frame", "Bits"].map((unit, index) => (
                <div
                  key={unit}
                  className="rounded-lg bg-secondary/10 p-3"
                  style={{ marginInline: `${index * 8}px` }}
                >
                  <p className="text-sm font-medium">{unit}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {index === 0 ? "application payload" : "adds delivery context"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <ExplanationPanel title={`${selected.name} layer`}>
          <p>{selected.summary}</p>
          <div>
            <p className="font-medium text-foreground">Common examples</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selected.protocols.map((protocol) => (
                <Badge key={protocol} variant="secondary">
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>
        </ExplanationPanel>
        <PracticePrompt prompt="Click Transport, Network, and Data Link. Which layer uses ports, which layer uses IP addresses, and which layer uses frames?" />
      </div>
    </div>
  );
}

function OsiLayerStack({
  packetIndex,
  selectedNumber,
  setSelected,
  large = false
}: {
  packetIndex: number;
  selectedNumber: number;
  setSelected: (layer: (typeof osiLayers)[number]) => void;
  large?: boolean;
}) {
  return (
    <div className={`relative grid gap-1.5 ${large ? "min-h-[500px] content-center" : ""}`}>
      {osiLayers.map((layer, index) => (
        <button
          key={layer.number}
          onClick={() => setSelected(layer)}
          className={`relative overflow-hidden rounded-lg p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            selectedNumber === layer.number
              ? "bg-primary/8 ring-1 ring-primary/15"
              : "bg-secondary/10 hover:bg-secondary/18"
          }`}
        >
          {packetIndex === index ? (
            <motion.div
              layoutId="osi-packet"
              className="absolute right-4 top-1/2 h-4 w-14 -translate-y-1/2 rounded-full bg-accent/80"
            />
          ) : null}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">
                {layer.number}. {layer.name}
              </p>
              <p className="mt-1 max-w-xl text-sm leading-7 text-muted-foreground">
                {layer.summary}
              </p>
            </div>
            <Badge variant="outline">{layer.dataUnit}</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}
