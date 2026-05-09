import { PlatformShell } from "@/components/layout/platform-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BinaryConverter } from "@/features/binary/components/binary-converter";

export const metadata = {
  title: "Binary Converter"
};

export default function BinaryPage() {
  return (
    <PlatformShell>
      <PageHeader
        eyebrow="Binary foundations"
        title="Binary Converter"
        description="Practice how decimal octets become binary bits and why each bit position matters."
      />
      <BinaryConverter />
    </PlatformShell>
  );
}
