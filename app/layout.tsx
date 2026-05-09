import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CommandMenu } from "@/components/layout/command-menu";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { appConfig } from "@/config/app";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AckLab | Interactive Networking Fundamentals",
    template: "%s | AckLab"
  },
  description:
    "A premium interactive platform for learning networking fundamentals through simulations, visualizations, and tools.",
  metadataBase: new URL(appConfig.url)
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
