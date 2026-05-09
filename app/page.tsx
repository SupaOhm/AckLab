import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkBackground } from "@/components/visualizations/network-background";
import { NetworkPathDiagram } from "@/components/visualizations/network-path-diagram";
import { learningPaths, roadmapItems, visualizerCards } from "@/data/platform";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border/45">
          <NetworkBackground />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="outline" className="bg-background/40">
                Interactive networking fundamentals
              </Badge>
              <h1 className="mt-6 text-5xl font-semibold tracking-normal text-foreground sm:text-6xl">
                Learn networking by watching packets move.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Practice subnetting, inspect protocol flows, and understand how data travels across
                networks through interactive visual tools.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              <p className="mt-6 max-w-xl text-sm leading-6 text-muted-foreground">
                Start with one concept, adjust the inputs, then read the explanation beside the
                moving diagram.
              </p>
            </div>
            <NetworkPathDiagram />
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Learning paths"
            title="Choose the concept you want to understand first."
            description="Each path starts with a working visual tool and a short explanation, so the concept is anchored to something you can change."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {learningPaths.map((path) => (
              <Card
                key={path.title}
                className="group h-full transition-colors hover:border-primary/35"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge variant="secondary">{path.difficulty}</Badge>
                  </div>
                  <CardTitle>{path.title}</CardTitle>
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

        <section id="visualizers" className="border-y border-border/45 bg-card/18">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
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
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {visualizerCards.map((card) => (
                <Link key={card.title} href={card.href}>
                  <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/10">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="success">{card.status}</Badge>
                        <span className="font-mono text-xs text-primary">{card.signal}</span>
                      </div>
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Roadmap"
              title="Clean MVP today, scalable platform tomorrow."
              description="Backend, payments, authentication, analytics, and persistence are intentionally not implemented. Their contracts and folders are present so the platform can grow without a rewrite."
            />
            <div className="grid gap-3">
              {roadmapItems.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border/70 bg-card/60 p-4 text-sm"
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
