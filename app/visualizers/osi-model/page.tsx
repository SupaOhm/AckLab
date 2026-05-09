import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { OsiModelVisualizer } from "@/features/networking/components/osi-model-visualizer";

export const metadata = {
  title: "OSI Model Visualizer"
};

export default function OsiModelPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Layer model"
        title="OSI model visualizer"
        description="Click each OSI layer, inspect protocol examples, and animate packet encapsulation through the seven-layer stack."
      />
      <OsiModelVisualizer />
    </PlatformShell>
  );
}
