"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ActiveDeviceUser, Device, DeviceUser, State } from "@prisma/client"
import { getDeviceUserById } from "@/data/user"
import { getDeviceById } from "@/data/device"
import { logoutUser } from "@/actions/logout"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import toast from "react-hot-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface DeviceArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  activeDevice: ActiveDeviceUser
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function DeviceArtwork({
  activeDevice,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: DeviceArtworkProps) {

  const router = useRouter()

  const [user, setUser] = useState<DeviceUser | null>()
  const [device, setDevice] = useState<Device | null>()
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getDeviceUserById(activeDevice.userId);
      setUser(user)

      const device = await getDeviceById(activeDevice.deviceId);
      setDevice(device)
    }
    startTransition(() => {
      fetchData();
    })

  }, [activeDevice.userId, activeDevice.deviceId]);

  return (
    <>
      {<div className={cn("space-y-3", className)} {...props}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="overflow-hidden rounded-md">
              {isPending ? <Skeleton className="h-40 w-40" /> : <Image
                src={activeDevice.state == State.INACTIVE ? "/preferences-desktop-display.png" : "/preferences-desktop-display-blue.png"}
                alt={""}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className={cn("w-40", { ...props })}>
            <ContextMenuItem
              onClick={() =>
                router.push(`/staff/monitoring/${device?.id}`)
              }>
              Monitor
            </ContextMenuItem>
            <ContextMenuItem>Shutdown (beta)</ContextMenuItem>
            <ContextMenuItem>Bootup (beta)</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Screenshot</ContextMenuItem>
            <ContextMenuItem>View Browser history</ContextMenuItem>
            <ContextMenuItem>Settings</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Restrict</ContextMenuItem>
            <ContextMenuItem>Block</ContextMenuItem>

            <ContextMenuItem
              onClick={() => {
                logoutUser(activeDevice.userId, activeDevice.deviceId).then((message) => {
                  toast.success(message.success)
                  router.refresh()
                })
              }}>
              Logout
            </ContextMenuItem>
          </ContextMenuContent>

        </ContextMenu>
        <div className="space-y-1 text-sm">
          {isPending ? <Skeleton className="h-4 w-40" /> : <h3 className="font-medium leading-none">{device?.name}</h3>}
          {isPending ? <Skeleton className="h-4 w-30" /> : <p className="text-xs text-muted-foreground">{user?.firstName} {user?.lastName}</p>}
        </div>

      </div>}
    </>
  )
}