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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-normal">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            A
          </span>
          <span>AckLab</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {marketingNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" onClick={() => setCommandOpen(true)}>
            <Search className="size-4" />
            Command
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              K
            </kbd>
          </Button>
          <ThemeToggle />
          <Button asChild>
            <Link href="/tools">Launch tools</Link>
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
        <div className="border-t border-border/70 bg-background/95 px-4 py-4 md:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {marketingNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/tools">Launch tools</Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
