"use client"

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { DeviceUserRole } from '@prisma/client';

export type RegistrationColumn = {
  id: string
  labId: string
  name: string
  image: string
  role: DeviceUserRole
  createdAt: string
}

export const columns: ColumnDef<RegistrationColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]