import { Skeleton } from "@/components/ui/skeleton"

export function VncScreenLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-screen w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
