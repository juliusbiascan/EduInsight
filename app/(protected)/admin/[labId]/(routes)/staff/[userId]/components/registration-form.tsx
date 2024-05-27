"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@prisma/client';

interface RegistrationFormProps {
  initialData: User | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  isTwoFactorEnabled: z.boolean().default(false).optional()
})

type RegistrationFormValues = z.infer<typeof formSchema>;

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialData,
}) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit StaffS' : 'Register Staff'
  const description = initialData ? 'Edit a staff' : 'Add a new staff'
  const toastMessage = initialData ? 'Staff updated.' : 'Staff created.'
  const action = initialData ? 'Save changes' : 'Register'

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name!,
      email: initialData.email!,
      password: initialData.password!,
      isTwoFactorEnabled: initialData.isTwoFactorEnabled!,
    } : {
      name: '',
      email: '',
      password: '',
      isTwoFactorEnabled: false
    }
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      setLoading(true);
      console.log('test');
      if (initialData) {
        await axios.patch(`/api/${params.labId}/users/${params.userId}`, data)
      } else {
        await axios.post(`/api/${params.labId}/users`, data)
      }
      router.push(`/admin/${params.labId}/staff`);
      toast.success(toastMessage)
      router.refresh();

    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.labId}/users/${params.userId}`)
      router.push(`/admin/${params.labId}/users`)
      toast.success("Account deleted.")
      router.refresh();
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                  <FormControl>
                    <Checkbox
                      // @ts-ignore
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      2FA
                    </FormLabel>
                    <FormDescription>
                      Two factor authentication
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}