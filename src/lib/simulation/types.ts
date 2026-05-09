export type NetworkNodeKind = "client" | "server" | "router" | "resolver" | "service";

export type PacketDirection = "outbound" | "inbound";

export type ProtocolName = "TCP" | "DNS" | "ARP" | "HTTP" | "ICMP" | "IPv4";

export interface NetworkNode {
  id: string;
  label: string;
  address: string;
  kind: NetworkNodeKind;
}

export interface PacketHeaderField {
  label: string;
  value: string;
  description?: string;
}

export interface Packet {
  id: string;
  protocol: ProtocolName;
  label: string;
  from: string;
  to: string;
  direction: PacketDirection;
  headers: PacketHeaderField[];
  payload?: string;
  explanation: string;
}

export interface NetworkEvent {
  id: string;
  title: string;
  description: string;
  packetId?: string;
  timestampLabel: string;
}

export interface ProtocolState {
  label: string;
  value: string;
  description?: string;
}
