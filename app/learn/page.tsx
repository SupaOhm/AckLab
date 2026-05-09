import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { CurriculumMap } from "@/components/curriculum/curriculum-map";
import { GoalPathSelector } from "@/components/curriculum/goal-path-selector";
import { LearningPathCard } from "@/components/curriculum/learning-path-card";
import { ModuleCard } from "@/components/curriculum/module-card";
import { OsiLayerSection } from "@/components/curriculum/osi-layer-section";
import { ProtocolExplorer } from "@/components/curriculum/protocol-explorer";
import {
  beginnerPath,
  getModules,
  goalPaths,
  labModuleIds,
  osiLayerPath,
  protocolExplorerIds
} from "@/data/curriculum";

export const metadata = {
  title: "Network Fundamentals Map"
};

export default function LearnPage() {
  const labs = getModules(labModuleIds);
  const unlockedLabs = labs.filter((module) => module.status === "unlocked");
  const lockedLabs = labs.filter((module) => module.status !== "unlocked");

  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Network Fundamentals Map"
        title="A guided map of networking knowledge."
        description="Follow the recommended path, browse by layer or protocol, and open the labs that are available now."
      />

      <div className="grid gap-16">
        <LearningPathCard path={beginnerPath} />

        <CurriculumMap
          id="beginner"
          title="Beginner Path"
          description="The recommended order for building a mental model from bits to applications."
          moduleIds={beginnerPath.moduleIds}
        />

        <OsiLayerSection paths={osiLayerPath} />

        <ProtocolExplorer moduleIds={protocolExplorerIds} />

        <section id="labs" className="scroll-mt-24">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Labs & Tools</h2>
            <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">
              Current MVP labs are active. Future simulations stay visible as locked map nodes.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {unlockedLabs.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {lockedLabs.map((module) => (
              <ModuleCard key={module.id} module={module} compact />
            ))}
          </div>
        </section>

        <GoalPathSelector paths={goalPaths} />
      </div>
    </PlatformShell>
  );
}
