"use client"

import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DeviceArtwork } from "./device_artwork"
import { getAllActiveUserDevice, getAllInactiveUserDevice } from "@/data/device"
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { LogOut, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react"
import { ActiveDeviceUser, Device } from "@prisma/client"
import { logoutUser } from "@/actions/logout"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface MonitoringClientProps {
  labId: string | null;
}

export const MonitoringClient: React.FC<MonitoringClientProps> = ({
  labId
}) => {

  const router = useRouter()
  const [allActiveDevice, setAllActiveDevice] = useState<ActiveDeviceUser[]>()
  const [allInactiveDevice, setAllInactiveDevice] = useState<Device[]>()

  const refresh = useCallback(async () => {
    if (labId) {
      const allActiveDevice = await getAllActiveUserDevice(labId);
      if (allActiveDevice)
        setAllActiveDevice([...allActiveDevice])
      const allInactiveDevice = await getAllInactiveUserDevice(labId);
      if (allInactiveDevice)
        setAllInactiveDevice([...allInactiveDevice])
    }

  }, [labId])

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Active Now" description="Monitor Active Device Users" />
        <Button
          // disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => {
            {
              allActiveDevice && allActiveDevice.map((activeDevice) => {
                logoutUser(activeDevice.userId, activeDevice.deviceId).then((message) => {
                  toast.success("All Device has been logout successfully")
                  refresh()
                })
              })
            }
          }}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {allActiveDevice && (allActiveDevice.length === 0 ? <>No Active Device</> : allActiveDevice.map((album) => (
              <DeviceArtwork
                key={album.id}
                activeDevice={album}
                className="w-[250px]"
                aspectRatio="portrait"
                width={250}
                height={330}
                onChanged={() => refresh()} />
            )))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Offline
        </h2>
        <p className="text-sm text-muted-foreground">
          View inactive devices
        </p>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {allInactiveDevice && (allInactiveDevice.length === 0 ? <>No Active Device</> : allInactiveDevice.map((album) => (
              <DeviceArtwork
                key={album.id}
                inactiveDevice={album}
                className="w-[150px]"
                aspectRatio="square"
                width={150}
                height={150} onChanged={() => refresh()} />
            )))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  )
}

