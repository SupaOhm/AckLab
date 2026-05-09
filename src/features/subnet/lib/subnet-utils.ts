import { intToIpv4, ipv4ToInt, octetToBinary, parseIpv4Address } from "@/lib/networking/ipv4";
import type { SubnetResult } from "@/types/networking";

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
