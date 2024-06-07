"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { getDeviceUserById } from "@/data/user"
import { DeviceUser } from "@prisma/client"
import { formatDistance } from "date-fns"
import { useEffect, useState, useTransition } from "react"

export type RecentUsersType = {
  id: string
  labId: string
  userId: string
  createdAt: Date
}

interface RecentUsersProps {
  data: RecentUsersType[]
}

export const RecentUsers: React.FC<RecentUsersProps> = ({
  data
}) => {

  const [user, setUser] = useState<DeviceUser[]>([])
  const [isPending, startTransition] = useTransition();

  useEffect(() => {

    const fetchData = async () => {
      let userArray: DeviceUser[] = [];
      for (const recent of data) {
        const user = await getDeviceUserById(recent.userId)

        if (user) {
          user.createdAt = recent.createdAt
          userArray.push(user)
        }
      }
      setUser([...userArray])
    }
    startTransition(() => {
      fetchData();
    })

  }, [data]);

  return (
    <div className="space-y-8">
      {user.map((user) => (
        <>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image} alt="Avatar" />
              <AvatarFallback>{user.firstName[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground">
                {user.role}
              </p>
            </div>
            <div className="ml-auto font-medium">{formatDistance(
              new Date(user.createdAt),
              new Date(),
              { addSuffix: true }
            )}</div>
          </div>
        </>))}
    </div>
  )
}