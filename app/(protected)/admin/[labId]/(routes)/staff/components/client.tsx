"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { UserColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface StaffClientProps {
  data: UserColumn[]
}

export const StaffClient: React.FC<StaffClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Staff (${data?.length})`}
          description="Manage staff for your laboratory" />
        <Button onClick={() => router.push(`/admin/${params.labId}/staff/register`)}>
          <Plus className="w-4 h-4 mr-2" />
          Register
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Staff" />
      <Separator />
      <ApiList entityName="users" entityIdName="labId" />
    </>
  )
}