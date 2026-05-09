import type { SubnetResult } from "@/types/networking";

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

export function cidrToMaskInt(cidr: number) {
  if (cidr === 0) {
    return 0;
  }

  return (0xffffffff << (32 - cidr)) >>> 0;
}

export function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  const octets = parseIpv4Address(ip);

  if (!octets || cidr < 0 || cidr > 32) {
    return null;
  }

  const ipInt = ipv4ToInt(octets);
  const maskInt = cidrToMaskInt(cidr);
  const networkInt = (ipInt & maskInt) >>> 0;
  const wildcardInt = ~maskInt >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalHosts = 2 ** (32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(totalHosts - 2, 0);
  const firstUsable = cidr >= 31 ? networkInt : networkInt + 1;
  const lastUsable = cidr >= 31 ? broadcastInt : broadcastInt - 1;
  const maskOctets = intToIpv4(maskInt).split(".").map(Number);

  return {
    ip,
    cidr,
    subnetMask: intToIpv4(maskInt),
    networkAddress: intToIpv4(networkInt),
    broadcastAddress: intToIpv4(broadcastInt),
    firstUsableHost: intToIpv4(firstUsable),
    lastUsableHost: intToIpv4(lastUsable),
    totalHosts,
    usableHosts,
    binaryIp: octets.map(octetToBinary),
    binaryMask: maskOctets.map(octetToBinary)
  };
}

export function binaryToDecimal(value: string) {
  if (!/^[01]{1,8}$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 2);
}
