"use client";

import { useReducedMotion } from "framer-motion";
import { RotateCcw, Send, Unplug, Wifi } from "lucide-react";

import { ExpandableVisualizerPane } from "@/components/shared/expandable-visualizer-pane";
import { PracticePrompt } from "@/components/shared/practice-prompt";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TcpExplanationPanel } from "@/features/tcp-handshake/components/tcp-explanation-panel";
import { TcpPacketAnimation } from "@/features/tcp-handshake/components/tcp-packet-animation";
import { TcpHostNode, TcpStatusPill } from "@/features/tcp-handshake/components/tcp-state-panel";
import { TcpPacketInspector, TcpTimeline } from "@/features/tcp-handshake/components/tcp-timeline";
import { useTcpSimulation } from "@/features/tcp-handshake/hooks/use-tcp-simulation";
import { tcpNodes } from "@/features/tcp-handshake/lib/tcp-simulation";

export function TcpHandshakeVisualizer() {
  const reduceMotion = useReducedMotion();
  const {
    clientState,
    serverState,
    events,
    message,
    receivedMessage,
    isAnimating,
    sequence,
    displayedPacket,
    activePacket,
    connected,
    canConnect,
    canSend,
    canClose,
    setMessage,
    setSelectedPacketId,
    handleConnect,
    handleSendMessage,
    handleCloseConnection,
    handleReset
  } = useTcpSimulation(reduceMotion);
  const controls = (
    <>
      <Button
        className="min-w-24 flex-1 sm:flex-none"
        size="sm"
        onClick={handleConnect}
        disabled={!canConnect}
      >
        <Wifi className="size-4" />
        Connect
      </Button>
      <Button
        className="min-w-32 flex-1 sm:flex-none"
        size="sm"
        onClick={handleSendMessage}
        disabled={!canSend}
      >
        <Send className="size-4" />
        Send message
      </Button>
      <Button
        className="min-w-20 flex-1 sm:flex-none"
        size="sm"
        variant="outline"
        onClick={handleCloseConnection}
        disabled={!canClose}
      >
        <Unplug className="size-4" />
        Close
      </Button>
      <Button
        className="min-w-20 flex-1 sm:flex-none"
        size="sm"
        variant="ghost"
        onClick={handleReset}
      >
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </>
  );

  return (
    <div className="grid gap-8">
      <ToolWorkspace
        title="TCP socket lab"
        description="Control the client. Watch connection state, packets, and acknowledgements change."
      >
        <div className="grid min-w-0 gap-5">
          <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border/25 bg-card/50 p-3 lg:flex-row lg:items-end">
            <div className="grid min-w-0 flex-1 gap-2">
              <Label htmlFor="tcp-message">Message</Label>
              <Input
                id="tcp-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!connected}
                placeholder="Type a message"
              />
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">{controls}</div>
          </section>

          <ExpandableVisualizerPane
            title={displayedPacket ? `TCP ${displayedPacket.label}` : "TCP socket lab"}
            description={
              displayedPacket
                ? displayedPacket.explanation
                : "Open a simulated TCP connection and inspect state changes."
            }
            controls={controls}
            size="wide"
            className="min-w-0 pb-14"
            expandedChildren={({ staticOnOpen }) => (
              <TcpCanvas
                activePacket={activePacket}
                clientState={clientState}
                connected={connected}
                displayedPacket={displayedPacket}
                events={events}
                isAnimating={isAnimating}
                receivedMessage={receivedMessage}
                reduceMotion={reduceMotion}
                sequence={sequence}
                serverState={serverState}
                setSelectedPacketId={setSelectedPacketId}
                staticPacket={staticOnOpen}
              />
            )}
          >
            <TcpCanvas
              activePacket={activePacket}
              clientState={clientState}
              connected={connected}
              displayedPacket={displayedPacket}
              events={events}
              isAnimating={isAnimating}
              receivedMessage={receivedMessage}
              reduceMotion={reduceMotion}
              sequence={sequence}
              serverState={serverState}
              setSelectedPacketId={setSelectedPacketId}
            />
          </ExpandableVisualizerPane>
        </div>
      </ToolWorkspace>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <TcpExplanationPanel packet={displayedPacket} />
        <PracticePrompt prompt="Connect, send a short message, then inspect how ACK changes." />
      </div>
    </div>
  );
}

function TcpCanvas({
  activePacket,
  clientState,
  connected,
  displayedPacket,
  events,
  isAnimating,
  receivedMessage,
  reduceMotion,
  sequence,
  serverState,
  setSelectedPacketId,
  staticPacket = false
}: {
  activePacket: ReturnType<typeof useTcpSimulation>["activePacket"];
  clientState: ReturnType<typeof useTcpSimulation>["clientState"];
  connected: boolean;
  displayedPacket: ReturnType<typeof useTcpSimulation>["displayedPacket"];
  events: ReturnType<typeof useTcpSimulation>["events"];
  isAnimating: boolean;
  receivedMessage: string;
  reduceMotion: boolean | null;
  sequence: ReturnType<typeof useTcpSimulation>["sequence"];
  serverState: ReturnType<typeof useTcpSimulation>["serverState"];
  setSelectedPacketId: (packetId: string) => void;
  staticPacket?: boolean;
}) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-border/25 bg-card/40 p-3 shadow-xl shadow-black/10 sm:p-6">
      <div className="network-grid absolute inset-0 opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,hsl(var(--primary)/0.08),transparent_32%),radial-gradient(circle_at_82%_45%,hsl(var(--primary)/0.08),transparent_30%)]" />
      <div className="relative z-10 grid min-h-[500px] min-w-0 grid-rows-[auto_1fr_auto] gap-4 sm:gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TcpStatusPill connected={connected} animating={isAnimating} />
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>client seq {sequence.client}</span>
            <span>server seq {sequence.server}</span>
          </div>
        </div>
        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-border/20 bg-background/45 p-3 sm:p-5">
          <div className="absolute left-[17%] right-[17%] top-1/2 h-px bg-border/45" />
          <div className="absolute left-[17%] right-[17%] top-[calc(50%-20px)] h-10 rounded-full bg-primary/5" />
          <div className="relative flex min-h-[320px] min-w-0 items-center justify-between gap-4">
            <TcpHostNode
              label="Client"
              address={tcpNodes[0].address}
              state={clientState}
              kind="client"
            />
            <TcpHostNode
              label="Server"
              address={tcpNodes[1].address}
              state={serverState}
              kind="server"
              receivedMessage={receivedMessage}
            />
            {activePacket ? (
              <TcpPacketAnimation
                key={activePacket.id}
                packet={activePacket}
                reduceMotion={reduceMotion}
                staticFrame={staticPacket}
              />
            ) : null}
          </div>
        </div>
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
          <TcpTimeline
            events={events}
            activePacketId={displayedPacket?.id}
            onSelectPacket={setSelectedPacketId}
          />
          <TcpPacketInspector packet={displayedPacket} />
        </div>
      </div>
    </section>
  );
}
