"use client";

import { useEffect, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ActiveDeviceUser, Device, DeviceUser } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClockInSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { clockIn } from "@/actions/clock-in";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { getAllDevice } from "@/data/device";
import { getActiveDeviceUserByUserId, getDeviceUserBySchoolId } from "@/data/user";
import { getUserState } from "@/actions/staff";
import toast from "react-hot-toast";
import { db } from "@/lib/db";

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (error: string | undefined, success: string | undefined) => void;
  loading: boolean;
  userId: string;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userId,
}) => {

  const router = useRouter();
  const [user, setUser] = useState<DeviceUser>();
  const [state, setState] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false)
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const fetch = async () => {
      const user = await getDeviceUserBySchoolId(userId);

      if (!user) {
        toast.error("User not found!")
        return
      }

      setUser(user);

      const state = await getUserState(user.id);
      setState(state == 1);

      const devices = await getAllDevice(user.labId);
      if (devices) {
        setDevices([...devices])
        if (devices.length !== 0)
          setDeviceId(devices[0].id)
      }
    }
    if (userId)
      fetch()
  }, [userId]);


  if (!isMounted) {
    return null;
  }

  const onSubmit = async (user: DeviceUser) => {
    const userId = user.id
    if (!user && !deviceId) {
      toast.error("User or Device not found!")
      return
    }

    const activeDeviceUser = await getActiveDeviceUserByUserId(userId)

    const val: z.infer<typeof ClockInSchema> = {
      userId: userId,
      deviceId: !activeDeviceUser ? deviceId : activeDeviceUser?.deviceId,
    }

    startTransition(() => {
      clockIn(val)
        .then((data) => {
          onConfirm(data.error, data.success)
          router.refresh();
        });
    });
  }

  return (
    <>
      {user && <Modal
        title="Are you sure?"
        description="This action cannot be undone."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex items-center justify-center">
          <Image
            className="w-[200px] h-[200px] mb-3 rounded-full shadow-lg"
            src={user.image}
            alt={user.firstName}
            width={600}
            height={600} />
        </div>

        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">
          <span>{user.firstName} {user.lastName}</span>
        </h5>

        <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-10 text-center">
          {user.role}
        </h2>

        {!state &&
          <>
            {devices.length === 0 ? <>No Available Device</> :
              <Popover
                open={open}
                onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                  >
                    {deviceId
                      ? devices.find((device) => device.id === deviceId)?.name
                      : "Select device..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Search device..." />
                    <CommandEmpty>No device found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {devices.map((device, key) => (
                          <CommandItem
                            key={key}
                            value={device.id}
                            onSelect={(currentValue) => {
                              setDeviceId(currentValue === deviceId ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                deviceId === device.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {device.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            }
          </>
        }
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button className="w-full" disabled={loading} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="w-full"
            disabled={loading || (!state && devices.length === 0)}
            variant={state ? "destructive" : "secondary"}
            onClick={() => onSubmit(user)}>
            {state ? "LOGOUT" : "LOGIN"}
          </Button>
        </div>
      </Modal >}
    </>
  );
};
