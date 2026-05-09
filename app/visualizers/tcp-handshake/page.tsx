import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TcpHandshakeVisualizer } from "@/features/networking/components/tcp-handshake-visualizer";

export const metadata = {
  title: "TCP Handshake Visualizer"
};

export default function TcpHandshakePage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Transport layer"
        title="TCP 3-way handshake visualizer"
        description="Play through SYN, SYN-ACK, and ACK packet traversal to see how TCP establishes a reliable connection."
      />
      <TcpHandshakeVisualizer />
    </PlatformShell>
  );
}
