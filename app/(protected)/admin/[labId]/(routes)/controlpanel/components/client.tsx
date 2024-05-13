"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ControlPanelClientProps {
}

export const ControlPanelClient: React.FC<ControlPanelClientProps> = ({

}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <Heading
        title={`Control Panel`}
        description="Adjust your device setting in your laboratory" />
      <Separator />
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl">(Soon if Applicable)</h1>
      </div>
    </>
  )
}