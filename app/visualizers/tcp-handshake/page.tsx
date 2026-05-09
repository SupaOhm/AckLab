import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TcpHandshakeVisualizer } from "@/features/tcp-handshake/components/tcp-handshake-visualizer";

export const metadata = {
  title: "TCP Socket Lab"
};

export default function TcpHandshakePage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Transport layer"
        title="TCP Socket Lab"
        description="Open a simulated connection, send data, inspect packets, and observe how TCP state changes."
      />
      <TcpHandshakeVisualizer />
    </PlatformShell>
  );
}
