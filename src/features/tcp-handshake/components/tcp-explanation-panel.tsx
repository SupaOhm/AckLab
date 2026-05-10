"use client";

import { ExplanationPanel } from "@/components/shared/explanation-panel";

import type { TcpPacket } from "../lib/tcp-simulation";

export function TcpExplanationPanel({ packet }: { packet: TcpPacket | null }) {
  return (
    <ExplanationPanel title={packet ? packet.label : "Start"}>
      <p>
        {packet ? packet.explanation : "Click Connect to create SYN, SYN-ACK, and ACK packets."}
      </p>
    </ExplanationPanel>
  );
}
