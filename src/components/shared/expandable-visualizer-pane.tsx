"use client";

import { Maximize2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandedRenderState {
  staticOnOpen: boolean;
}

interface ExpandableVisualizerPaneProps {
  children: ReactNode;
  title: string;
  description?: string;
  controls?: ReactNode;
  expandedChildren: (state: ExpandedRenderState) => ReactNode;
  className?: string;
  dialogClassName?: string;
  bodyClassName?: string;
  triggerClassName?: string;
  size?: "default" | "wide";
}

export function ExpandableVisualizerPane({
  children,
  title,
  description,
  controls,
  expandedChildren,
  className,
  dialogClassName,
  bodyClassName,
  triggerClassName,
  size = "default"
}: ExpandableVisualizerPaneProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <div className={cn("relative", className)}>
        {children}
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={cn(
            "absolute bottom-3 right-3 z-20 bg-background/75 shadow-lg shadow-black/20 backdrop-blur",
            triggerClassName
          )}
          onClick={() => setOpen(true)}
          aria-label="Expand visualizer"
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>
      {open ? (
        <VisualizerExpandDialog
          title={title}
          description={description}
          controls={controls}
          dialogClassName={dialogClassName}
          bodyClassName={bodyClassName}
          size={size}
          onClose={() => setOpen(false)}
        >
          {(state) => expandedChildren(state)}
        </VisualizerExpandDialog>
      ) : null}
    </>
  );
}

function VisualizerExpandDialog({
  children,
  title,
  description,
  controls,
  dialogClassName,
  bodyClassName,
  size,
  onClose
}: {
  children: (state: ExpandedRenderState) => ReactNode;
  title: string;
  description?: string;
  controls?: ReactNode;
  dialogClassName?: string;
  bodyClassName?: string;
  size: "default" | "wide";
  onClose: () => void;
}) {
  const [staticOnOpen, setStaticOnOpen] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setStaticOnOpen(false));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const widthClass =
    size === "wide"
      ? "w-[calc(100vw-32px)] lg:w-[min(92vw,1200px)]"
      : "w-[calc(100vw-32px)] lg:w-[min(76vw,980px)]";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visualizer-expand-title"
    >
      <section
        className={cn(
          "grid max-h-[min(82vh,760px)] grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card p-4 shadow-2xl shadow-primary/10 ring-1 ring-primary/10 sm:p-5",
          widthClass,
          dialogClassName
        )}
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 id="visualizer-expand-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {controls}
            <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close expanded view">
              <X className="size-4" />
            </Button>
          </div>
        </div>
        <div className={cn("min-h-0 overflow-y-auto overscroll-contain pr-1", bodyClassName)}>
          {children({ staticOnOpen })}
        </div>
      </section>
    </div>
  );
}
