"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scanner, useContinuousScanner, useDeviceList } from "@yudiel/react-qr-scanner";
import { CSSProperties } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const InOutClient = () => {

  const router = useRouter();

  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100%',
      paddingTop: '100%',
      overflow: 'hidden',
      position: 'relative'
    },
    video: {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'block',
      overflow: 'hidden',
      position: 'absolute',
      objectFit: 'cover'
    }
  };

  const deviceList = useDeviceList();

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <>
      <div className="w-full grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>QR Scanner</CardTitle>
            <CardDescription>Scan QR Code via Webcam</CardDescription>
          </CardHeader>
          <CardContent>
            <Scanner
              styles={styles}
              onResult={(text, result) => {
                router.refresh()
                router.push(`/staff/in-out/${text}`)
                router.refresh()

              }}
              onError={(error) => console.log(error?.message)}
              options={(
                {
                  deviceId: value,
                }
              )}
            />
          </CardContent>
          <CardFooter>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value
                    ? deviceList?.find((deviceList) => deviceList.deviceId === value)?.label
                    : "Select webcam..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search webcam..." />
                  <CommandEmpty>No webcam found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {deviceList?.map((deviceList) => (
                        <CommandItem
                          key={deviceList.deviceId}
                          value={deviceList.deviceId}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === deviceList.deviceId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {deviceList.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>

      </div>
    </>
  );
}

export default InOutClient;