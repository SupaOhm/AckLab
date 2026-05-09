"use client";

import { motion } from "framer-motion";

const points = [
  { x: "12%", y: "28%" },
  { x: "28%", y: "62%" },
  { x: "48%", y: "35%" },
  { x: "66%", y: "68%" },
  { x: "84%", y: "30%" }
];

export function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="network-grid absolute inset-0 opacity-70" />
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <polyline
          points="12,28 28,62 48,35 66,68 84,30"
          vectorEffect="non-scaling-stroke"
          className="text-primary"
          fill="none"
          stroke="url(#line-gradient)"
          strokeWidth="0.45"
        />
      </svg>
      {points.map((point, index) => (
        <motion.div
          key={`${point.x}-${point.y}`}
          className="absolute size-3 rounded-full bg-primary shadow-[0_0_28px_var(--primary)]"
          style={{ left: point.x, top: point.y }}
          animate={{ scale: [1, 1.7, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.28 }}
        />
      ))}
      <motion.div
        className="absolute left-[12%] top-[28%] size-2 rounded-full bg-accent"
        animate={{
          left: ["12%", "28%", "48%", "66%", "84%"],
          top: ["28%", "62%", "35%", "68%", "30%"]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
