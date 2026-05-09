"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { platformNavItems } from "@/constants/navigation";
import { useUiStore } from "@/store/ui-store";

export function CommandMenu() {
  const router = useRouter();
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-background/70 px-4 pt-24 backdrop-blur-sm">
      <Command
        label="AckLab command menu"
        className="mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder="Jump to a tool or visualizer..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
            No matching route.
          </Command.Empty>
          <Command.Group heading="Navigate" className="text-xs text-muted-foreground">
            {platformNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Command.Item
                  key={item.href}
                  value={`${item.label} ${item.href}`}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground aria-selected:bg-secondary"
                  onSelect={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  {item.label}
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>
      </Command>
      <button
        aria-label="Close command menu"
        className="fixed inset-0 -z-10"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}
