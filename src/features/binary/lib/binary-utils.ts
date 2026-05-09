export { octetToBinary, parseIpv4Address } from "@/lib/networking/ipv4";

export function binaryToDecimal(value: string) {
  if (!/^[01]{1,8}$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 2);
}
