"use client"

import { DeviceUser } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectAvailableDevice } from '../../components/select-available-device';
import { useRouter } from "next/navigation";

interface ResultClientProps {
  user: DeviceUser | null;
}

export const ResultClient: React.FC<ResultClientProps> = ({
  user,
}) => {

  const router = useRouter();

  const onLogin = async () => {
    router.refresh()
    router.push("/staff/in-out")
  }

  const onLogout = async () => {
    router.refresh()
    router.push("/staff/in-out")
  }

  return (
    <>
      <Heading title="Allow User" description="In/Out user" />

      <Separator />

      {JSON.stringify(user)}

      <div className="grid grid-rows-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Available Devices</CardTitle>
            <CardDescription>Select Available Device to Login</CardDescription>
          </CardHeader>
          <CardContent>
            <SelectAvailableDevice />
          </CardContent>
          <CardFooter>
            <div className="space-x-2 flex items-center justify-end w-full">
              <Button className="w-full" variant={'destructive'} onClick={() => onLogout()}>
                OUT
              </Button>
              <Button className="w-full bg-green-700" variant={'default'} onClick={() => onLogin()}>
                IN
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}