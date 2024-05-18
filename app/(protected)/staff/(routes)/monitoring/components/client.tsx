import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DeviceArtwork } from "./device_artwork"
import { getAllActiveUserDevice, getAllInactiveUserDevice } from "@/data/device"

interface MonitoringClientProps {
  labId: string;
}

export const MonitoringClient: React.FC<MonitoringClientProps> = async ({
  labId
}) => {

  const allActiveDevice = await getAllActiveUserDevice(labId);

  if (!allActiveDevice) {
    return null;
  }

  const allInactiveDevice = await getAllInactiveUserDevice(labId);

  if (!allInactiveDevice) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Active Now
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor Active Devices
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {allActiveDevice.map((album) => (
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
      </div>
    </>
  )
}

