import type { OsiLayer } from "@/types/networking";

export const osiLayers: OsiLayer[] = [
  {
    number: 7,
    name: "Application",
    protocols: ["HTTP", "DNS", "SMTP"],
    summary: "User-facing network services and application protocols.",
    dataUnit: "Data"
  },
  {
    number: 6,
    name: "Presentation",
    protocols: ["TLS", "JSON", "MIME"],
    summary: "Encoding, compression, encryption, and data representation.",
    dataUnit: "Data"
  },
  {
    number: 5,
    name: "Session",
    protocols: ["RPC", "NetBIOS", "SIP"],
    summary: "Dialog control and session lifecycle management.",
    dataUnit: "Data"
  },
  {
    number: 4,
    name: "Transport",
    protocols: ["TCP", "UDP", "QUIC"],
    summary: "End-to-end transport, ports, ordering, and reliability behavior.",
    dataUnit: "Segment"
  },
  {
    number: 3,
    name: "Network",
    protocols: ["IP", "ICMP", "OSPF"],
    summary: "Logical addressing and routing between networks.",
    dataUnit: "Packet"
  },
  {
    number: 2,
    name: "Data Link",
    protocols: ["Ethernet", "Wi-Fi", "ARP"],
    summary: "Local delivery, framing, MAC addresses, and error detection.",
    dataUnit: "Frame"
  },
  {
    number: 1,
    name: "Physical",
    protocols: ["Fiber", "Copper", "Radio"],
    summary: "Signals, media, voltage, optics, and radio transmission.",
    dataUnit: "Bits"
  }
];
