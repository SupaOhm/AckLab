import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const upcomingLabModules: CurriculumModule[] = [
  [
    "arp-broadcast-lab",
    "ARP Broadcast Lab",
    "Broadcast a request and watch the LAN answer.",
    "Data Link Layer",
    2,
    ["ARP"]
  ],
  [
    "vlan-lab",
    "VLAN Lab",
    "Split hosts into separate broadcast domains.",
    "Data Link Layer",
    2,
    []
  ],
  [
    "nat-translation-lab",
    "NAT Translation Lab",
    "Translate private source addresses live.",
    "Network Layer",
    3,
    ["NAT"]
  ],
  [
    "http-request-lab",
    "HTTP Request Lab",
    "Open a request and inspect headers.",
    "Application Layer",
    7,
    ["HTTP"]
  ],
  [
    "tls-handshake-lab",
    "TLS Handshake Lab",
    "Negotiate keys before encrypted HTTP.",
    "Application Layer",
    7,
    ["TLS"]
  ],
  [
    "dhcp-lease-lab",
    "DHCP Lease Lab",
    "Request an address from a DHCP server.",
    "Application Layer",
    7,
    ["DHCP"]
  ],
  [
    "icmp-ping-lab",
    "ICMP Ping Lab",
    "Send echo requests and inspect replies.",
    "Network Layer",
    3,
    ["ICMP"]
  ],
  [
    "packet-fragmentation-lab",
    "Packet Fragmentation Lab",
    "Split packets when MTU is too small.",
    "Network Layer",
    3,
    ["IPv4"]
  ],
  [
    "wi-fi-congestion-lab",
    "Wi-Fi Congestion Lab",
    "Model airtime and channel contention.",
    "Physical Layer",
    1,
    []
  ],
  [
    "port-scanner-simulator",
    "Port Scanner Simulator",
    "Probe services without touching real hosts.",
    "Security Fundamentals",
    4,
    ["TCP"]
  ],
  [
    "firewall-rules-lab",
    "Firewall Rules Lab",
    "Allow and block traffic by rule.",
    "Security Fundamentals",
    3,
    []
  ]
].map(([id, title, shortDescription, category, osiLayer, protocols]) =>
  module({
    id: String(id),
    title: String(title),
    shortDescription: String(shortDescription),
    category: String(category),
    difficulty: "intermediate",
    estimatedTime: "12 min",
    prerequisites: ["osi-model"],
    relatedModules: ["tcp-handshake", "routing-visualizer"],
    osiLayer: Number(osiLayer),
    protocols: protocols as string[],
    type: "lab"
  })
);
