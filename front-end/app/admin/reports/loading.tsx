import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[240px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="w-full">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-[400px] w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

