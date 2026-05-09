import { ModuleCard } from "@/components/curriculum/module-card";
import { getModules } from "@/data/curriculum";

interface CurriculumMapProps {
  title: string;
  description: string;
  moduleIds: string[];
  id?: string;
}

export function CurriculumMap({ title, description, moduleIds, id }: CurriculumMapProps) {
  const modules = getModules(moduleIds);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-[68ch] text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="relative mt-8">
        <div className="absolute left-4 top-4 hidden h-[calc(100%-2rem)] w-px bg-border/30 md:block" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div key={module.id} className="relative">
              <span className="absolute -left-[3px] top-8 hidden size-2 rounded-full bg-primary md:block" />
              <ModuleCard module={module} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
