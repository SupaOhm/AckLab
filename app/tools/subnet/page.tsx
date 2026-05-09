import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SubnetVisualizer } from "@/features/subnet/components/subnet-visualizer";

export const metadata = {
  title: "Subnet Visualizer"
};

export default function SubnetPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="IPv4 addressing"
        title="Subnet Visualizer"
        description="Understand how an IP address is split into network and host portions."
      />
      <SubnetVisualizer />
    </PlatformShell>
  );
}
