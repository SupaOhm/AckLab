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
        eyebrow="Reference tools"
        title="Choose a networking concept to practice."
        description="Live tools are organized by the concept they teach. Coming-soon tools preview future reference and diagnostics workflows."
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {toolCards.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </PlatformShell>
  );
}
