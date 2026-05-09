import { publicEnv } from "@/config/env";

export const appConfig = {
  name: "AckLab",
  description: "Interactive networking fundamentals learning and simulation platform.",
  url: publicEnv.appUrl,
  defaultTheme: "dark"
} as const;
