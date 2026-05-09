import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              A
            </span>
            <span>AckLab</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Interactive networking fundamentals, visual simulations, and practical tools for
            developers and infrastructure teams.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-medium">Visualizers</p>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/visualizers/tcp-handshake"
          >
            TCP handshake
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/visualizers/osi-model"
          >
            OSI model
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/visualizers/dns-flow"
          >
            DNS flow
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-medium">Tools</p>
          <Link className="text-muted-foreground hover:text-foreground" href="/tools/subnet">
            Subnet visualizer
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/tools/binary">
            Binary converter
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/tools">
            Tool dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
