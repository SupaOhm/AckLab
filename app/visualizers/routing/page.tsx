import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { RoutingVisualizer } from "@/features/networking/components/routing-visualizer";

export const metadata = {
  title: "Routing Visualizer"
};

export default function RoutingPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Routing MVP"
        title="Graph-based routing visualizer"
        description="Inspect a weighted router topology, highlight the shortest path, and animate packet forwarding through the selected route."
      />
      <RoutingVisualizer />
    </PlatformShell>
  );
}
