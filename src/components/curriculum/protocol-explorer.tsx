import { ModuleCard } from "@/components/curriculum/module-card";
import { getModules } from "@/data/curriculum";

export function ProtocolExplorer({ moduleIds }: { moduleIds: string[] }) {
  const modules = getModules(moduleIds);

  return (
    <section id="protocols" className="scroll-mt-24">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Protocol Explorer</h2>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">
          Jump straight to the protocols behind everyday network behavior.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} compact />
        ))}
      </div>
    </section>
  );
}
