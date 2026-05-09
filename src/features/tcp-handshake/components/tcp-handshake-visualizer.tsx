"use client";

import { motion } from "framer-motion";
import { Cable, RotateCcw, Send, Unplug } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventTimeline } from "@/components/visualizations/event-timeline";
import { PacketInspector } from "@/components/visualizations/packet-inspector";
import { ProtocolStatePanel } from "@/components/visualizations/protocol-state-panel";
import type { NetworkEvent, ProtocolState } from "@/lib/simulation/types";

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

interface SequenceState {
  client: number;
  server: number;
}

export function TcpHandshakeVisualizer() {
  const [clientState, setClientState] = useState<TcpConnectionState>("CLOSED");
  const [serverState, setServerState] = useState<TcpConnectionState>("LISTEN");
  const [packets, setPackets] = useState<TcpPacket[]>([]);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [selectedPacketId, setSelectedPacketId] = useState<string>();
  const [activePacketId, setActivePacketId] = useState<string>();
  const [message, setMessage] = useState("hello acklab");
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
  const connected = clientState === "ESTABLISHED" && serverState === "ESTABLISHED";

  const protocolStates: ProtocolState[] = [
    {
      label: "Client TCP state",
      value: clientState,
      description: connected
        ? "The client can send application data over this simulated socket."
        : "The client is waiting for a connection action."
    },
    {
      label: "Server TCP state",
      value: serverState,
      description: connected
        ? "The server accepted the handshake and is ready to acknowledge data."
        : "The server is listening for a new SYN."
    },
    {
      label: "Socket pair",
      value: `${clientPort} -> ${serverPort}`,
      description:
        "A TCP connection is identified by source port, destination port, and host addresses."
    }
  ];

  function clearPacketTimers(timerIds: number[]) {
    timerIds.forEach((timer) => window.clearTimeout(timer));
    timerIds.length = 0;
  }

  function commitPackets(packetBatch: TcpPacket[]) {
    setPackets((current) => [...current, ...packetBatch]);
    setEvents((current) => [
      ...current,
      ...packetBatch.map((packet, index) => createPacketEvent(packet, current.length + index + 1))
    ]);
    setSelectedPacketId(packetBatch.at(-1)?.id);

    clearPacketTimers(timers.current);
    packetBatch.forEach((packet, index) => {
      const timer = window.setTimeout(() => setActivePacketId(packet.id), index * 800);
      timers.current.push(timer);
    });
  }

  function handleConnect() {
    if (connected || clientState === "SYN-SENT") {
      return;
    }

    const syn = createTcpPacket({
      id: `tcp-${packets.length + 1}`,
      label: "SYN",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["SYN"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: 0,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation:
        "The client asks the server to synchronize sequence numbers and open a TCP session."
    });
    const synAck = createTcpPacket({
      id: `tcp-${packets.length + 2}`,
      label: "SYN-ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["SYN", "ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + 1,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation:
        "The server acknowledges the client's SYN and sends its own sequence number back."
    });
    const ack = createTcpPacket({
      id: `tcp-${packets.length + 3}`,
      label: "ACK",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["ACK"],
      sequenceNumber: sequence.client + 1,
      acknowledgementNumber: sequence.server + 1,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client confirms the server sequence number. The socket is now established."
    });

    setClientState("ESTABLISHED");
    setServerState("ESTABLISHED");
    setSequence({ client: sequence.client + 1, server: sequence.server + 1 });
    commitPackets([syn, synAck, ack]);
  }

  function handleSendMessage() {
    if (!connected || message.trim().length === 0) {
      return;
    }

    const payload = message.trim();
    const payloadLength = payload.length;
    const dataPacket = createTcpPacket({
      id: `tcp-${packets.length + 1}`,
      label: "PSH-ACK",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["PSH", "ACK"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: sequence.server,
      sourcePort: clientPort,
      destinationPort: serverPort,
      payload,
      explanation:
        "The client pushes application bytes to the server while acknowledging the last server byte."
    });
    const acknowledgement = createTcpPacket({
      id: `tcp-${packets.length + 2}`,
      label: "ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + payloadLength,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation: "The server acknowledges the bytes it received from the client payload."
    });

    setSequence({ client: sequence.client + payloadLength, server: sequence.server });
    commitPackets([dataPacket, acknowledgement]);
  }

  function handleCloseConnection() {
    if (!connected) {
      return;
    }

    const fin = createTcpPacket({
      id: `tcp-${packets.length + 1}`,
      label: "FIN-ACK",
      from: tcpNodes[0].label,
      to: tcpNodes[1].label,
      direction: "outbound",
      flags: ["FIN", "ACK"],
      sequenceNumber: sequence.client,
      acknowledgementNumber: sequence.server,
      sourcePort: clientPort,
      destinationPort: serverPort,
      explanation: "The client says it has finished sending data and wants to close the connection."
    });
    const ack = createTcpPacket({
      id: `tcp-${packets.length + 2}`,
      label: "ACK",
      from: tcpNodes[1].label,
      to: tcpNodes[0].label,
      direction: "inbound",
      flags: ["ACK"],
      sequenceNumber: sequence.server,
      acknowledgementNumber: sequence.client + 1,
      sourcePort: serverPort,
      destinationPort: clientPort,
      explanation:
        "The server acknowledges the close request before ending its side of the session."
    });

    setClientState("CLOSED");
    setServerState("LISTEN");
    setSequence({ client: sequence.client + 1, server: sequence.server });
    commitPackets([fin, ack]);
  }

  function handleReset() {
    clearPacketTimers(timers.current);
    setClientState("CLOSED");
    setServerState("LISTEN");
    setPackets([]);
    setEvents([]);
    setSelectedPacketId(undefined);
    setActivePacketId(undefined);
    setSequence({ client: initialClientSequence, server: initialServerSequence });
  }

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="TCP socket lab"
        description="Cause the connection yourself. Each action creates real TCP-like packets, state changes, and inspectable headers."
      >
        <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <div>
              <p className="text-sm font-semibold">Control the client</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Open a connection, send bytes, and watch the server acknowledge what happened.
              </p>
            </div>

            <div className="grid gap-3">
              <Button onClick={handleConnect} disabled={connected}>
                <Cable className="size-4" />
                Connect
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="tcp-message">Message payload</Label>
                <Input
                  id="tcp-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={!connected}
                  placeholder="Type bytes to send"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Payload length changes the next sequence number.
                </p>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!connected || message.trim().length === 0}
              >
                <Send className="size-4" />
                Send message
              </Button>
              <Button variant="outline" onClick={handleCloseConnection} disabled={!connected}>
                <Unplug className="size-4" />
                Close connection
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Retry lab
              </Button>
            </div>
          </section>

          <section className="relative min-h-[420px] overflow-hidden rounded-xl bg-secondary/8 p-6">
            <div className="network-grid absolute inset-0 opacity-8" />
            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <StatusPill connected={connected} />
                <span className="text-xs text-muted-foreground">Simulated TCP over IPv4</span>
              </div>

              <div className="relative flex items-center justify-between px-1 sm:px-6">
                <LabNode label="Client" address={tcpNodes[0].address} state={clientState} />
                <div className="absolute left-[17%] right-[17%] top-1/2 h-px bg-border/45" />
                <div className="absolute left-[17%] right-[17%] top-[calc(50%-18px)] h-9 rounded-full bg-primary/5" />
                <LabNode
                  label="Server"
                  address={tcpNodes[1].address}
                  state={serverState}
                  align="right"
                />
                {selectedPacket ? (
                  <AnimatedPacket
                    key={activePacketId}
                    packet={
                      packets.find((packet) => packet.id === activePacketId) ?? selectedPacket
                    }
                  />
                ) : null}
              </div>

              <div className="grid gap-3 rounded-xl border border-border/10 bg-background/30 p-4 sm:grid-cols-3">
                <MiniMetric label="Client seq" value={sequence.client} />
                <MiniMetric label="Server seq" value={sequence.server} />
                <MiniMetric label="Packets" value={packets.length} />
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <ProtocolStatePanel title="TCP state" states={protocolStates} />
            <PacketInspector packet={selectedPacket} />
          </div>
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1fr]">
        <EventTimeline
          events={events}
          activePacketId={selectedPacket?.id}
          onSelectPacket={setSelectedPacketId}
        />
        <ExplanationPanel title={selectedPacket ? selectedPacket.label : "Start the lab"}>
          {selectedPacket ? (
            <>
              <p>{selectedPacket.explanation}</p>
              <p>
                Notice how every TCP segment carries state. Flags explain intent, sequence numbers
                track bytes, and acknowledgements tell the other side what arrived.
              </p>
            </>
          ) : (
            <>
              <p>
                Click Connect to generate the SYN, SYN-ACK, and ACK packets that create a TCP
                session.
              </p>
              <p>
                After the socket is established, send a message to see payload bytes affect sequence
                and acknowledgement numbers.
              </p>
            </>
          )}
        </ExplanationPanel>
      </div>

      <PracticePrompt prompt="Connect, send two different messages, then compare how the ACK number changes after each payload." />
    </div>
  );
}

function AnimatedPacket({ packet }: { packet: TcpPacket }) {
  const outbound = packet.direction === "outbound";

  return (
    <motion.button
      type="button"
      className="absolute top-[calc(50%-18px)] z-20 rounded-full border border-primary/25 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20"
      initial={{ left: outbound ? "17%" : "73%", opacity: 0, scale: 0.92 }}
      animate={{ left: outbound ? "73%" : "17%", opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      {packet.label}
    </motion.button>
  );
}

function LabNode({
  label,
  address,
  state,
  align = "left"
}: {
  label: string;
  address: string;
  state: TcpConnectionState;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "relative z-10 text-right" : "relative z-10"}>
      <div className="grid size-28 place-items-center rounded-2xl border border-primary/18 bg-background/60 shadow-sm">
        <div className="grid size-14 place-items-center rounded-xl bg-primary/12 text-primary">
          <Cable className="size-7" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold">{label}</p>
      <p className="font-mono text-xs text-muted-foreground">{address}</p>
      <p className="mt-2 font-mono text-xs text-primary">{state}</p>
    </div>
  );
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {connected ? "Connection established" : "No active TCP session"}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}
