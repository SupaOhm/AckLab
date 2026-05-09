import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { OsiModelVisualizer } from "@/features/osi/components/osi-model-visualizer";

export const metadata = {
  title: "OSI Model Visualizer"
};

export default function OsiModelPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Layer model"
        title="OSI Model Visualizer"
        description="See how each layer adds meaning as data moves from an application toward the wire."
      />
      <OsiModelVisualizer />
    </PlatformShell>
  );
}
