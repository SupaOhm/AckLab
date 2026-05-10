import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const networkLayerConceptModules: CurriculumModule[] = [
  ["ip-address", "IP address", "A logical address for network delivery."],
  ["ipv4-addressing", "IPv4 addressing", "32-bit addresses written as four octets."],
  ["ipv6", "IPv6", "128-bit addressing for modern networks."],
  ["subnet-mask", "Subnet mask", "Marks network bits and host bits."],
  ["cidr", "CIDR", "Prefix notation for subnet size."],
  ["default-gateway", "Default gateway", "Where packets go when the destination is remote."],
  ["routing-basics", "Routing basics", "How routers choose a next hop for packets."],
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
);

export const networkLayerLabModules: CurriculumModule[] = [
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
  })
];
