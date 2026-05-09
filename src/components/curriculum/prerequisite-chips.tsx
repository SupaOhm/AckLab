import { Badge } from "@/components/ui/badge";
import { getModules } from "@/data/curriculum";

export function PrerequisiteChips({
  ids,
  label = "Prerequisites"
}: {
  ids: string[];
  label?: string;
}) {
  const modules = getModules(ids);

  if (modules.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {modules.map((module) => (
          <Badge key={module.id} variant="secondary">
            {module.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}
