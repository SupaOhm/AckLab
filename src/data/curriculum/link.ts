import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const linkLayerModules: CurriculumModule[] = [
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
    protocols: String(title) === "ARP" ? ["ARP"] : String(title) === "Ethernet" ? ["Ethernet"] : [],
    type: String(title) === "ARP" || String(title) === "Ethernet" ? "protocol" : "concept"
  })
);
