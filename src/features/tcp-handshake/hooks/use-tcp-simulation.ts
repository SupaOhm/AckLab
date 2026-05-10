"use client";

import { useEffect, useRef, useState } from "react";

import type { NetworkEvent } from "@/lib/simulation/types";

import {
  createPacketEvent,
  createTcpPacket,
  tcpNodes,
  type TcpConnectionState,
  type TcpPacket
} from "../lib/tcp-simulation";
import type { PacketSequenceOptions, SequenceState, TcpSimulationState } from "../types";

const initialClientSequence = 1200;
const initialServerSequence = 8400;
const clientPort = 53142;
const serverPort = 443;
const packetDelay = 780;
const reducedMotionDelay = 90;

export function useTcpSimulation(reduceMotion: boolean | null) {
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

  const state: TcpSimulationState = {
    clientState,
    serverState,
    packets,
    events,
    message,
    receivedMessage,
    isAnimating,
    sequence,
    displayedPacket,
    activePacket,
    connected,
    canConnect,
    canSend,
    canClose
  };

  return {
    ...state,
    setMessage,
    setSelectedPacketId,
    handleConnect,
    handleSendMessage,
    handleCloseConnection,
    handleReset
  };
}
