import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PrerequisiteChips } from "@/components/curriculum/prerequisite-chips";
import { StatusBadge } from "@/components/curriculum/status-badge";
import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  curriculumModules,
  getModuleById,
  getModules,
  getUnlockedModules
} from "@/data/curriculum";
import { getCurriculumAvailability } from "@/lib/curriculum-status";

interface ModulePageProps {
  params: Promise<{
    module: string;
  }>;
}

export async function generateStaticParams() {
  return curriculumModules.map((module) => ({ module: module.id }));
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { module: moduleId } = await params;
  const currentModule = getModuleById(moduleId);

  return {
    title: currentModule ? currentModule.title : "Module"
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module: moduleId } = await params;
  const currentModule = getModuleById(moduleId);

  if (!currentModule) {
    notFound();
  }

  if (
    currentModule.status === "unlocked" &&
    currentModule.route &&
    currentModule.route !== `/learn/${currentModule.id}`
  ) {
    redirect(currentModule.route as Route);
  }

  const related = getModules(currentModule.relatedModules).filter(
    (item) => item.status === "unlocked"
  );
  const fallbackLabs = getUnlockedModules().slice(0, 3);
  const suggested = related.length > 0 ? related : fallbackLabs;
  const availability = getCurriculumAvailability(currentModule);
  const isPlannedLab = availability === "comingSoon";

  return (
    <PlatformShell>
      <PageHeader
        eyebrow={currentModule.category}
        title={currentModule.title}
        description={currentModule.shortDescription}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="rounded-xl border border-border/20 bg-card/25 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge availability={availability} />
            <Badge variant="secondary">{currentModule.difficulty}</Badge>
            <Badge variant="outline">{currentModule.estimatedTime}</Badge>
            {currentModule.osiLayer ? (
              <Badge variant="outline">Layer {currentModule.osiLayer}</Badge>
            ) : null}
          </div>

          <div className="mt-10 grid min-h-64 place-items-center rounded-xl border border-dashed border-border/30 bg-secondary/10 p-8 text-center">
            <div className="max-w-md">
              <LockKeyhole className="mx-auto size-10 text-primary/70" />
              <h2 className="mt-5 text-xl font-semibold">
                {isPlannedLab ? "Coming soon" : "Locked for now"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isPlannedLab
                  ? "This interactive lab is part of the Network Fundamentals Map, but it is not built yet."
                  : "This concept is visible in the learning map now. Its full lesson flow is still being assembled."}
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/learn">
                  Back to map
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-border/20 bg-card/25 p-5">
            <PrerequisiteChips ids={currentModule.prerequisites} />
          </section>

          <section className="rounded-xl border border-border/20 bg-card/25 p-5">
            <p className="text-sm font-semibold">Try now</p>
            <div className="mt-4 grid gap-3">
              {suggested.map((item) => (
                <Button key={item.id} asChild variant="outline" className="justify-between">
                  <Link href={(item.route ?? `/learn/${item.id}`) as Route}>
                    {item.title}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PlatformShell>
  );
}
