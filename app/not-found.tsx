import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Route not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This lab route is not available in the local mock MVP.
        </p>
        <Button asChild className="mt-6">
          <Link href="/tools">Return to tools</Link>
        </Button>
      </div>
    </main>
  );
}
