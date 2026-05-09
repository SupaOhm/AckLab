import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BinaryConverter } from "@/features/networking/components/binary-converter";

export const metadata = {
  title: "Binary Converter"
};

export default function BinaryPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Binary foundations"
        title="Binary converter"
        description="Convert decimal octets, inspect binary values, and map IPv4 addresses into their underlying 8-bit segments."
      />
      <BinaryConverter />
    </PlatformShell>
  );
}
