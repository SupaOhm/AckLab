import { StartLearningFlow } from "@/components/curriculum/start-learning-flow";
import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = {
  title: "Start Learning"
};

export default function StartLearningPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Beginner start"
        title="Start with the first three steps."
        description="Open a lab, mark it complete, then continue to what comes next."
      />
      <StartLearningFlow />
    </PlatformShell>
  );
}
