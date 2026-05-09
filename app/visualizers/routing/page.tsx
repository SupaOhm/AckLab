import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { RoutingVisualizer } from "@/features/routing/components/routing-visualizer";

export const metadata = {
  title: "Routing Visualizer"
};

export default function RoutingPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Routing MVP"
        title="Routing Visualizer"
        description="Watch a packet follow the lowest-cost known path from source to destination."
      />
      <RoutingVisualizer />
    </PlatformShell>
  );
}
