"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Binary, Calculator } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ExplanationPanel } from "@/components/shared/explanation-panel";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BitGroupVisualizer } from "@/components/visualizations/bit-group-visualizer";
import {
  binaryToDecimal,
  octetToBinary,
  parseIpv4Address
} from "@/features/binary/lib/binary-utils";

const binarySchema = z.object({
  decimal: z.number().min(0).max(255),
  binary: z.string().regex(/^[01]{1,8}$/, "Use up to 8 binary digits."),
  ip: z.string().refine((value) => Boolean(parseIpv4Address(value)), "Enter a valid IPv4 address.")
});

type BinaryForm = z.infer<typeof binarySchema>;

export function BinaryConverter() {
  const {
    control,
    setValue,
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
    <div className="grid gap-8">
      <ToolWorkspace
        title="Practice workspace"
        description="Convert one octet at a time, then inspect the four octets inside an IPv4 address."
      >
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-xl bg-background/38 p-5">
            <div className="mb-5 flex items-center gap-2">
              <Calculator className="size-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Enter values</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Use values from 0 to 255, the range of one IPv4 octet.
                </p>
              </div>
            </div>
            <div className="grid gap-5">
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
            </div>
          </section>

          <section className="rounded-xl bg-background/25 p-5">
            <div className="mb-6 flex items-center gap-2">
              <Binary className="size-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Decimal number to binary bits</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Each bit represents a power of two. Add the active bit values to get the decimal
                  number.
                </p>
              </div>
            </div>
            <motion.div layout className="grid gap-5">
              <div>
                <p className="text-sm text-muted-foreground">Decimal to binary</p>
                <p className="mt-2 font-mono text-4xl font-semibold text-primary">
                  {decimalValue} = {decimalBinary}
                </p>
              </div>
              <BitGroupVisualizer octets={[decimalBinary]} cidr={8} />
              <div className="rounded-lg bg-secondary/22 p-4">
                <p className="text-sm text-muted-foreground">Binary to decimal</p>
                <p className="mt-1 font-mono text-2xl font-semibold">
                  {binaryValue || "0"} = {binaryDecimal ?? "invalid"}
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </ToolWorkspace>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <ExplanationPanel title="IPv4 octets">
          {ipOctets ? (
            <div className="grid gap-3">
              {ipOctets.map((octet, index) => (
                <div key={`${index}-${octet}`} className="flex items-center justify-between gap-4">
                  <span>Octet {index + 1}</span>
                  <span className="font-mono text-foreground">
                    {octet} → {octetToBinary(octet)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Enter a valid IPv4 address to see each octet as 8 bits.</p>
          )}
        </ExplanationPanel>
        <PracticePrompt prompt="Try converting 192, 168, 1, and 1. Which bits are active in each octet?">
          {[0, 1, 127, 192, 255].map((example) => (
            <Button
              key={example}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setValue("decimal", example, { shouldValidate: true });
                setValue("binary", octetToBinary(example), { shouldValidate: true });
              }}
            >
              {example}
            </Button>
          ))}
        </PracticePrompt>
      </div>
    </div>
  );
}
