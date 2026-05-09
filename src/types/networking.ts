export interface SubnetResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  binaryIp: string[];
  binaryMask: string[];
}

export interface OsiLayer {
  number: number;
  name: string;
  protocols: string[];
  summary: string;
  dataUnit: string;
}

export interface FlowStep {
  id: string;
  title: string;
  description: string;
}

export interface RoutingNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "endpoint" | "router";
}

export interface RoutingEdge {
  from: string;
  to: string;
  cost: number;
}
