"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { RegistrationColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface RegistrationClientProps {
  data: RegistrationColumn[]
}

export const RegistrationClient: React.FC<RegistrationClientProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Device Users (${data?.length})`}
          description="Manage user for your devices" />
        <Button onClick={() => router.push(`/staff/registration/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Register
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

    </>
  )
}