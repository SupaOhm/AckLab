import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const upperLayerConceptModules: CurriculumModule[] = [
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
);

export const applicationProtocolModules: CurriculumModule[] = [
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
);

export const applicationLabModules: CurriculumModule[] = [
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
  })
];
