import type { CurriculumModule } from "@/types/curriculum";

import { module } from "./shared";

export const deviceModules: CurriculumModule[] = [
  ["host", "Host", "An endpoint that sends or receives data.", "Devices", 1],
  ["nic", "NIC", "Hardware that connects a host to a network.", "Devices", 1],
  ["hub", "Hub", "A simple repeater for physical signals.", "Devices", 1],
  ["switch", "Switch", "Forwards Ethernet frames inside a LAN.", "Devices", 2],
  ["router", "Router", "Moves packets between networks.", "Devices", 3],
  ["access-point", "Access point", "Connects wireless clients to a LAN.", "Devices", 2],
  ["modem", "Modem", "Connects local networks to an ISP link.", "Devices", 1],
  ["firewall", "Firewall", "Allows or blocks traffic by rule.", "Devices", 3],
  ["gateway", "Gateway", "The next hop out of a local network.", "Devices", 3],
  ["server", "Server", "Provides applications or resources to clients.", "Devices", 7]
].map(([id, title, shortDescription, category, osiLayer]) =>
  module({
    id: String(id),
    title: String(title),
    shortDescription: String(shortDescription),
    category: String(category),
    difficulty: "beginner",
    estimatedTime: "5 min",
    prerequisites: ["communication-basics"],
    relatedModules: ["client-server-model"],
    osiLayer: Number(osiLayer),
    type: "concept"
  })
);
