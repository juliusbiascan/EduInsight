"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CSSProperties, useState } from "react";
import React from "react";
import { SelectAvailableDevice } from "./select-available-device";
import { SelectWebCamera } from "./select-scanner";

const InOutClient = () => {

  const [qrResult, setQrResult] = useState("")
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

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            In/Out
          </h2>
          <p className="text-sm text-muted-foreground">
            Scan QR Code to login students/teachers
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>QR Scanner</CardTitle>
            <CardDescription>Scan QR Code via Webcam</CardDescription>
          </CardHeader>
          <CardContent>
            <Scanner
              styles={styles}
              onResult={(result: any) => setQrResult(result)}
              onError={(error) => console.log(error?.message)}
            />
          </CardContent>
          <CardFooter>
            <SelectWebCamera />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            {qrResult}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
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
                <Button className="w-full" variant={'destructive'}>
                  OUT
                </Button>
                <Button className="w-full bg-green-700" variant={'default'}>
                  IN
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

    </>);
}

export default InOutClient;