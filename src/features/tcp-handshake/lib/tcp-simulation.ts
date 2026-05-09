import type { NetworkEvent, NetworkNode, Packet } from "@/lib/simulation/types";

export type TcpConnectionState =
  | "CLOSED"
  | "LISTEN"
  | "SYN-SENT"
  | "SYN-RECEIVED"
  | "ESTABLISHED"
  | "FIN-WAIT"
  | "CLOSE-WAIT";

export interface TcpPacket extends Packet {
  flags: string[];
  sequenceNumber: number;
  acknowledgementNumber: number;
  sourcePort: number;
  destinationPort: number;
}

export const tcpNodes: NetworkNode[] = [
  {
    id: "client",
    label: "Client host",
    address: "10.0.0.12",
    kind: "client"
  },
  {
    id: "server",
    label: "Server host",
    address: "203.0.113.10",
    kind: "server"
  }
];

export function createTcpPacket({
  id,
  label,
  from,
  to,
  direction,
  flags,
  sequenceNumber,
  acknowledgementNumber,
  sourcePort,
  destinationPort,
  payload,
  explanation
}: Omit<TcpPacket, "protocol" | "headers">): TcpPacket {
  return {
    id,
    protocol: "TCP",
    label,
    from,
    to,
    direction,
    flags,
    sequenceNumber,
    acknowledgementNumber,
    sourcePort,
    destinationPort,
    payload,
    explanation,
    headers: [
      {
        label: "Flags",
        value: flags.join(", "),
        description: "TCP flags describe the purpose of this segment."
      },
      {
        label: "Sequence number",
        value: String(sequenceNumber),
        description: "The byte position this side is sending from."
      },
      {
        label: "Acknowledgement number",
        value: String(acknowledgementNumber),
        description: "The next byte this side expects to receive."
      },
      {
        label: "Ports",
        value: `${sourcePort} -> ${destinationPort}`,
        description: "Ports identify the local application socket at each host."
      }
    ]
  };
}

export function createPacketEvent(packet: TcpPacket, index: number): NetworkEvent {
  return {
    id: `event-${packet.id}`,
    packetId: packet.id,
    title: `${packet.label} sent`,
    description: packet.explanation,
    timestampLabel: `T+${index}s`
  };
}
