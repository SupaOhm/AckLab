import {
  Binary,
  Boxes,
  Cable,
  Compass,
  Gauge,
  GitBranch,
  Globe2,
  Home,
  Network,
  Route,
  ShieldCheck
} from "lucide-react";

export const marketingNavItems = [
  { label: "Platform", href: "#platform" },
  { label: "Visualizers", href: "#visualizers" },
  { label: "Tools", href: "/tools" },
  { label: "Roadmap", href: "#roadmap" }
] as const;

export const platformNavItems = [
  { label: "Overview", href: "/", icon: Home, description: "Learning hub" },
  { label: "Tools", href: "/tools", icon: Compass, description: "All utilities" },
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
  }
] as const;

export const platformNavGroups = [
  {
    label: "Start",
    items: [platformNavItems[0]]
  },
  {
    label: "Addressing",
    items: [platformNavItems[2], platformNavItems[3]]
  },
  {
    label: "Protocols",
    items: [platformNavItems[4], platformNavItems[5], platformNavItems[6]]
  },
  {
    label: "Routing",
    items: [platformNavItems[7]]
  },
  {
    label: "Reference Tools",
    items: [platformNavItems[1]]
  }
] as const;

export const futureArchitectureItems = [
  { label: "Auth", icon: ShieldCheck },
  { label: "RBAC", icon: GitBranch },
  { label: "Analytics", icon: Gauge }
] as const;
