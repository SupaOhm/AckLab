"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <Button aria-label="Toggle theme" size="icon" variant="ghost" suppressHydrationWarning>
        <Monitor className="size-4" />
      </Button>
    );
  }

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button
      aria-label={`Switch theme from ${theme ?? "system"}`}
      size="icon"
      variant="ghost"
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-4" />
    </Button>
  );
}
