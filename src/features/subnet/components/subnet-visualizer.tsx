"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Network } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BitGroupVisualizer } from "@/components/visualizations/bit-group-visualizer";
import { calculateSubnet } from "@/features/subnet/lib/subnet-utils";
import { parseIpv4Address } from "@/lib/networking/ipv4";

const subnetSchema = z.object({
  ip: z.string().refine((value) => Boolean(parseIpv4Address(value)), "Enter a valid IPv4 address."),
  cidr: z.number().min(0).max(32)
});

type SubnetForm = z.infer<typeof subnetSchema>;

export function SubnetVisualizer() {
  const {
    control,
    setValue,
    register,
    formState: { errors }
  } = useForm<SubnetForm>({
    resolver: zodResolver(subnetSchema),
    mode: "onChange",
    defaultValues: {
      ip: "192.168.10.42",
      cidr: 24
    }
  });

  const values = useWatch({ control });
  const ipValue = values.ip ?? "192.168.10.42";
  const cidrValue = values.cidr ?? 24;
  const result = useMemo(() => calculateSubnet(ipValue, cidrValue), [ipValue, cidrValue]);

  return (
    <div className="grid gap-10">
      <ToolWorkspace
        title="Interactive workspace"
        description="Change the address or prefix length and watch the network and host portions separate."
      >
        <div className="grid gap-8 xl:grid-cols-[280px_1fr_300px]">
          {/* Controls — left column */}
          <section className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Network className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Try an address</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Start with an IP address and choose how many leading bits identify the network.
            </p>

            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="ip">IPv4 address</Label>
                <Input id="ip" placeholder="192.168.10.42" {...register("ip")} />
                {errors.ip ? <p className="text-sm text-destructive">{errors.ip.message}</p> : null}
              </div>
              <Controller
                control={control}
                name="cidr"
                render={({ field }) => (
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cidr">CIDR prefix</Label>
                      <Badge variant="outline">/{field.value}</Badge>
                    </div>
                    <Slider
                      id="cidr"
                      min={0}
                      max={32}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/60">
                      <span>/0</span>
                      <span>/16</span>
                      <span>/32</span>
                    </div>
                  </div>
                )}
              />
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-muted-foreground">Examples</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ["192.168.1.10", 24],
                    ["10.0.0.5", 8],
                    ["172.16.4.20", 20]
                  ].map(([ip, cidr]) => (
                    <Button
                      key={`${ip}/${cidr}`}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setValue("ip", String(ip), { shouldValidate: true });
                        setValue("cidr", Number(cidr), { shouldValidate: true });
                      }}
                    >
                      {ip}/{cidr}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bit visualization — center (primary focus) */}
          <section className="min-w-0 space-y-5">
            <div>
              <h2 className="text-sm font-semibold">Bits breakdown</h2>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                The first {cidrValue} bits are the network prefix. The remaining {32 - cidrValue}{" "}
                bits are host space.
              </p>
            </div>
            {result ? (
              <div className="space-y-5">
                <BitGroupVisualizer octets={result.binaryIp} cidr={result.cidr} />
                <p className="rounded-lg bg-secondary/12 p-4 text-sm leading-7 text-muted-foreground">
                  /{result.cidr} means the first {result.cidr} bits identify the network. The
                  remaining {32 - result.cidr} bits are available for host addresses inside that
                  network.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter a valid IPv4 address to visualize its bits.
              </p>
            )}
          </section>

          {/* Results — right column */}
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold">Result</h2>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                Network address and host range for this subnet.
              </p>
            </div>
            {result ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground">Network address</p>
                  <p className="mt-1.5 font-mono text-2xl font-semibold text-primary">
                    {result.networkAddress}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Usable host range</p>
                  <p className="mt-1.5 font-mono text-sm leading-7">
                    {result.firstUsableHost}
                    <br />
                    to {result.lastUsableHost}
                  </p>
                </div>
                <dl className="space-y-3 border-t border-border/15 pt-5 text-sm">
                  <Detail label="Subnet mask" value={result.subnetMask} />
                  <Detail label="Broadcast" value={result.broadcastAddress} />
                  <Detail label="Total hosts" value={result.totalHosts.toLocaleString()} />
                  <Detail label="Usable hosts" value={result.usableHosts.toLocaleString()} />
                </dl>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Results appear after valid input.</p>
            )}
          </section>
        </div>
      </ToolWorkspace>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <ExplanationPanel title="What to notice">
          {result ? (
            <p>
              The CIDR prefix fixes the network portion of the address. Every host in{" "}
              <span className="font-mono text-foreground">
                {result.networkAddress}/{result.cidr}
              </span>{" "}
              shares those prefix bits, while the host bits change to identify devices.
            </p>
          ) : (
            <p>Enter a valid IPv4 address to see how the network and host portions are split.</p>
          )}
        </ExplanationPanel>
        <PracticePrompt prompt="Change the prefix from /24 to /25. What happens to the usable host count and why?" />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-foreground">{value}</dd>
    </div>
  );
}
