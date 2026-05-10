"use client";

import { motion } from "framer-motion";

import type { TcpPacket } from "../lib/tcp-simulation";

export function TcpPacketAnimation({
  packet,
  reduceMotion,
  staticFrame = false
}: {
  packet: TcpPacket;
  reduceMotion: boolean | null;
  staticFrame?: boolean;
}) {
  const outbound = packet.direction === "outbound";
  const start = outbound ? "18%" : "74%";
  const end = outbound ? "74%" : "18%";

  return (
    <motion.div
      className="absolute top-[calc(50%-20px)] z-30 rounded-full border border-primary/25 bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20"
      initial={
        reduceMotion || staticFrame
          ? { left: end, opacity: 1, scale: 1 }
          : { left: start, opacity: 0, scale: 0.92 }
      }
      animate={{ left: end, opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion || staticFrame ? 0 : 0.72, ease: "easeInOut" }}
    >
      {packet.label}
    </motion.div>
  );
}
