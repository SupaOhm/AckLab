import type { ArpFrame, ArpHost, ArpStep } from "@/features/arp/types";

export const arpHosts: ArpHost[] = [
  {
    id: "host-a",
    label: "Host A",
    ipAddress: "192.168.1.10",
    macAddress: "AA:AA:AA:AA:AA:10",
    role: "source"
  },
  {
    id: "switch",
    label: "LAN Switch",
    ipAddress: "Layer 2",
    macAddress: "switch fabric",
    role: "switch"
  },
  {
    id: "host-b",
    label: "Host B",
    ipAddress: "192.168.1.25",
    macAddress: "BB:BB:BB:BB:BB:25",
    role: "target"
  },
  {
    id: "host-c",
    label: "Host C",
    ipAddress: "192.168.1.44",
    macAddress: "CC:CC:CC:CC:CC:44",
    role: "observer"
  }
];

export const arpFrames: ArpFrame[] = [
  {
    id: "arp-request",
    kind: "request",
    label: "ARP Request",
    direction: "broadcast",
    from: "host-a",
    to: "ff:ff:ff:ff:ff:ff",
    sourceIp: "192.168.1.10",
    sourceMac: "AA:AA:AA:AA:AA:10",
    targetIp: "192.168.1.25",
    targetMac: "00:00:00:00:00:00",
    summary: "Who has 192.168.1.25? Tell 192.168.1.10."
  },
  {
    id: "arp-reply",
    kind: "reply",
    label: "ARP Reply",
    direction: "unicast",
    from: "host-b",
    to: "host-a",
    sourceIp: "192.168.1.25",
    sourceMac: "BB:BB:BB:BB:BB:25",
    targetIp: "192.168.1.10",
    targetMac: "AA:AA:AA:AA:AA:10",
    summary: "192.168.1.25 is at BB:BB:BB:BB:BB:25."
  },
  {
    id: "data-frame",
    kind: "data",
    label: "Data Frame",
    direction: "unicast",
    from: "host-a",
    to: "host-b",
    sourceIp: "192.168.1.10",
    sourceMac: "AA:AA:AA:AA:AA:10",
    targetIp: "192.168.1.25",
    targetMac: "BB:BB:BB:BB:BB:25",
    summary: "Host A can now address the Ethernet frame to Host B."
  }
];

export const arpSteps: ArpStep[] = [
  {
    id: "cache-check",
    title: "Check cache",
    description: "Host A knows Host B's IP address, but it does not know Host B's MAC address.",
    whyItMatters:
      "Ethernet delivery needs a destination MAC address before any local frame can be sent.",
    sender: "Host A",
    receivers: "Host A ARP cache",
    flowLabel: "Host A checks ARP cache",
    visibleResult: "The cache lookup misses. Host A must ask the LAN.",
    delivery: "cache",
    visualMode: "cache-check",
    highlightHostIds: ["host-a"],
    hostBadges: { "host-a": "CHECKING" },
    showPacket: false,
    highlightCache: true
  },
  {
    id: "broadcast-request",
    title: "Broadcast request",
    description: "Host A broadcasts an ARP Request to every device on the LAN.",
    whyItMatters:
      "A broadcast is used because Host A does not yet know which MAC address owns the IP.",
    sender: "Host A",
    receivers: "All LAN devices",
    flowLabel: "Host A broadcasts ARP Request",
    visibleResult: "An ARP Request leaves Host A with destination ff:ff:ff:ff:ff:ff.",
    delivery: "broadcast",
    visualMode: "broadcast-request",
    highlightHostIds: ["host-a", "switch"],
    hostBadges: { "host-a": "SENDER", switch: "FLOODING" },
    showPacket: true,
    frameId: "arp-request"
  },
  {
    id: "lan-receives",
    title: "LAN receives",
    description: "The switch floods the broadcast. Every host sees the question.",
    whyItMatters:
      "Broadcasts stay inside this LAN segment, but every local host must inspect them.",
    sender: "LAN switch",
    receivers: "Host A, Host B, and Host C",
    flowLabel: "All LAN hosts receive the broadcast",
    visibleResult:
      "Host B and Host C both receive the request, even though only one should answer.",
    delivery: "broadcast",
    visualMode: "lan-receive",
    highlightHostIds: ["host-a", "switch", "host-b", "host-c"],
    hostBadges: {
      "host-a": "SENDER",
      "host-b": "RECEIVED",
      "host-c": "RECEIVED",
      switch: "FLOODED"
    },
    showPacket: true,
    frameId: "arp-request"
  },
  {
    id: "matching-host",
    title: "Host B matches",
    description: "Only Host B owns 192.168.1.25, so it prepares an ARP Reply.",
    whyItMatters: "ARP replies come only from the device whose IP matches the question.",
    sender: "Host B",
    receivers: "Local IP check",
    flowLabel: "Only Host B matches 192.168.1.25",
    visibleResult: "Host C ignores the request. Host B is highlighted as the match.",
    delivery: "local",
    visualMode: "target-match",
    highlightHostIds: ["host-b"],
    dimHostIds: ["host-c"],
    hostBadges: { "host-b": "MATCH", "host-c": "ignored" },
    targetIpHighlightHostIds: ["host-b"],
    showPacket: false
  },
  {
    id: "unicast-reply",
    title: "Unicast reply",
    description: "Host B sends its MAC address directly back to Host A.",
    whyItMatters: "The reply can be unicast because Host B learned Host A's MAC from the request.",
    sender: "Host B",
    receivers: "Host A",
    flowLabel: "Host B -> Host A",
    visibleResult: "An ARP Reply travels back only to Host A.",
    delivery: "unicast",
    visualMode: "unicast-reply",
    highlightHostIds: ["host-b", "switch", "host-a"],
    hostBadges: { "host-b": "SENDER", "host-a": "RECEIVER" },
    showPacket: true,
    frameId: "arp-reply"
  },
  {
    id: "cache-update",
    title: "Cache updated",
    description: "Host A stores the IP-to-MAC mapping in its ARP cache.",
    whyItMatters:
      "Future frames to 192.168.1.25 can skip the broadcast until the cache entry expires.",
    sender: "Host A",
    receivers: "Host A ARP cache",
    flowLabel: "Host A updates ARP cache",
    visibleResult: "The missing entry becomes BB:BB:BB:BB:BB:25.",
    delivery: "cache",
    visualMode: "cache-update",
    highlightHostIds: ["host-a"],
    hostBadges: { "host-a": "LEARNED" },
    showPacket: false,
    highlightCache: true
  },
  {
    id: "send-frame",
    title: "Send frame",
    description: "The actual Ethernet frame can now be sent to Host B's MAC address.",
    whyItMatters:
      "ARP is not the payload delivery. It prepares Ethernet with the MAC address it needs.",
    sender: "Host A",
    receivers: "Host B",
    flowLabel: "Host A -> Host B",
    visibleResult: "Host A sends a unicast frame to BB:BB:BB:BB:BB:25.",
    delivery: "unicast",
    visualMode: "data-frame",
    highlightHostIds: ["host-a", "switch", "host-b"],
    hostBadges: { "host-a": "SENDER", "host-b": "TARGET" },
    showPacket: true,
    frameId: "data-frame"
  },
  {
    id: "summary",
    title: "ARP solved it",
    description:
      "ARP maps an IP address to a MAC address so Ethernet can deliver frames inside the local network.",
    whyItMatters:
      "IP tells Host A which device it wants. The MAC address tells Ethernet where to send the local frame.",
    sender: "Host A",
    receivers: "Host B",
    flowLabel: "ARP mapping complete",
    visibleResult: "Host A now has the MAC address it needs for local delivery.",
    delivery: "cache",
    visualMode: "complete",
    highlightHostIds: ["host-a", "host-b"],
    hostBadges: { "host-a": "CACHE READY", "host-b": "KNOWN MAC" },
    targetIpHighlightHostIds: ["host-b"],
    showPacket: false,
    highlightCache: true
  }
];
