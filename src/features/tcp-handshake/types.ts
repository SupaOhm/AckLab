import type { NetworkEvent } from "@/lib/simulation/types";

import type { TcpConnectionState, TcpPacket } from "./lib/tcp-simulation";

export interface SequenceState {
  client: number;
  server: number;
}

export interface PacketSequenceOptions {
  onPacketStart?: (packet: TcpPacket, index: number) => void;
  onPacketComplete?: (packet: TcpPacket, index: number) => void;
  onComplete?: () => void;
}

export interface TcpSimulationState {
  clientState: TcpConnectionState;
  serverState: TcpConnectionState;
  packets: TcpPacket[];
  events: NetworkEvent[];
  message: string;
  receivedMessage: string;
  isAnimating: boolean;
  sequence: SequenceState;
  displayedPacket: TcpPacket | null;
  activePacket: TcpPacket | undefined;
  connected: boolean;
  canConnect: boolean;
  canSend: boolean;
  canClose: boolean;
}
