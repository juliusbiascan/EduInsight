"use client"

import { useState } from 'react'
import * as z from 'zod'
import { DeviceUser } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import CustomWebcam from '@/components/custom-webcam';

interface DeviceUserFormProps {
  initialData: DeviceUser | null;
  labId: string
}

const formSchema = z.object({
  schoolId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  image: z.string({
    required_error: "Please take a picture"
  }).min(1),
  role: z.string({
    required_error: "Please select a role.",
  }),
})

type DeviceUserFormValues = z.infer<typeof formSchema>;

export const DeviceUserForm: React.FC<DeviceUserFormProps> = ({
  initialData,
  labId,
}) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Update user' : 'Register user'
  const description = initialData ? 'Update a user' : 'Register a new user'
  const toastMessage = initialData ? 'User updated.' : 'User registered.'
  const action = initialData ? 'Save changes' : 'Register'

  const roles = [
    { label: "Student", value: "STUDENT" },
    { label: "Teacher", value: "TEACHER" },
    { label: "Guest", value: "GUEST" },
  ]

  const form = useForm<DeviceUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
    } : {
      schoolId: '',
      firstName: '',
      lastName: '',
      image: '',
      role: 'STUDENT',
    }
  });

  const onSubmit = async (data: DeviceUserFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        console.log(`/api/${labId}/registration/${params.devUserId}`);
        await axios.patch(`/api/${labId}/registration/${params.devUserId}`, data)
        router.refresh();
        router.push('/staff/registration');
        router.refresh()
      } else {
        await axios.post(`/api/${labId}/registration`, data)
      }

      toast.success(toastMessage)
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${labId}/registration/${initialData?.id}`)
      router.refresh();
      router.push('/staff/registration')
      router.refresh();
      toast.success("Devices deleted.")
    } catch (err) {
      toast.error("Something Went Wrong.");
    } finally {
      setLoading(false)
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className='grid gap-8'>
            <div className='w-2/5'>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capture Image</FormLabel>
                    <FormControl>
                      <CustomWebcam
                        value={field.value}
                        disabled={loading}
                        onSave={(value) => {
                          form.setValue("image", value);
                        }}
                        onRemove={(value) => {
                          form.setValue("image", "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
            <div className='w-3/5 grid grid-cols-2 gap-8'>
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School ID</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder='Input school id' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder='Type first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder='Type last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Register As</FormLabel>
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
                              ? roles.find(
                                (role) => role.value === field.value
                              )?.label
                              : "Select language"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search role..." />
                          <CommandEmpty>No role found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {roles.map((role) => (
                                <CommandItem
                                  value={role.label}
                                  key={role.value}
                                  onSelect={() => {
                                    form.setValue("role", role.value)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      role.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {role.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the language that will be used in the dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
        </form>
      </Form >
    </>
  )
}