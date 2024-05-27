"use client"

import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DeviceArtwork } from "./device_artwork"
import { getAllActiveUserDevice } from "@/data/device"
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { LogOut, Trash } from "lucide-react";
import { useEffect, useState } from "react"
import { ActiveDeviceUser } from "@prisma/client"
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

  useEffect(() => {
    const fetch = async () => {
      if (labId) {
        const allActiveDevice = await getAllActiveUserDevice(labId);
        if (allActiveDevice)
          setAllActiveDevice([...allActiveDevice])
      }

    }
    fetch();
  }, [labId]);

  // const allInactiveDevice = await getAllInactiveUserDevice(labId);

  // if (!allInactiveDevice) {
  //   return null;
  // }

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
                  router.refresh()
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
            {allActiveDevice && allActiveDevice.map((album) => (
              <DeviceArtwork
                key={album.id}
                activeDevice={album}
                className="w-[250px]"
                aspectRatio="portrait"
                width={250}
                height={330}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {/* <div className="mt-6 space-y-1">
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
            {allInactiveDevice.map((album) => (
              <DeviceArtwork
                key={album.id}
                activeDevice={album}
                className="w-[150px]"
                aspectRatio="square"
                width={150}
                height={150}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div> */}
    </>
  )
}

