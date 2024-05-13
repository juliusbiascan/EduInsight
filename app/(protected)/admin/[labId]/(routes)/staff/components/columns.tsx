"use client"

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type UserColumn = {
  id: string
  name: string | null
  email: string | null
  password: string | null
  isTwoFactorEnabled: boolean
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'isTwoFactorEnabled',
    header: '2FA',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]