import { Skeleton } from "@/components/ui/skeleton";

export const CollaboratorSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg border">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  </div>
);
