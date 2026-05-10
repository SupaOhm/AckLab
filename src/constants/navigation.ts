import {
  Binary,
  BookOpen,
  Boxes,
  Cable,
  Compass,
  FlaskConical,
  Gauge,
  GitBranch,
  Globe2,
  Home,
  Layers3,
  Network,
  Radio,
  Route,
  ShieldCheck
} from "lucide-react";

export const marketingNavItems = [
  { label: "Learn", href: "/learn" },
  { label: "Labs", href: "#visualizers" },
  { label: "Tools", href: "/tools" },
  { label: "Roadmap", href: "#roadmap" }
] as const;

export const platformNavItems = [
  { label: "Overview", href: "/", icon: Home, description: "Learning hub" },
  { label: "Learn", href: "/learn", icon: BookOpen, description: "Full curriculum map" },
  { label: "Labs", href: "/learn#labs", icon: FlaskConical, description: "Interactive modules" },
  { label: "Tools", href: "/tools", icon: Compass, description: "All utilities" },
  { label: "Protocols", href: "/learn#protocols", icon: Globe2, description: "Protocol explorer" },
  { label: "OSI Map", href: "/learn#osi-map", icon: Layers3, description: "Layer path" },
  {
    label: "Subnet Visualizer",
    href: "/tools/subnet",
    icon: Network,
    description: "IP ranges and host bits"
  },
  {
    label: "Binary Converter",
    href: "/tools/binary",
    icon: Binary,
    description: "Practice octet math"
  },
  {
    label: "TCP Handshake",
    href: "/visualizers/tcp-handshake",
    icon: Cable,
    description: "Connection setup"
  },
  {
    label: "OSI Model",
    href: "/visualizers/osi-model",
    icon: Boxes,
    description: "Layers and encapsulation"
  },
  {
    label: "DNS Flow",
    href: "/visualizers/dns-flow",
    icon: Globe2,
    description: "Name resolution"
  },
  {
    label: "Routing",
    href: "/visualizers/routing",
    icon: Route,
    description: "Path selection"
  },
  {
    label: "ARP Broadcast",
    href: "/visualizers/arp-broadcast",
    icon: Radio,
    description: "MAC discovery"
  }
] as const;

export const platformNavGroups = [
  {
    label: "Start",
    items: [platformNavItems[0], platformNavItems[1]]
  },
  {
    label: "Explore",
    items: [platformNavItems[2], platformNavItems[4], platformNavItems[5]]
  },
  {
    label: "Current Labs",
    items: [
      platformNavItems[6],
      platformNavItems[7],
      platformNavItems[8],
      platformNavItems[9],
      platformNavItems[10],
      platformNavItems[11],
      platformNavItems[12]
    ]
  },
  {
    label: "Reference",
    items: [platformNavItems[3]]
  }
] as const;

export const futureArchitectureItems = [
  { label: "Auth", icon: ShieldCheck },
  { label: "RBAC", icon: GitBranch },
  { label: "Analytics", icon: Gauge }
] as const;
