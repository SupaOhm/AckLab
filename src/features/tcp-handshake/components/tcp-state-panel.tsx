"use client";

import { CheckCircle2, MonitorSmartphone, Server } from "lucide-react";

import { cn } from "@/lib/utils";

import type { TcpConnectionState } from "../lib/tcp-simulation";

export function TcpStatusPill({
  connected,
  animating
}: {
  connected: boolean;
  animating: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {connected ? <CheckCircle2 className="size-3.5" /> : null}
      {animating ? "Packet in flight" : connected ? "Connection established" : "Ready to connect"}
    </span>
  );
}

export function TcpHostNode({
  label,
  address,
  state,
  kind,
  receivedMessage
}: {
  label: string;
  address: string;
  state: TcpConnectionState;
  kind: "client" | "server";
  receivedMessage?: string;
}) {
  const Icon = kind === "client" ? MonitorSmartphone : Server;

  return (
    <div className={kind === "server" ? "relative z-10 text-right" : "relative z-10"}>
      <div className="grid size-32 place-items-center rounded-3xl border border-primary/18 bg-background/70 shadow-lg shadow-black/10 backdrop-blur">
        <div className="grid size-16 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="size-8" />
        </div>
      </div>
      <div className={kind === "server" ? "mt-4 grid justify-items-end" : "mt-4"}>
        <p className="text-sm font-semibold">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{address}</p>
        <TcpStateBadge state={state} />
        {kind === "server" ? (
          <div className="mt-3 max-w-48 rounded-xl bg-secondary/12 px-3 py-2 text-left">
            <p className="text-[11px] text-muted-foreground">Received</p>
            <p className="mt-1 truncate font-mono text-xs">
              {receivedMessage ? `"${receivedMessage}"` : "waiting..."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TcpStateBadge({ state }: { state: TcpConnectionState }) {
  const active = state === "ESTABLISHED";

  return (
    <span
      className={cn(
        "mt-2 inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px]",
        active
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border/30 bg-secondary/12 text-muted-foreground"
      )}
    >
      {state}
    </span>
  );
}
