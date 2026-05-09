"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { osiLayers } from "@/data/osi";

export function OsiModelVisualizer() {
  const [selected, setSelected] = useState(osiLayers[0]);
  const [packetIndex, setPacketIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

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
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Layer Stack</CardTitle>
            <div className="flex gap-2">
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-2">
            {osiLayers.map((layer, index) => (
              <button
                key={layer.number}
                onClick={() => setSelected(layer)}
                className={`relative overflow-hidden rounded-md border p-4 text-left transition-colors ${
                  selected.number === layer.number
                    ? "border-primary/60 bg-primary/12"
                    : "border-border/70 bg-secondary/25 hover:bg-secondary/50"
                }`}
              >
                {packetIndex === index ? (
                  <motion.div
                    layoutId="osi-packet"
                    className="absolute right-4 top-1/2 h-5 w-16 -translate-y-1/2 rounded-full bg-accent shadow-lg shadow-accent/20"
                  />
                ) : null}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Layer {layer.number}: {layer.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{layer.summary}</p>
                  </div>
                  <Badge variant="outline">{layer.dataUnit}</Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selected.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <p className="text-sm leading-6 text-muted-foreground">{selected.summary}</p>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Protocols and examples
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.protocols.map((protocol) => (
                <Badge key={protocol} variant="secondary">
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/70 bg-secondary/35 p-4">
            <p className="text-sm font-medium">Encapsulation view</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              As traffic moves down the stack, each layer adds context that helps the next network
              boundary deliver, route, frame, or transmit the payload.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
