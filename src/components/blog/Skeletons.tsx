import { Skeleton } from "@/components/ui/skeleton";

export const ReportCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="flex h-auto">
      {/* Content Section */}
      <div className="flex-1 pr-5 pl-2 py-3">
        {/* Author Section */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-6 w-full mb-3" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        {/* Meta Info (echoes, comments, date) */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      
      {/* Image Section */}
      <div className="flex-1 h-48">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    </div>
  </div>
);

export const SidebarCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm h-full">
    {/* Image */}
    <Skeleton className="aspect-video w-full rounded-t-lg mb-3" />
    
    <div className="px-3 py-2">
      {/* Date */}
      <Skeleton className="h-3 w-20 mb-2" />
      
      {/* Title */}
      <Skeleton className="h-4 w-full mb-2" />
      
      {/* Description */}
      <Skeleton className="h-3 w-3/4 mb-3" />
      
      {/* Author */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const FeaturedCarouselSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    {/* Hero Image */}
    <Skeleton className="h-80 w-full" />
    
    <div className="p-6">
      {/* Author Section */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-8 w-2/3 mb-4" />
      
      {/* Description */}
      <Skeleton className="h-4 w-full mb-4" />
      
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export const BlogDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="w-full">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-2/3 mb-6" />

          {/* Description */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          {/* Meta info (read time, date) */}
          <div className="flex gap-4 mb-8 pb-4 border-b">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Content */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-64 w-full mb-4 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Author and Actions */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
);

// New pagination skeleton for loading states
export const PaginationSkeleton = () => (
  <div className="flex items-center justify-between">
    <Skeleton className="h-4 w-32" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-16" />
    </div>
  </div>
);