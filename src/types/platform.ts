import type { Route } from "next";

export type CardStatus = "Live" | "Coming Soon";

export interface ToolCard {
  title: string;
  description: string;
  href: Route;
  status: CardStatus;
  category: string;
}

export interface VisualizerCard {
  title: string;
  description: string;
  href: Route;
  status: CardStatus;
  signal: string;
}
