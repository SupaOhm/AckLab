import type { LearningPath } from "@/types/curriculum";

export const beginnerPath: LearningPath = {
  id: "complete-beginner",
  title: "Complete Beginner Path",
  shortDescription: "Start with signals and end with your first security mental model.",
  moduleIds: [
    "communication-basics",
    "data-bits-bytes",
    "bandwidth",
    "latency",
    "throughput",
    "host",
    "switch",
    "router",
    "server",
    "ip-address",
    "binary-converter",
    "ipv4-addressing",
    "subnet-visualizer",
    "default-gateway",
    "routing-visualizer",
    "dns-flow",
    "tcp-handshake",
    "http-basics",
    "cia-triad"
  ]
};

export const protocolExplorerIds = [
  "ethernet",
  "arp",
  "ipv4-addressing",
  "ipv6",
  "icmp",
  "tcp-basics",
  "udp-basics",
  "dns-basics",
  "dhcp",
  "http-basics",
  "https-tls",
  "ssh",
  "smtp",
  "ftp-sftp",
  "nat",
  "bgp",
  "ospf"
];

export const labModuleIds = [
  "binary-converter",
  "subnet-visualizer",
  "tcp-handshake",
  "dns-flow",
  "osi-model",
  "routing-visualizer",
  "arp-broadcast-lab",
  "vlan-lab",
  "nat-translation-lab",
  "http-request-lab",
  "tls-handshake-lab",
  "dhcp-lease-lab",
  "icmp-ping-lab",
  "packet-fragmentation-lab",
  "wi-fi-congestion-lab",
  "port-scanner-simulator",
  "firewall-rules-lab"
];

export const goalPaths: LearningPath[] = [
  {
    id: "understand-internet",
    title: "I want to understand the internet",
    shortDescription: "Names, addresses, routers, TCP, and web requests.",
    moduleIds: [
      "dns-flow",
      "subnet-visualizer",
      "routing-visualizer",
      "tcp-handshake",
      "http-basics"
    ]
  },
  {
    id: "networking-exams",
    title: "I want to pass networking exams",
    shortDescription: "OSI, addressing, subnetting, routing, and core protocols.",
    moduleIds: [
      "osi-model",
      "binary-converter",
      "subnet-visualizer",
      "routing-visualizer",
      "tcp-handshake"
    ]
  },
  {
    id: "cybersecurity",
    title: "I want to learn cybersecurity",
    shortDescription: "Ports, TCP, DNS, TLS, firewalls, scanning, and sniffing.",
    moduleIds: ["tcp-handshake", "dns-flow", "tls-basics", "firewalls", "port-scanning-concept"]
  },
  {
    id: "network-engineer",
    title: "I want to become a network engineer",
    shortDescription: "Devices, VLANs, routing tables, NAT, OSPF, and BGP.",
    moduleIds: [
      "switch",
      "router",
      "subnet-visualizer",
      "routing-visualizer",
      "vlan",
      "nat",
      "ospf"
    ]
  },
  {
    id: "home-wifi",
    title: "I want to debug Wi-Fi/home network issues",
    shortDescription: "Latency, DNS, gateways, Wi-Fi congestion, DHCP, and NAT.",
    moduleIds: ["latency", "default-gateway", "dns-flow", "dhcp", "nat", "wi-fi-congestion-lab"]
  },
  {
    id: "cloud-networking",
    title: "I want to understand cloud networking",
    shortDescription: "VPCs, cloud subnets, security groups, load balancers, and gateways.",
    moduleIds: [
      "subnet-visualizer",
      "vpc",
      "cloud-subnets",
      "security-groups",
      "load-balancer",
      "api-gateway"
    ]
  }
];
