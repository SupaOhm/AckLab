export const tcpConnectSteps = ["SYN", "SYN-ACK", "ACK"] as const;

export const tcpTimelineEmptyHint = `${tcpConnectSteps.join(" - ")} will appear here.`;
