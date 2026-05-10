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
    <aside className="flex h-dvh min-h-0 flex-col gap-6 border-r border-border/25 bg-background/90 p-6 backdrop-blur-xl">
      <Link href="/" className="flex shrink-0 items-center gap-2.5 px-2 font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          A
        </span>
        <span>AckLab</span>
      </Link>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <nav className="grid gap-8 pb-2" aria-label="Platform navigation">
          {platformNavGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/55">
                {group.label}
              </p>
              <div className="grid gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary/30 hover:text-foreground",
                        active && "bg-primary/8 text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground/70 transition-colors",
                          active && "text-primary"
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="shrink-0 rounded-lg bg-secondary/20 p-4">
        <p className="text-xs font-medium text-foreground/80">Local MVP mode</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Mock data only. Auth, payments, storage, and APIs are represented by contracts.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">{sidebar}</div>
      ) : null}
      <div className="lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/25 bg-background/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              aria-label="Open navigation"
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <p className="text-sm text-muted-foreground">Learning workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4" />
              <span className="text-muted-foreground">Search</span>
              <kbd className="ml-1 rounded border border-border/50 bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
