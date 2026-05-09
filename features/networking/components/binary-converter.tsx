"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Binary, Calculator } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { BitGrid } from "@/components/visualizations/bit-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  binaryToDecimal,
  octetToBinary,
  parseIpv4Address
} from "@/features/networking/lib/ip-utils";

const binarySchema = z.object({
  decimal: z.number().min(0).max(255),
  binary: z.string().regex(/^[01]{1,8}$/, "Use up to 8 binary digits."),
  ip: z.string().refine((value) => Boolean(parseIpv4Address(value)), "Enter a valid IPv4 address.")
});

type BinaryForm = z.infer<typeof binarySchema>;

export function BinaryConverter() {
  const {
    control,
    register,
    formState: { errors }
  } = useForm<BinaryForm>({
    resolver: zodResolver(binarySchema),
    mode: "onChange",
    defaultValues: {
      decimal: 172,
      binary: "10101100",
      ip: "172.16.4.9"
    }
  });

  const values = useWatch({ control });
  const decimalValue = values.decimal ?? 0;
  const binaryValue = values.binary ?? "";
  const ipValue = values.ip ?? "";
  const decimalBinary = Number.isFinite(Number(decimalValue))
    ? octetToBinary(Math.min(Math.max(Number(decimalValue), 0), 255))
    : "00000000";
  const binaryDecimal = binaryToDecimal(binaryValue);
  const ipOctets = useMemo(() => parseIpv4Address(ipValue), [ipValue]);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            <CardTitle>Conversion Console</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="decimal">Decimal octet</Label>
            <Input
              id="decimal"
              inputMode="numeric"
              type="number"
              {...register("decimal", { valueAsNumber: true })}
            />
            {errors.decimal ? (
              <p className="text-sm text-destructive">{errors.decimal.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="binary">Binary octet</Label>
            <Input id="binary" inputMode="numeric" {...register("binary")} />
            {errors.binary ? (
              <p className="text-sm text-destructive">{errors.binary.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ip">IPv4 address</Label>
            <Input id="ip" {...register("ip")} />
            {errors.ip ? <p className="text-sm text-destructive">{errors.ip.message}</p> : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Binary className="size-5 text-primary" />
              <CardTitle>Bit Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <motion.div layout className="rounded-lg border border-border/70 bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">Decimal to binary</p>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {decimalValue} = {decimalBinary}
              </p>
              <BitGrid octets={[decimalBinary]} cidr={8} />
            </motion.div>
            <motion.div layout className="rounded-lg border border-border/70 bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">Binary to decimal</p>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {binaryValue || "0"} = {binaryDecimal ?? "invalid"}
              </p>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IPv4 Octets</CardTitle>
          </CardHeader>
          <CardContent>
            {ipOctets ? (
              <div className="grid gap-3">
                {ipOctets.map((octet, index) => (
                  <div
                    key={`${index}-${octet}`}
                    className="flex flex-col gap-2 rounded-md border border-border/70 bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-mono text-sm">
                      Octet {index + 1}: {octet}
                    </span>
                    <span className="font-mono text-sm text-primary">{octetToBinary(octet)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a valid IPv4 address.</p>
            )}
            <div className="mt-5 rounded-lg border border-border/70 bg-secondary/35 p-4">
              <p className="text-sm font-medium">Why bits matter</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                IPv4 addresses are four 8-bit octets. Subnet masks reserve leading bits for the
                network and leave remaining bits for host addressing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
