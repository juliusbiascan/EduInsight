"use client";

import { useEffect, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Device, DeviceUser } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClockInSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { clockIn } from "@/actions/clock-in";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (error: string | undefined, success: string | undefined) => void;
  loading: boolean;
  devices: Device[];
  user: DeviceUser;
  state: boolean;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  devices,
  user,
  state,
}) => {

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<z.infer<typeof ClockInSchema>>({
    resolver: zodResolver(ClockInSchema),
    defaultValues: (user && devices) ? {
      userId: user.id,
      deviceId: '',
    } : {
      userId: '',
      deviceId: '',
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  const onSubmit = async (values: z.infer<typeof ClockInSchema>) => {
    console.log(values.userId);
    console.log(values.deviceId);
    startTransition(() => {
      clockIn(values)
        .then((data) => {
          onConfirm(data.error, data.success)
          router.refresh();
        });
    });
  }

  return (
    <Modal
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

      {devices &&
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem
                  className="hidden">
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder='Input user id' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem className={cn('flex flex-col', state && 'hidden')}>
                  <FormLabel>Select available device</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? devices.find((device) => device.id === field.value)?.name
                            : "Select available devices"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search available devices..." />
                        <CommandEmpty>No available found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {devices.map((device) => (
                              <CommandItem
                                value={device.id}
                                key={device.id}
                                onSelect={() => form.setValue("deviceId", device.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    device.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
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
                  <FormDescription>
                    Note: Please select available device to login users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button className="w-full" disabled={loading} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="w-full"
                disabled={loading}
                variant={state ? "destructive" : "secondary"}
                type="submit">
                {state ? "LOGOUT" : "LOGIN"}
              </Button>
            </div>
          </form>
        </Form >
      }
    </Modal >
  );
};
