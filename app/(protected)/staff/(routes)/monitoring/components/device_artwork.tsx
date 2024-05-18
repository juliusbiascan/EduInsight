import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ActiveDeviceUser, State } from "@prisma/client"
import { getDeviceUserById } from "@/data/user"
import { getDeviceById } from "@/data/device"

interface DeviceArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  activeDevice: ActiveDeviceUser
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export async function DeviceArtwork({
  activeDevice,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: DeviceArtworkProps) {

  const user = await getDeviceUserById(activeDevice.userId);

  const device = await getDeviceById(activeDevice.deviceId);

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={activeDevice.state == State.INACTIVE ? "/preferences-desktop-display.png" : "/preferences-desktop-display-blue.png"}
              alt={""}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Monitor</ContextMenuItem>
          <ContextMenuItem>Shutdown (beta)</ContextMenuItem>
          <ContextMenuItem>Bootup (beta)</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Screenshot</ContextMenuItem>
          <ContextMenuItem>View Browser history</ContextMenuItem>
          <ContextMenuItem>Settings</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Restrict</ContextMenuItem>
          <ContextMenuItem>Block</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{device?.name}</h3>
        <p className="text-xs text-muted-foreground">{user?.firstName} {user?.lastName}</p>
      </div>
    </div>
  )
}