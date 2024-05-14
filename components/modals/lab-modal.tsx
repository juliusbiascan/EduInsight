"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { useLabModal } from "@/hooks/use-lab-modal";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";

const formSchema = z.object({
  name: z.string().min(1),
});

export const LabModal = () => {

  const labModal = useLabModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/labaratory', values);
      window.location.assign(`/admin/${response.data.userId}`);
    } catch (error) {
      console.log('Something went wrong', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create labaratory"
      description="Add a new labaratory to manage device and staff."
      isOpen={labModal.isOpen}
      onClose={labModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Labaratoy name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 flex items-center justify-between">
                  <Button disabled={loading} type="button" variant="destructive" onClick={() => {
                    logout();
                    labModal.onClose
                  }}>
                    Logout
                  </Button>
                  <div className="space-x-2 flex items-center justify-end w-full">
                    <Button disabled={loading} variant="outline" onClick={labModal.onClose}>
                      Cancel
                    </Button>
                    <Button disabled={loading} type="submit">Continue</Button>
                  </div>
                </div>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
