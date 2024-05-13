"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DeviceColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface DeviceClientProps {
  data: DeviceColumn[]
}

export const DeviceClient: React.FC<DeviceClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Devices (${data?.length})`}
          description="Manage devices for your laboratory" />
        <Button onClick={() => router.push(`/admin/${params.labId}/devices/register`)}>
          <Plus className="w-4 h-4 mr-2" />
          Register
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Devices" />
      <Separator />
      <ApiList entityName="devices" entityIdName="deviceId" />
    </>
  )
}