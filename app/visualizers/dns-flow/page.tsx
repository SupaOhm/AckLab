import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { DnsFlowVisualizer } from "@/features/networking/components/dns-flow-visualizer";

export const metadata = {
  title: "DNS Flow Visualizer"
};

export default function DnsFlowPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Name resolution"
        title="DNS flow visualizer"
        description="Follow a recursive DNS lookup from browser cache through resolver, root, TLD, and authoritative nameserver."
      />
      <DnsFlowVisualizer />
    </PlatformShell>
  );
}
