import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SubnetVisualizer } from "@/features/networking/components/subnet-visualizer";

export const metadata = {
  title: "Subnet Visualizer"
};

export default function SubnetPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="IPv4 addressing"
        title="Interactive subnet visualizer"
        description="Adjust an IPv4 address and CIDR prefix to see masks, ranges, host capacity, and the binary network/host split in real time."
      />
      <SubnetVisualizer />
    </PlatformShell>
  );
}
