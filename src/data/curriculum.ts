import type { CurriculumModule, LearningPath } from "@/types/curriculum";

const unlockedLabs = new Set([
  "binary-converter",
  "subnet-visualizer",
  "tcp-handshake",
  "dns-flow",
  "osi-model",
  "routing-visualizer"
]);

const routeById: Record<string, string> = {
  "binary-converter": "/tools/binary",
  "subnet-visualizer": "/tools/subnet",
  "tcp-handshake": "/visualizers/tcp-handshake",
  "dns-flow": "/visualizers/dns-flow",
  "osi-model": "/visualizers/osi-model",
  "routing-visualizer": "/visualizers/routing"
};

function module(input: Omit<CurriculumModule, "status" | "route">): CurriculumModule {
  const status = unlockedLabs.has(input.id) ? "unlocked" : "comingSoon";

  return {
    ...input,
    status,
    route: routeById[input.id] ?? `/learn/${input.id}`
  };
}

export const curriculumModules: CurriculumModule[] = [
  module({
    id: "communication-basics",
    title: "What is communication?",
    shortDescription: "Two systems exchange meaning through agreed signals.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "6 min",
    prerequisites: [],
    relatedModules: ["client-server-model", "packet-switching"],
    type: "concept"
  }),
  module({
    id: "data-bits-bytes",
    title: "Data, bits, and bytes",
    shortDescription: "See how information becomes binary values.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "8 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["binary-converter"],
    type: "concept"
  }),
  module({
    id: "binary-converter",
    title: "Binary Converter",
    shortDescription: "Convert decimal octets into binary bits.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "8 min",
    prerequisites: ["data-bits-bytes"],
    relatedModules: ["ipv4-addressing", "subnet-visualizer"],
    type: "tool"
  }),
  module({
    id: "bandwidth",
    title: "Bandwidth",
    shortDescription: "How much data a link can carry.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "7 min",
    prerequisites: ["data-bits-bytes"],
    relatedModules: ["throughput", "latency"],
    osiLayer: 1,
    type: "concept"
  }),
  module({
    id: "latency",
    title: "Latency",
    shortDescription: "How long a packet takes to arrive.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "7 min",
    prerequisites: ["packet-switching"],
    relatedModules: ["jitter", "traceroute"],
    type: "concept"
  }),
  module({
    id: "throughput",
    title: "Throughput",
    shortDescription: "The actual delivered data rate.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "7 min",
    prerequisites: ["bandwidth"],
    relatedModules: ["latency", "congestion-control"],
    type: "concept"
  }),
  module({
    id: "jitter",
    title: "Jitter",
    shortDescription: "Variation in packet delay.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "5 min",
    prerequisites: ["latency"],
    relatedModules: ["udp-basics", "wi-fi-congestion-lab"],
    type: "concept"
  }),
  module({
    id: "packet-switching",
    title: "Packet switching",
    shortDescription: "Data moves as small independent packets.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "8 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["routing-visualizer", "circuit-switching"],
    type: "concept"
  }),
  module({
    id: "circuit-switching",
    title: "Circuit switching",
    shortDescription: "A dedicated path is reserved before communication.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "5 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["packet-switching"],
    type: "concept"
  }),
  module({
    id: "client-server-model",
    title: "Client-server model",
    shortDescription: "Clients request resources from always-on services.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "6 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["http-basics", "dns-basics"],
    type: "concept"
  }),
  module({
    id: "peer-to-peer-model",
    title: "Peer-to-peer model",
    shortDescription: "Hosts act as both clients and servers.",
    category: "Foundation",
    difficulty: "beginner",
    estimatedTime: "6 min",
    prerequisites: ["client-server-model"],
    relatedModules: ["ports"],
    type: "concept"
  }),
  ...[
    ["host", "Host", "An endpoint that sends or receives data.", "Devices", 1],
    ["nic", "NIC", "Hardware that connects a host to a network.", "Devices", 1],
    ["hub", "Hub", "A simple repeater for physical signals.", "Devices", 1],
    ["switch", "Switch", "Forwards Ethernet frames inside a LAN.", "Devices", 2],
    ["router", "Router", "Moves packets between networks.", "Devices", 3],
    ["access-point", "Access point", "Connects wireless clients to a LAN.", "Devices", 2],
    ["modem", "Modem", "Connects local networks to an ISP link.", "Devices", 1],
    ["firewall", "Firewall", "Allows or blocks traffic by rule.", "Devices", 3],
    ["gateway", "Gateway", "The next hop out of a local network.", "Devices", 3],
    ["server", "Server", "Provides applications or resources to clients.", "Devices", 7]
  ].map(([id, title, shortDescription, category, osiLayer]) =>
    module({
      id: String(id),
      title: String(title),
      shortDescription: String(shortDescription),
      category: String(category),
      difficulty: "beginner",
      estimatedTime: "5 min",
      prerequisites: ["communication-basics"],
      relatedModules: ["client-server-model"],
      osiLayer: Number(osiLayer),
      type: "concept"
    })
  ),
  ...[
    [
      "signals",
      "Signals",
      "Electrical, optical, or radio changes that carry bits.",
      "Physical Layer",
      1
    ],
    ["cables", "Cables", "Copper and fiber media for moving signals.", "Physical Layer", 1],
    ["wireless", "Wireless", "Radio links used by Wi-Fi and mobile networks.", "Physical Layer", 1],
    ["encoding", "Encoding", "How bits are represented on a physical medium.", "Physical Layer", 1],
    ["ethernet", "Ethernet", "The dominant LAN technology for frames.", "Data Link Layer", 2],
    ["frames", "Frames", "Layer 2 containers for local delivery.", "Data Link Layer", 2],
    [
      "mac-addresses",
      "MAC addresses",
      "Local hardware addresses used by Ethernet.",
      "Data Link Layer",
      2
    ],
    ["arp", "ARP", "Finds a MAC address for an IPv4 address.", "Data Link Layer", 2],
    ["switching", "Switching", "Forwarding frames by learned MAC addresses.", "Data Link Layer", 2],
    ["broadcast", "Broadcast", "One frame delivered to every host in a LAN.", "Data Link Layer", 2],
    ["vlan", "VLAN", "A logical split inside a switched network.", "Data Link Layer", 2],
    [
      "broadcast-domains",
      "Broadcast domains",
      "The area reached by a Layer 2 broadcast.",
      "Data Link Layer",
      2
    ],
    ["csma-cd", "CSMA/CD", "Classic Ethernet collision handling basics.", "Data Link Layer", 2],
    ["mtu", "MTU", "The largest frame payload a link can carry.", "Data Link Layer", 2]
  ].map(([id, title, shortDescription, category, osiLayer]) =>
    module({
      id: String(id),
      title: String(title),
      shortDescription: String(shortDescription),
      category: String(category),
      difficulty: "beginner",
      estimatedTime: "8 min",
      prerequisites: ["data-bits-bytes"],
      relatedModules: ["osi-model"],
      osiLayer: Number(osiLayer),
      protocols:
        String(title) === "ARP" ? ["ARP"] : String(title) === "Ethernet" ? ["Ethernet"] : [],
      type: String(title) === "ARP" || String(title) === "Ethernet" ? "protocol" : "concept"
    })
  ),
  ...[
    ["ip-address", "IP address", "A logical address for network delivery."],
    ["ipv4-addressing", "IPv4 addressing", "32-bit addresses written as four octets."],
    ["ipv6", "IPv6", "128-bit addressing for modern networks."],
    ["subnet-mask", "Subnet mask", "Marks network bits and host bits."],
    ["cidr", "CIDR", "Prefix notation for subnet size."],
    ["default-gateway", "Default gateway", "Where packets go when the destination is remote."],
    ["icmp", "ICMP", "Control messages used for errors and diagnostics."],
    ["ping", "Ping", "Tests reachability with ICMP echo."],
    ["traceroute", "Traceroute", "Reveals hops along a path."],
    ["routing-table", "Routing table", "Rules routers use to choose next hops."],
    ["static-routing", "Static routing", "Manually configured network paths."],
    ["dynamic-routing", "Dynamic routing", "Routers learn paths from protocols."],
    ["nat", "NAT", "Translates private addresses to public addresses."],
    ["fragmentation", "Fragmentation", "Splits oversized packets for smaller links."]
  ].map(([id, title, shortDescription]) =>
    module({
      id,
      title,
      shortDescription,
      category: "Network Layer",
      difficulty: id === "dynamic-routing" || id === "nat" ? "intermediate" : "beginner",
      estimatedTime: "10 min",
      prerequisites: ["ip-address"],
      relatedModules: ["subnet-visualizer", "routing-visualizer"],
      osiLayer: 3,
      protocols: title.includes("IPv4")
        ? ["IPv4"]
        : title.includes("IPv6")
          ? ["IPv6"]
          : title === "ICMP"
            ? ["ICMP"]
            : [],
      type: ["IPv4 addressing", "IPv6", "ICMP"].includes(title) ? "protocol" : "concept"
    })
  ),
  module({
    id: "subnet-visualizer",
    title: "Subnet Visualizer",
    shortDescription: "Split an IPv4 address into network and host bits.",
    category: "Network Layer",
    difficulty: "beginner",
    estimatedTime: "12 min",
    prerequisites: ["binary-converter", "cidr"],
    relatedModules: ["default-gateway", "routing-visualizer"],
    osiLayer: 3,
    protocols: ["IPv4"],
    type: "lab"
  }),
  module({
    id: "routing-visualizer",
    title: "Routing Visualizer",
    shortDescription: "Watch packets follow the lowest-cost path.",
    category: "Network Layer",
    difficulty: "beginner",
    estimatedTime: "10 min",
    prerequisites: ["ip-address", "router"],
    relatedModules: ["routing-table", "traceroute"],
    osiLayer: 3,
    protocols: ["IPv4"],
    type: "lab"
  }),
  ...[
    ["ports", "Ports", "Numbers that identify application sockets."],
    ["tcp-basics", "TCP", "Reliable transport for ordered byte streams."],
    ["udp-basics", "UDP", "Lightweight transport without delivery guarantees."],
    ["tcp-reliability", "Reliability", "Retransmission and acknowledgements keep data reliable."],
    ["sequence-numbers", "Sequence numbers", "Track byte positions in a TCP stream."],
    ["acknowledgements", "Acknowledgements", "Tell the sender what arrived."],
    ["flow-control", "Flow control", "Prevents overwhelming the receiver."],
    ["congestion-control", "Congestion control", "Adapts sending rate to network pressure."]
  ].map(([id, title, shortDescription]) =>
    module({
      id,
      title,
      shortDescription,
      category: "Transport Layer",
      difficulty: ["flow-control", "congestion-control"].includes(id) ? "intermediate" : "beginner",
      estimatedTime: "10 min",
      prerequisites: ["ip-address"],
      relatedModules: ["tcp-handshake"],
      osiLayer: 4,
      protocols: title === "TCP" ? ["TCP"] : title === "UDP" ? ["UDP"] : [],
      type: title === "TCP" || title === "UDP" ? "protocol" : "concept"
    })
  ),
  module({
    id: "tcp-handshake",
    title: "TCP Socket Lab",
    shortDescription: "Open a connection and inspect TCP flags, seq, and ack.",
    category: "Transport Layer",
    difficulty: "beginner",
    estimatedTime: "10 min",
    prerequisites: ["ports", "tcp-basics"],
    relatedModules: ["tcp-reliability", "http-basics"],
    osiLayer: 4,
    protocols: ["TCP"],
    type: "lab"
  }),
  ...[
    ["sessions", "Sessions", "State that links related exchanges.", 5],
    [
      "connection-management",
      "Connection management",
      "Creating, maintaining, and ending sessions.",
      5
    ],
    ["tls-session-basics", "TLS session basics", "Secure session setup at a high level.", 5],
    ["presentation-encoding", "Encoding", "Representing data in agreed formats.", 6],
    ["compression", "Compression", "Reducing payload size before transfer.", 6],
    ["encryption", "Encryption", "Protecting content from observers.", 6],
    ["serialization", "Serialization", "Turning objects into transferable bytes.", 6]
  ].map(([id, title, shortDescription, osiLayer]) =>
    module({
      id: String(id),
      title: String(title),
      shortDescription: String(shortDescription),
      category: Number(osiLayer) === 5 ? "Session Layer" : "Presentation Layer",
      difficulty: "intermediate",
      estimatedTime: "8 min",
      prerequisites: ["tcp-basics"],
      relatedModules: ["tls-basics"],
      osiLayer: Number(osiLayer),
      type: "concept"
    })
  ),
  ...[
    ["dns-basics", "DNS", "Turns names into addresses.", ["DNS"]],
    ["dhcp", "DHCP", "Automatically assigns host network settings.", ["DHCP"]],
    ["http-basics", "HTTP", "Request and response protocol for the web.", ["HTTP"]],
    ["https-tls", "HTTPS/TLS", "HTTP protected by TLS encryption.", ["HTTPS", "TLS"]],
    ["ssh", "SSH", "Secure remote shell access.", ["SSH"]],
    ["smtp", "SMTP", "Email transfer between mail servers.", ["SMTP"]],
    ["ftp-sftp", "FTP/SFTP", "File transfer protocols.", ["FTP", "SFTP"]],
    ["ntp", "NTP", "Keeps system clocks synchronized.", ["NTP"]]
  ].map(([id, title, shortDescription, protocols]) =>
    module({
      id: String(id),
      title: String(title),
      shortDescription: String(shortDescription),
      category: "Application Layer",
      difficulty: "beginner",
      estimatedTime: "10 min",
      prerequisites: ["client-server-model", "ports"],
      relatedModules: ["dns-flow", "tcp-handshake"],
      osiLayer: 7,
      protocols: protocols as string[],
      type: "protocol"
    })
  ),
  module({
    id: "dns-flow",
    title: "DNS Flow Visualizer",
    shortDescription: "Follow a recursive lookup from browser to answer.",
    category: "Application Layer",
    difficulty: "beginner",
    estimatedTime: "10 min",
    prerequisites: ["dns-basics", "client-server-model"],
    relatedModules: ["http-basics", "routing-visualizer"],
    osiLayer: 7,
    protocols: ["DNS"],
    type: "lab"
  }),
  module({
    id: "osi-model",
    title: "OSI Model Visualizer",
    shortDescription: "Inspect layers and encapsulation from data to bits.",
    category: "OSI Map",
    difficulty: "beginner",
    estimatedTime: "10 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["tcp-handshake", "routing-visualizer"],
    type: "lab"
  }),
  ...[
    ["cia-triad", "CIA triad", "Confidentiality, integrity, and availability."],
    ["firewalls", "Firewalls", "Rules that control traffic paths."],
    ["tls-basics", "TLS basics", "Encryption and identity for network sessions."],
    ["vpn-basics", "VPN basics", "Encrypted tunnels across untrusted networks."],
    ["nat-vs-firewall", "NAT vs firewall", "Address translation is not the same as filtering."],
    [
      "common-attacks",
      "Common attacks overview",
      "Recon, spoofing, interception, and denial basics."
    ],
    ["port-scanning-concept", "Port scanning concept", "Discovering reachable services."],
    [
      "packet-sniffing-concept",
      "Packet sniffing concept",
      "Observing packets on a network segment."
    ]
  ].map(([id, title, shortDescription]) =>
    module({
      id,
      title,
      shortDescription,
      category: "Security Fundamentals",
      difficulty: "intermediate",
      estimatedTime: "10 min",
      prerequisites: ["tcp-basics", "ports"],
      relatedModules: ["firewall-rules-lab", "tls-handshake-lab"],
      type: "concept"
    })
  ),
  ...[
    ["load-balancer", "Load balancer", "Distributes requests across services."],
    ["cdn", "CDN", "Caches content close to users."],
    ["reverse-proxy", "Reverse proxy", "Fronts services and forwards requests."],
    ["api-gateway", "API gateway", "Central entry point for APIs."],
    ["vpc", "VPC", "A private cloud network boundary."],
    ["cloud-subnets", "Subnets in cloud", "Address ranges inside a cloud network."],
    ["security-groups", "Security groups", "Cloud-native traffic rules."],
    ["zero-trust", "Zero Trust basics", "Verify access continuously instead of trusting location."]
  ].map(([id, title, shortDescription]) =>
    module({
      id,
      title,
      shortDescription,
      category: "Cloud & Modern Networks",
      difficulty: "intermediate",
      estimatedTime: "10 min",
      prerequisites: ["subnet-visualizer", "firewalls"],
      relatedModules: ["vpc", "security-groups"],
      type: "concept"
    })
  ),
  ...[
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
  ),
  ...[
    ["bgp", "BGP", "Routes traffic between autonomous systems.", "advanced", ["BGP"]],
    ["ospf", "OSPF", "Finds internal network paths dynamically.", "advanced", ["OSPF"]]
  ].map(([id, title, shortDescription, difficulty, protocols]) =>
    module({
      id: String(id),
      title: String(title),
      shortDescription: String(shortDescription),
      category: "Routing Protocols",
      difficulty: difficulty as "advanced",
      estimatedTime: "15 min",
      prerequisites: ["dynamic-routing", "routing-table"],
      relatedModules: ["routing-visualizer"],
      osiLayer: 3,
      protocols: protocols as string[],
      type: "protocol"
    })
  )
];

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

export const osiLayerPath: LearningPath[] = [1, 2, 3, 4, 5, 6, 7].map((layer) => ({
  id: `osi-layer-${layer}`,
  title: `Layer ${layer}`,
  shortDescription: layerName(layer),
  moduleIds: curriculumModules
    .filter((item) => item.osiLayer === layer)
    .slice(0, 10)
    .map((item) => item.id)
}));

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

export function getModuleById(id: string) {
  return curriculumModules.find((item) => item.id === id);
}

export function getModules(ids: string[]) {
  return ids
    .map((id) => getModuleById(id))
    .filter((item): item is CurriculumModule => Boolean(item));
}

export function getUnlockedModules() {
  return curriculumModules.filter((item) => item.status === "unlocked");
}

export function getLockedModules() {
  return curriculumModules.filter((item) => item.status !== "unlocked");
}

function layerName(layer: number) {
  return (
    {
      1: "Physical",
      2: "Data Link",
      3: "Network",
      4: "Transport",
      5: "Session",
      6: "Presentation",
      7: "Application"
    }[layer] ?? "OSI"
  );
}
