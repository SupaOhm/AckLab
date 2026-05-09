import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { DnsFlowVisualizer } from "@/features/dns/components/dns-flow-visualizer";

export const metadata = {
  title: "DNS Flow Visualizer"
};

export default function DnsFlowPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Name resolution"
        title="DNS Flow Visualizer"
        description="Follow the step-by-step lookup that turns a domain name into an IP address."
      />
      <DnsFlowVisualizer />
    </PlatformShell>
  );
}
