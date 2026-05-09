import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ToolCard } from "@/components/shared/tool-card";
import { toolCards } from "@/data/platform";

export const metadata = {
  title: "Network Tools"
};

export default function ToolsPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Tool dashboard"
        title="Networking utilities for fast concept checks."
        description="Use live MVP tools today and preview the diagnostic utilities planned for future platform expansion."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {toolCards.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </PlatformShell>
  );
}
