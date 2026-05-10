import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ArpBroadcastVisualizer } from "@/features/arp/components/arp-broadcast-visualizer";

export const metadata = {
  title: "ARP Broadcast Lab"
};

export default function ArpBroadcastPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Data Link Layer"
        title="ARP Broadcast Lab"
        description="Watch a host discover the MAC address behind a local IPv4 address."
      />
      <ArpBroadcastVisualizer />
    </PlatformShell>
  );
}
