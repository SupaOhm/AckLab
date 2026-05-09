import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";

import { GoalPathSelector } from "@/components/curriculum/goal-path-selector";
import { ModuleCard } from "@/components/curriculum/module-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NetworkPathDiagram } from "@/components/visualizations/network-path-diagram";
import {
  beginnerPath,
  getLockedModules,
  getModules,
  getUnlockedModules,
  goalPaths
} from "@/data/curriculum";
import { roadmapItems } from "@/data/platform";

export default function HomePage() {
  const beginnerModules = getModules(beginnerPath.moduleIds).slice(0, 6);
  const unlockedLabs = getUnlockedModules();
  const lockedPreview = getLockedModules().slice(0, 8);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero — learning-focused entry */}
        <section className="relative overflow-hidden border-b border-border/20">
          <div className="relative mx-auto grid max-w-6xl content-center gap-16 px-6 py-28 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-36">
            <div className="max-w-xl">
              <Badge variant="outline" className="bg-background/40">
                Interactive networking fundamentals
              </Badge>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
                Learn networking by causing packets to move.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground">
                Practice subnetting, trigger protocol flows, and understand how data travels across
                networks through interactive labs you can control.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/tools/binary">
                    Start with Binary
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/learn">
                    Open Learning Map
                    <Map className="size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-8 text-sm leading-6 text-muted-foreground/70">
                Pick a concept, create a network event, inspect the packet, then read why it
                happened.
              </p>
            </div>
            <div className="hidden lg:block">
              <NetworkPathDiagram />
            </div>
          </div>
        </section>

        {/* Network fundamentals map */}
        <section id="platform" className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Network Fundamentals Map"
            title="Start your networking journey in order."
            description="The map shows what is available now, what comes next, and how each concept connects."
            action={
              <Button asChild variant="outline">
                <Link href="/learn">View full map</Link>
              </Button>
            }
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {beginnerModules.map((module) => (
              <ModuleCard key={module.id} module={module} compact />
            ))}
          </div>
        </section>

        {/* Available labs */}
        <section id="visualizers" className="border-y border-border/15 bg-card/10">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Unlocked now"
              title="Open the labs available in this MVP."
              description="These modules link to working interactive tools. Locked modules remain visible in the full map."
              action={
                <Button asChild variant="outline">
                  <Link href="/tools">Browse tools</Link>
                </Button>
              }
            />
            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {unlockedLabs.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
          <GoalPathSelector paths={goalPaths} />
        </section>

        <section className="border-y border-border/15 bg-card/10">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Coming later"
              title="Locked modules preview the full curriculum."
              description="AckLab keeps future concepts visible without pretending they are implemented."
            />
            <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {lockedPreview.map((module) => (
                <ModuleCard key={module.id} module={module} compact />
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Roadmap"
              title="Clean MVP today, scalable platform tomorrow."
              description="Backend, payments, authentication, analytics, and persistence are intentionally not implemented. Their contracts and folders are present so the platform can grow without a rewrite."
            />
            <div className="grid gap-3">
              {roadmapItems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border/20 bg-card/25 p-4 text-sm leading-7"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
