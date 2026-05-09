import type { FlowStep } from "@/types/networking";

export const dnsFlowSteps: FlowStep[] = [
  {
    id: "browser",
    title: "Browser checks cache",
    description:
      "The browser and OS cache are checked before any network request leaves the device."
  },
  {
    id: "resolver",
    title: "Recursive resolver",
    description: "The resolver accepts the query and coordinates the remaining lookup steps."
  },
  {
    id: "root",
    title: "Root server referral",
    description: "A root server points the resolver toward the top-level domain nameserver."
  },
  {
    id: "tld",
    title: "TLD referral",
    description: "The TLD server returns the authoritative nameserver for the target domain."
  },
  {
    id: "auth",
    title: "Authoritative answer",
    description: "The authoritative server returns the record, usually with a TTL for caching."
  },
  {
    id: "response",
    title: "Answer returned",
    description: "The resolver sends the IP address back so the browser can connect."
  }
];
