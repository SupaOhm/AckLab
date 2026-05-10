import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const securityModules: CurriculumModule[] = [
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
  ["packet-sniffing-concept", "Packet sniffing concept", "Observing packets on a network segment."]
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
);
