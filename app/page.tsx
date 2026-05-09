import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkPathDiagram } from "@/components/visualizations/network-path-diagram";
import { learningPaths, visualizerCards, roadmapItems } from "@/data/platform";

export default function HomePage() {
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
                Learn networking by watching packets move.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground">
                Practice subnetting, inspect protocol flows, and understand how data travels across
                networks — all through interactive visual tools you can use right now.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/tools/subnet">
                    Start with Subnetting
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/visualizers/tcp-handshake">Watch TCP Handshake</Link>
                </Button>
              </div>
              <p className="mt-8 text-sm leading-6 text-muted-foreground/70">
                Pick one concept, adjust the inputs, then read the explanation beside the diagram.
              </p>
            </div>
            <div className="hidden lg:block">
              <NetworkPathDiagram />
            </div>
          </div>
        </section>

        {/* Learning paths */}
        <section id="platform" className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Learning paths"
            title="Choose the concept you want to understand first."
            description="Each path starts with a working visual tool and a short explanation, so the concept is anchored to something you can change."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {learningPaths.map((path) => (
              <Card key={path.title} className="group transition-colors hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{path.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{path.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {path.tools.map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="ghost" className="mt-6 px-0 text-primary">
                    <Link href={path.href}>
                      Start path
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Visualizers */}
        <section id="visualizers" className="border-y border-border/15 bg-card/10">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Visualizers"
              title="See the hidden steps behind everyday networking."
              description="Animations are intentionally slow and step-based, so you can connect each packet movement to the reason it happens."
              action={
                <Button asChild variant="outline">
                  <Link href="/tools">Browse tools</Link>
                </Button>
              }
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {visualizerCards.map((card) => (
                <Link key={card.title} href={card.href}>
                  <Card className="group h-full transition-colors hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="success">{card.status}</Badge>
                        <span className="font-mono text-xs text-primary/60">{card.signal}</span>
                      </div>
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                </Link>
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
