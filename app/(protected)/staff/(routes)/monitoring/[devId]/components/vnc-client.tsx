"use client"

import { Button } from "@/components/ui/button";
import VncScreen, { VncScreenHandle } from "@/components/vnc-screen";
import { Device } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Maximize, Minimize } from "lucide-react";
import { useRef, useState } from "react";

interface VncClientProps {
  device: Device;
}

export const VncClient: React.FC<VncClientProps> = ({
  device
}) => {

  const ref = useRef<VncScreenHandle>(null);
  const [isFull, setFullScr] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {device.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {device.devHostname}
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <Button
        className=""
        variant={"ghost"} onClick={() => setFullScr(!isFull)}>
        {!isFull ? <Maximize className="mr-3" /> : <Minimize className="mr-3" />}
        {!isFull ? "Maximize" : "Minimize"}
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.connect()}>
        Connect
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.disconnect()}>
        Disconnect
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.sendCtrlAltDel()}>
        Control Alt Delete
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.machineReboot}>
        Reboot
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.machineShutdown}>
        Shutdown
      </Button>

      <Button
        className=""
        variant={"ghost"} onClick={() => ref.current?.machineReset}>
        Reset
      </Button>

      <VncScreen
        className="w-full"
        url={`ws://${device.devHostname}:8080/`}
        scaleViewport
        style={{
          position: !isFull ? "relative" : "absolute",
          top: "0",
          bottom: "0",
          width: '100%',
          height: '100vh',
          overflow: "hidden",
        }}
        ref={ref}
      />
    </>
  )
}