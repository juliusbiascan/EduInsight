import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Album } from "../data/album"

interface DeviceArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function DeviceArtwork({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: DeviceArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={album.cover}
              alt={album.name}
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
        <h3 className="font-medium leading-none">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.artist}</p>
      </div>
    </div>
  )
}