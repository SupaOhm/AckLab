export type ArpFrameKind = "request" | "reply" | "data";

export type ArpFrameDirection = "broadcast" | "unicast";
export type ArpVisualMode =
  | "cache-check"
  | "broadcast-request"
  | "lan-receive"
  | "target-match"
  | "unicast-reply"
  | "cache-update"
  | "data-frame"
  | "complete";

export interface ArpHost {
  id: string;
  label: string;
  ipAddress: string;
  macAddress: string;
  role: "source" | "target" | "observer" | "switch";
}

export interface ArpCacheEntry {
  ipAddress: string;
  macAddress: string;
  state: "missing" | "learned";
}

export interface ArpFrame {
  id: string;
  kind: ArpFrameKind;
  label: string;
  direction: ArpFrameDirection;
  from: string;
  to: string;
  sourceIp: string;
  sourceMac: string;
  targetIp: string;
  targetMac: string;
  summary: string;
}

export interface ArpStep {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  sender: string;
  receivers: string;
  flowLabel: string;
  visibleResult: string;
  delivery: "local" | "broadcast" | "unicast" | "cache";
  visualMode: ArpVisualMode;
  highlightHostIds: string[];
  dimHostIds?: string[];
  hostBadges?: Record<string, string>;
  targetIpHighlightHostIds?: string[];
  showPacket: boolean;
  highlightCache?: boolean;
  frameId?: string;
}
