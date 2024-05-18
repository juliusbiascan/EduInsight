"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button"
import { ScannerModal } from "@/components/modals/scanner-modal";
import { getDeviceUserBySchoolId } from "@/data/user";
import { Device, DeviceUser } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getAllDevice } from "@/data/device";
import { DeviceUserForm } from "@/schemas";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { getUserState } from "@/actions/staff";
import { ClockInModal } from "@/components/modals/clockin-modal";
import { useRouter } from "next/navigation";


const InOutClient = () => {


  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [user, setUser] = useState<DeviceUser | null>();
  const [devices, setDevices] = useState<Device[] | null>([]);
  const [state, setState] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DeviceUserForm>>({
    resolver: zodResolver(DeviceUserForm),
    defaultValues: {
      schoolId: '',
    }
  });

  const onResult = async (userId: string) => {

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const user = await getDeviceUserBySchoolId(userId);

        if (!user) {
          toast.error("User not found")
          return;
        }

        const devices = await getAllDevice(user.labId);

        if (!devices) {
          toast.error("Device not found")
          return;
        }

        const state = await getUserState(userId);

        setState(state == 1);
        setDevices(devices);
        setUser(user);

        setOpen2(true);

      } catch (error) {
        console.log(error);
        toast.error('Something went wrong.');
      } finally {
        setOpen(false);
      }
    });
  }

  const onSubmit = async (data: z.infer<typeof DeviceUserForm>) => {

    setError("");
    setSuccess("");
    startTransition(async () => {

      try {

        const user = await getDeviceUserBySchoolId(data.schoolId);

        if (!user) {
          toast.error("User not found")
          return;
        }

        const devices = await getAllDevice(user.labId);

        if (!devices) {
          toast.error("Device not found")
          return;
        }
        const state = await getUserState(user.id);

        setState(state == 1);
        setDevices(devices);
        setUser(user);
        setOpen2(true);
      } catch (err) {
        console.log(err);
        toast.error(`Something went wrong.`);
      }
    });
  }


  const onConfirm = (error: string | undefined, success: string | undefined) => {
    setError(error);
    setSuccess(success);
    setOpen2(false);


  }

  return (
    <>
      <ScannerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onResult={(result) => onResult(result)}
        loading={isPending} />


      {(user && devices) && <ClockInModal
        isOpen={open2}
        onClose={() => setOpen2(false)}
        onConfirm={onConfirm}
        loading={isPending}
        devices={devices}
        user={user}
        state={state}
      />
      }

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            In/Out
          </h2>
          <p className="text-sm text-muted-foreground">
            Grant access to user to use device
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="relative">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Scanner</CardTitle>
              <CardDescription>Scan QR Code via Webcam</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant={'outline'}
                onClick={() => setOpen(true)}>
                Scan
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manual Input</CardTitle>
              <CardDescription>Input School ID to search users</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                  <FormField
                    control={form.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School ID</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} placeholder='Input school id' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <Button disabled={isPending} className='w-full ml-auto' type='submit'>
                    Search
                  </Button>
                </form>
              </Form >
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default InOutClient;