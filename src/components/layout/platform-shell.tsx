"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { platformNavGroups } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  const sidebar = (
    <aside className="flex h-full flex-col gap-7 border-r border-border/45 bg-background/82 p-5 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 px-2 font-semibold">
        <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
          A
        </span>
        <span>AckLab</span>
      </Link>
      <nav className="grid gap-6" aria-label="Platform navigation">
        {platformNavGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
              {group.label}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/35 hover:text-foreground",
                      active && "bg-primary/10 text-foreground ring-1 ring-primary/16"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors",
                        active && "text-primary"
                      )}
                    />
                    <span>
                      <span className="block font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground/75">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto rounded-xl bg-secondary/28 p-4">
        <p className="text-xs font-medium text-foreground">Local MVP mode</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Mock data only. Auth, payments, storage, and APIs are represented by contracts.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[280px] lg:block">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">{sidebar}</div>
      ) : null}
      <div className="lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/45 bg-background/78 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Open navigation"
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <p className="text-sm font-medium">Learning workspace</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                One tool, one concept, one packet path at a time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4" />
              Command
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
