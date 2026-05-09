export function parseIpv4Address(value: string): number[] | null {
  const parts = value.trim().split(".");

  if (parts.length !== 4) {
    return null;
  }

  const octets = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      return Number.NaN;
    }

    return Number(part);
  });

  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return null;
  }

  return octets;
}

export function ipv4ToInt(octets: number[]) {
  return (
    ((octets[0] << 24) >>> 0) +
    ((octets[1] << 16) >>> 0) +
    ((octets[2] << 8) >>> 0) +
    (octets[3] >>> 0)
  );
}

export function intToIpv4(value: number) {
  return [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join(".");
}

export function octetToBinary(octet: number) {
  return octet.toString(2).padStart(8, "0");
}
