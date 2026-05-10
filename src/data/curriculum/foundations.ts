import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const foundationModules: CurriculumModule[] = [
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
  })
];
