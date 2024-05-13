"use client"

import { useState } from 'react'
import * as z from 'zod'
import { DeviceUser } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';

interface DeviceUserFormProps {
  initialData: DeviceUser | null;
  labId: string
}

const formSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  role: z.string().min(1),
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

  const form = useForm<DeviceUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
    } : {
      name: '',
      image: '',
      role: 'STUDENT'
    }
  });

  const onSubmit = async (data: DeviceUserFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        console.log(`/api/${labId}/registration/${params.devUserId}`);
        await axios.patch(`/api/${labId}/registration/${params.devUserId}`, data)
      } else {
        await axios.post(`/api/${labId}/registration`, data)
      }
      router.refresh();
      router.push('/staff/registration');
      router.refresh()
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
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Image' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Full Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Role' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
        </form>
      </Form>

    </>
  )
}