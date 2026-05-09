import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TcpHandshakeVisualizer } from "@/features/tcp-handshake/components/tcp-handshake-visualizer";

export const metadata = {
  title: "TCP Handshake Visualizer"
};

export default function TcpHandshakePage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Transport layer"
        title="TCP 3-Way Handshake"
        description="Watch the three packets that establish a reliable TCP connection before data is sent."
      />
      <TcpHandshakeVisualizer />
    </PlatformShell>
  );
}
