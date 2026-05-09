"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Binary, Network } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { BitGrid } from "@/components/visualizations/bit-grid";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateSubnet, parseIpv4Address } from "@/features/networking/lib/ip-utils";

const subnetSchema = z.object({
  ip: z.string().refine((value) => Boolean(parseIpv4Address(value)), "Enter a valid IPv4 address."),
  cidr: z.number().min(0).max(32)
});

type SubnetForm = z.infer<typeof subnetSchema>;

export function SubnetVisualizer() {
  const {
    control,
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
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="size-5 text-primary" />
            <CardTitle>Subnet Input</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
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
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>/0</span>
                  <span>/16</span>
                  <span>/32</span>
                </div>
              </div>
            )}
          />
          <div className="rounded-lg border border-border/70 bg-secondary/35 p-4">
            <p className="text-sm font-medium">Network bits vs host bits</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Blue cells identify the fixed network prefix. Green cells show the variable host space
              available inside the subnet.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {result ? (
          <>
            <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Network" value={result.networkAddress} />
              <MetricCard label="Broadcast" value={result.broadcastAddress} />
              <MetricCard label="Subnet Mask" value={result.subnetMask} />
              <MetricCard label="Total Hosts" value={result.totalHosts.toLocaleString()} />
              <MetricCard label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
              <MetricCard
                label="Host Range"
                value={`${result.firstUsableHost} - ${result.lastUsableHost}`}
              />
            </motion.div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Binary className="size-5 text-primary" />
                  <CardTitle>Binary Address Segments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    IPv4 bits
                  </p>
                  <BitGrid octets={result.binaryIp} cidr={result.cidr} />
                </div>
                <div className="grid gap-2 rounded-lg border border-border/70 bg-secondary/30 p-4 font-mono text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">IP</span>
                    <span>{result.binaryIp.join(".")}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Mask</span>
                    <span>{result.binaryMask.join(".")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Enter a valid IPv4 address to calculate subnet details.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
