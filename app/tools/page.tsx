import { ModuleCard } from "@/components/curriculum/module-card";
import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { getModules, labModuleIds } from "@/data/curriculum";

export const metadata = {
  title: "Network Tools"
};

export default function ToolsPage() {
  const modules = getModules(labModuleIds);
  const available = modules.filter((module) => module.status === "unlocked");
  const protocolLabs = modules.filter(
    (module) =>
      module.status !== "unlocked" &&
      [
        "arp-broadcast-lab",
        "nat-translation-lab",
        "http-request-lab",
        "tls-handshake-lab",
        "dhcp-lease-lab",
        "icmp-ping-lab"
      ].includes(module.id)
  );
  const comingSoon = modules.filter(
    (module) => module.status !== "unlocked" && !protocolLabs.some((lab) => lab.id === module.id)
  );

  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Labs & tools"
        title="Practice networking with interactive labs."
        description="Unlocked tools are available now. Locked labs show what is planned next."
      />

      <div className="grid gap-14">
        <ToolSection title="Available now" modules={available} />
        <ToolSection title="Protocol labs" modules={protocolLabs} compact />
        <ToolSection title="Coming soon" modules={comingSoon} compact />
      </div>
    </PlatformShell>
  );
}

function ToolSection({
  title,
  modules,
  compact = false
}: {
  title: string;
  modules: ReturnType<typeof getModules>;
  compact?: boolean;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} compact={compact} />
        ))}
      </div>
    </section>
  );
}
