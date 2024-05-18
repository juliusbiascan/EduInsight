"use client";

import { useCallback, useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Scanner, useDeviceList } from "@yudiel/react-qr-scanner";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (value: string) => void;
  loading: boolean;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onResult,
  loading
}) => {

  const deviceList = useDeviceList();
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const handleScan = (text: string) => {
    onResult(text);
  }

  return (
    <Modal
      title="QR Scanner"
      description="Tips: Make sure the you have good lightning"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-8">

        <Scanner
          onResult={handleScan}
          onError={(error) => console.log(error?.message)}
          options={(
            {
              deviceId: value,
            }
          )}
        />

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
      </div>
    </Modal>
  );
};
