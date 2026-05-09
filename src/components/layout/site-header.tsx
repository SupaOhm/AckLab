"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { marketingNavItems } from "@/constants/navigation";
import { useUiStore } from "@/store/ui-store";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-normal">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            A
          </span>
          <span>AckLab</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {marketingNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={() => setCommandOpen(true)}>
            <Search className="size-4" />
            <span className="text-muted-foreground">Search</span>
            <kbd className="ml-1 rounded border border-border/50 bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/learn/start">Start learning</Link>
          </Button>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            aria-label="Toggle navigation"
            size="icon"
            variant="ghost"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border/20 bg-background/95 px-6 py-4 md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {marketingNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-3">
              <Link href="/learn/start">Start learning</Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
