import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const transportModules: CurriculumModule[] = [
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
);

export const transportLabModules: CurriculumModule[] = [
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
  })
];
