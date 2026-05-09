"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  MonitorSmartphone,
  RotateCcw,
  Send,
  Server,
  Unplug,
  Wifi
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NetworkEvent } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

import {
  createPacketEvent,
  createTcpPacket,
  tcpNodes,
  type TcpConnectionState,
  type TcpPacket
} from "../lib/tcp-simulation";

const initialClientSequence = 1200;
const initialServerSequence = 8400;
const clientPort = 53142;
const serverPort = 443;
const packetDelay = 780;
const reducedMotionDelay = 90;

interface SequenceState {
  client: number;
  server: number;
}

interface PacketSequenceOptions {
  onPacketStart?: (packet: TcpPacket, index: number) => void;
  onPacketComplete?: (packet: TcpPacket, index: number) => void;
  onComplete?: () => void;
}

export function TcpHandshakeVisualizer() {
  const reduceMotion = useReducedMotion();
  const [clientState, setClientState] = useState<TcpConnectionState>("CLOSED");
  const [serverState, setServerState] = useState<TcpConnectionState>("LISTEN");
  const [packets, setPackets] = useState<TcpPacket[]>([]);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [selectedPacketId, setSelectedPacketId] = useState<string>();
  const [activePacketId, setActivePacketId] = useState<string>();
  const [message, setMessage] = useState("hello acklab");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [sequence, setSequence] = useState<SequenceState>({
    client: initialClientSequence,
    server: initialServerSequence
  });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;

    return () => clearPacketTimers(activeTimers);
  }, []);

  const selectedPacket =
    packets.find((packet) => packet.id === selectedPacketId) ?? packets.at(-1) ?? null;
  const currentActivePacket = packets.find((packet) => packet.id === activePacketId);
  const displayedPacket =
    (isAnimating ? currentActivePacket : (selectedPacket ?? currentActivePacket)) ?? null;
  const activePacket = currentActivePacket ?? selectedPacket ?? undefined;
  const connected = clientState === "ESTABLISHED" && serverState === "ESTABLISHED";
  const canConnect = clientState === "CLOSED" && serverState === "LISTEN" && !isAnimating;
  const canSend = connected && message.trim().length > 0 && !isAnimating;
  const canClose = connected && !isAnimating;

  function clearPacketTimers(timerIds: number[]) {
    timerIds.forEach((timer) => window.clearTimeout(timer));
    timerIds.length = 0;
  }

  function revealPacket(packet: TcpPacket) {
    setPackets((current) => [...current, packet]);
    setEvents((current) => [...current, createPacketEvent(packet, current.length + 1)]);
    setActivePacketId(packet.id);
    setSelectedPacketId(packet.id);
  }

  function runPacketSequence(packetBatch: TcpPacket[], options: PacketSequenceOptions = {}) {
    setIsAnimating(true);

    clearPacketTimers(timers.current);

    const delay = reduceMotion ? reducedMotionDelay : packetDelay;
    const travelDelay = reduceMotion ? 0 : packetDelay;

    packetBatch.forEach((packet, index) => {
      const timer = window.setTimeout(() => {
        options.onPacketStart?.(packet, index);
        revealPacket(packet);
      }, index * delay);
      timers.current.push(timer);

      const completeTimer = window.setTimeout(
        () => {
          options.onPacketComplete?.(packet, index);
        },
        index * delay + travelDelay
      );
      timers.current.push(completeTimer);
    });

    const doneTimer = window.setTimeout(
      () => {
        options.onComplete?.();
        setIsAnimating(false);
      },
      Math.max(packetBatch.length - 1, 0) * delay + travelDelay
    );
    timers.current.push(doneTimer);
  }

  function nextPacketId(offset = 1) {
    return `tcp-${packets.length + offset}`;
  }

  function handleConnect() {
    if (!canConnect) {
      return;
    }

    setClientState("SYN-SENT");
    const syn = createTcpPacket({
      id: nextPacketId(1),
      label: "SYN",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["SYN"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: 0,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client asks to open a TCP connection."
    });
    const synAck = createTcpPacket({
      id: nextPacketId(2),
      label: "SYN-ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["SYN", "ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + 1,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation: "The server accepts and sends its own sequence number."
    });
    const ack = createTcpPacket({
      id: nextPacketId(3),
      label: "ACK",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["ACK"],
      sequenceNumber: sequence.client + 1,
      acknowledgementNumber: sequence.server + 1,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client confirms the server sequence. The socket is open."
    });

    runPacketSequence([syn, synAck, ack], {
      onPacketStart: (_packet, index) => {
        if (index === 1) {
          setServerState("SYN-RECEIVED");
        }

        if (index === 2) {
          setClientState("ESTABLISHED");
        }
      },
      onComplete: () => {
        setClientState("ESTABLISHED");
        setServerState("ESTABLISHED");
        setSequence({ client: sequence.client + 1, server: sequence.server + 1 });
      }
    });
  }

  function handleSendMessage() {
    if (!canSend) {
      return;
    }

    const payload = message.trim();
    const payloadLength = payload.length;
    const dataPacket = createTcpPacket({
      id: nextPacketId(1),
      label: "DATA",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["PSH", "ACK"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: sequence.server,
      sourcePort: clientPort,
      destinationPort: serverPort,
      payload,
      explanation: "The client sends application bytes to the server."
    });
    const acknowledgement = createTcpPacket({
      id: nextPacketId(2),
      label: "ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + payloadLength,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation: "The server confirms it received the payload bytes."
    });

    runPacketSequence([dataPacket, acknowledgement], {
      onPacketComplete: (_packet, index) => {
        if (index === 0) {
          setReceivedMessage(payload);
        }
      },
      onComplete: () => {
        setSequence({ client: sequence.client + payloadLength, server: sequence.server });
      }
    });
  }

  function handleCloseConnection() {
    if (!canClose) {
      return;
    }

    setClientState("FIN-WAIT");
    const fin = createTcpPacket({
      id: nextPacketId(1),
      label: "FIN",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["FIN", "ACK"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: sequence.server,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client asks to close its side of the connection."
    });
    const ack = createTcpPacket({
      id: nextPacketId(2),
      label: "ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + 1,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation: "The server acknowledges the close request."
    });
    const serverFin = createTcpPacket({
      id: nextPacketId(3),
      label: "FIN",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["FIN", "ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + 1,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation: "The server closes its side of the connection."
    });
    const finalAck = createTcpPacket({
      id: nextPacketId(4),
      label: "ACK",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["ACK"],
      sequenceNumber: sequence.client + 1,
      acknowledgementNumber: sequence.server + 1,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client confirms the server FIN. The socket returns to idle."
    });

    runPacketSequence([fin, ack, serverFin, finalAck], {
      onPacketStart: (_packet, index) => {
        if (index === 1) {
          setServerState("CLOSE-WAIT");
        }
      },
      onComplete: () => {
        setClientState("CLOSED");
        setServerState("LISTEN");
        setSequence({ client: sequence.client + 1, server: sequence.server + 1 });
      }
    });
  }

  function handleReset() {
    clearPacketTimers(timers.current);
    setClientState("CLOSED");
    setServerState("LISTEN");
    setPackets([]);
    setEvents([]);
    setSelectedPacketId(undefined);
    setActivePacketId(undefined);
    setReceivedMessage("");
    setIsAnimating(false);
    setSequence({ client: initialClientSequence, server: initialServerSequence });
  }

  return (
    <div className="grid gap-8">
      <ToolWorkspace
        title="TCP socket lab"
        description="Control the client. Watch connection state, packets, and acknowledgements change."
      >
        <div className="grid min-w-0 gap-5">
          <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border/15 bg-background/35 p-3 lg:flex-row lg:items-end">
            <div className="grid min-w-0 flex-1 gap-2">
              <Label htmlFor="tcp-message">Message</Label>
              <Input
                id="tcp-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!connected}
                placeholder="Type a message"
              />
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <Button
                className="min-w-24 flex-1 sm:flex-none"
                size="sm"
                onClick={handleConnect}
                disabled={!canConnect}
              >
                <Wifi className="size-4" />
                Connect
              </Button>
              <Button
                className="min-w-32 flex-1 sm:flex-none"
                size="sm"
                onClick={handleSendMessage}
                disabled={!canSend}
              >
                <Send className="size-4" />
                Send message
              </Button>
              <Button
                className="min-w-20 flex-1 sm:flex-none"
                size="sm"
                variant="outline"
                onClick={handleCloseConnection}
                disabled={!canClose}
              >
                <Unplug className="size-4" />
                Close
              </Button>
              <Button
                className="min-w-20 flex-1 sm:flex-none"
                size="sm"
                variant="ghost"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </section>

          <section className="relative min-w-0 overflow-hidden rounded-3xl border border-border/15 bg-card/25 p-3 shadow-xl shadow-black/10 sm:p-6">
            <div className="network-grid absolute inset-0 opacity-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,hsl(var(--primary)/0.08),transparent_32%),radial-gradient(circle_at_82%_45%,hsl(var(--primary)/0.08),transparent_30%)]" />
            <div className="relative z-10 grid min-h-[500px] min-w-0 grid-rows-[auto_1fr_auto] gap-4 sm:gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusPill connected={connected} animating={isAnimating} />
                <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>client seq {sequence.client}</span>
                  <span>server seq {sequence.server}</span>
                </div>
              </div>

              <div className="relative min-w-0 overflow-hidden rounded-2xl border border-border/10 bg-background/35 p-3 sm:p-5">
                <div className="absolute left-[17%] right-[17%] top-1/2 h-px bg-border/45" />
                <div className="absolute left-[17%] right-[17%] top-[calc(50%-20px)] h-10 rounded-full bg-primary/5" />
                <div className="relative flex min-h-[320px] min-w-0 items-center justify-between gap-4">
                  <HostNode
                    label="Client"
                    address={tcpNodes[0].address}
                    state={clientState}
                    kind="client"
                  />
                  <HostNode
                    label="Server"
                    address={tcpNodes[1].address}
                    state={serverState}
                    kind="server"
                    receivedMessage={receivedMessage}
                  />
                  {activePacket ? (
                    <AnimatedPacket
                      key={activePacket.id}
                      packet={activePacket}
                      reduceMotion={reduceMotion}
                    />
                  ) : null}
                </div>
              </div>

              <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
                <CompactTimeline
                  events={events}
                  activePacketId={displayedPacket?.id}
                  onSelectPacket={setSelectedPacketId}
                />
                <TcpPacketInspector packet={displayedPacket} />
              </div>
            </div>
          </section>
        </div>
      </ToolWorkspace>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <ExplanationPanel title={displayedPacket ? displayedPacket.label : "Start"}>
          <p>
            {displayedPacket
              ? displayedPacket.explanation
              : "Click Connect to create SYN, SYN-ACK, and ACK packets."}
          </p>
        </ExplanationPanel>
        <PracticePrompt prompt="Connect, send a short message, then inspect how ACK changes." />
      </div>
    </div>
  );
}

function AnimatedPacket({
  packet,
  reduceMotion
}: {
  packet: TcpPacket;
  reduceMotion: boolean | null;
}) {
  const outbound = packet.direction === "outbound";
  const start = outbound ? "18%" : "74%";
  const end = outbound ? "74%" : "18%";

  return (
    <motion.div
      className="absolute top-[calc(50%-20px)] z-30 rounded-full border border-primary/25 bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20"
      initial={reduceMotion ? { left: end, opacity: 1 } : { left: start, opacity: 0, scale: 0.92 }}
      animate={{ left: end, opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.72, ease: "easeInOut" }}
    >
      {packet.label}
    </motion.div>
  );
}

function HostNode({
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
        <StateBadge state={state} />
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

function StateBadge({ state }: { state: TcpConnectionState }) {
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

function StatusPill({ connected, animating }: { connected: boolean; animating: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {connected ? <CheckCircle2 className="size-3.5" /> : null}
      {animating ? "Packet in flight" : connected ? "Connection established" : "Ready to connect"}
    </span>
  );
}

function TcpPacketInspector({ packet }: { packet: TcpPacket | null }) {
  if (!packet) {
    return (
      <section className="rounded-2xl border border-border/15 bg-background/45 p-4">
        <p className="text-sm font-semibold">Packet inspector</p>
        <p className="mt-2 text-xs text-muted-foreground">Packets appear after Connect.</p>
      </section>
    );
  }

  const fields = [
    ["flags", packet.flags.join(", ")],
    ["seq", String(packet.sequenceNumber)],
    ["ack", String(packet.acknowledgementNumber)],
    ["src port", String(packet.sourcePort)],
    ["dst port", String(packet.destinationPort)],
    ["payload", String(packet.payload?.length ?? 0)]
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-border/15 bg-background/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Packet inspector</p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
          {packet.label}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-secondary/12 px-2.5 py-2">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="mt-1 break-all font-mono text-xs">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompactTimeline({
  events,
  activePacketId,
  onSelectPacket
}: {
  events: NetworkEvent[];
  activePacketId?: string;
  onSelectPacket: (packetId: string) => void;
}) {
  const scrollRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const timeline = scrollRef.current;

    if (!timeline) {
      return;
    }

    timeline.scrollTo({ left: timeline.scrollWidth, behavior: "smooth" });
  }, [events.length]);

  return (
    <section className="min-w-0 rounded-2xl border border-border/15 bg-background/45 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">Timeline</p>
        <span className="text-xs text-muted-foreground">{events.length} packets</span>
      </div>
      {events.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">SYN - SYN-ACK - ACK will appear here.</p>
      ) : (
        <div className="relative mt-3 min-w-0">
          <ol
            ref={scrollRef}
            className="flex h-[72px] min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 pr-8"
          >
            {events.map((event) => {
              const active = event.packetId === activePacketId;
              return (
                <li key={event.id} className="shrink-0">
                  <button
                    type="button"
                    className={cn(
                      "min-w-24 rounded-xl border border-border/10 bg-secondary/10 px-3 py-2 text-left transition hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "border-primary/30 bg-primary/10"
                    )}
                    onClick={() => event.packetId && onSelectPacket(event.packetId)}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {event.timestampLabel}
                    </span>
                    <span className="mt-1 block text-xs font-medium">
                      {event.title.replace(" sent", "")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/80 to-transparent" />
        </div>
      )}
    </section>
  );
}
