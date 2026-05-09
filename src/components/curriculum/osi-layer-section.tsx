import { ModuleCard } from "@/components/curriculum/module-card";
import { getModules } from "@/data/curriculum";
import type { LearningPath } from "@/types/curriculum";

export function OsiLayerSection({ paths }: { paths: LearningPath[] }) {
  return (
    <section id="osi-map" className="scroll-mt-24">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">OSI Layer Path</h2>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">
          Browse concepts by where they operate in the stack.
        </p>
      </div>
      <div className="mt-8 grid gap-4">
        {paths.map((path) => {
          const modules = getModules(path.moduleIds);

          return (
            <section
              key={path.id}
              className="grid gap-4 rounded-xl border border-border/20 bg-card/20 p-4 lg:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="font-mono text-xs text-primary">
                  {path.id.replace("osi-layer-", "L")}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{path.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{path.shortDescription}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {modules.slice(0, 6).map((module) => (
                  <ModuleCard key={module.id} module={module} compact />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
