export const ReportCardSkeleton = () => (
  <div className="animate-pulse bg-transparent border-none">
    <div className="flex h-auto">
      <div className="flex-1 pr-5 pl-2 py-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="flex-1 h-48 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export const SidebarCardSkeleton = () => (
  <div className="animate-pulse h-full">
    <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
    <div className="px-3 py-2">
      <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const FeaturedCarouselSkeleton = () => (
  <div className="animate-pulse h-auto mb-8 overflow-hidden rounded-xl">
    <div className="h-80 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="flex justify-end gap-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export const BlogDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        <div className="flex-1 max-w-4xl">
          <article className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            {/* Title skeleton */}
            <div className="h-10 bg-gray-200 rounded mb-4"></div>

            {/* Description skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

            {/* Meta info skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>

            {/* Author section skeleton */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-18"></div>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar skeleton */}
        <div className="w-80">
          <div className="h-6 bg-gray-200 rounded mb-6 w-48 ml-auto"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);
