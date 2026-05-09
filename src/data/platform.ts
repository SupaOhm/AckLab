import type { ToolCard, VisualizerCard } from "@/types/platform";

export const featureHighlights = [
  {
    title: "Visual first networking",
    description:
      "Packets, layers, subnets, and routing behavior are represented as controllable systems instead of static diagrams."
  },
  {
    title: "Practical developer tools",
    description:
      "CIDR math, binary conversion, protocol flow references, and simulation utilities live in one polished workspace."
  },
  {
    title: "Built for expansion",
    description:
      "The MVP is local-mock only, but the codebase includes contracts for auth, progress, payments, APIs, analytics, and admin."
  }
] as const;

export const learningPaths = [
  {
    title: "Addressing & Subnetting",
    description: "Learn how IPv4 addresses split into network and host portions.",
    difficulty: "Beginner",
    tools: ["Subnet Visualizer", "Binary Converter"],
    href: "/tools/subnet"
  },
  {
    title: "Protocol Flows",
    description: "Trigger connection setup and name resolution, then inspect the packets created.",
    difficulty: "Beginner",
    tools: ["TCP Handshake", "DNS Flow"],
    href: "/visualizers/tcp-handshake"
  },
  {
    title: "Routing & Delivery",
    description: "See how routers choose a path and forward packets toward a destination.",
    difficulty: "Intermediate",
    tools: ["Routing Visualizer"],
    href: "/visualizers/routing"
  },
  {
    title: "OSI & Encapsulation",
    description: "Connect packets, frames, segments, and protocols to the layer model.",
    difficulty: "Beginner",
    tools: ["OSI Model"],
    href: "/visualizers/osi-model"
  }
] as const;

export const visualizerCards: VisualizerCard[] = [
  {
    title: "TCP 3-Way Handshake",
    description:
      "Open a simulated socket, send payloads, and inspect TCP flags, seq, and ack values.",
    href: "/visualizers/tcp-handshake",
    status: "Live",
    signal: "L4"
  },
  {
    title: "OSI Model",
    description: "Explore layer responsibilities, examples, and encapsulation flow.",
    href: "/visualizers/osi-model",
    status: "Live",
    signal: "7 layers"
  },
  {
    title: "DNS Resolution",
    description: "Follow recursive lookup from browser to authoritative answer.",
    href: "/visualizers/dns-flow",
    status: "Live",
    signal: "Flow"
  },
  {
    title: "Routing MVP",
    description: "Inspect weighted router paths and animate packet forwarding.",
    href: "/visualizers/routing",
    status: "Live",
    signal: "Graph"
  }
];

export const toolCards: ToolCard[] = [
  {
    title: "CIDR Calculator",
    description: "Calculate masks, ranges, broadcast addresses, and usable host counts.",
    href: "/tools/subnet",
    status: "Live",
    category: "Addressing"
  },
  {
    title: "Subnet Visualizer",
    description: "See network and host bits split across an IPv4 address.",
    href: "/tools/subnet",
    status: "Live",
    category: "Addressing"
  },
  {
    title: "Binary Converter",
    description: "Convert decimal values and IPv4 octets into binary with bit highlighting.",
    href: "/tools/binary",
    status: "Live",
    category: "Foundations"
  },
  {
    title: "Packet Analyzer",
    description: "Inspect packet headers and protocol fields from sample captures.",
    href: "/tools",
    status: "Coming Soon",
    category: "Diagnostics"
  },
  {
    title: "Port Reference",
    description: "Search common ports, protocols, and security notes.",
    href: "/tools",
    status: "Coming Soon",
    category: "Reference"
  },
  {
    title: "HTTP Inspector",
    description: "Visualize requests, responses, caching, headers, and status codes.",
    href: "/tools",
    status: "Coming Soon",
    category: "Application"
  },
  {
    title: "Latency Visualizer",
    description: "Model propagation, queuing, and processing delays.",
    href: "/tools",
    status: "Coming Soon",
    category: "Performance"
  },
  {
    title: "Wi-Fi Congestion Simulator",
    description: "Explore contention, channel overlap, and airtime tradeoffs.",
    href: "/tools",
    status: "Coming Soon",
    category: "Wireless"
  }
];

export const roadmapItems = [
  "Quiz engine and adaptive concept checks",
  "User progress and course path persistence",
  "Admin dashboard for content operations",
  "Secure auth, RBAC, subscriptions, and payment workflows",
  "Analytics, audit logging, and rate limited API integrations"
] as const;
