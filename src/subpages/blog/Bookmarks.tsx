"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ReportCard from "@/components/blog/ReportCard";
import { ReportCardSkeleton } from "@/components/blog/Skeletons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { GetBookmarkedReport } from "@/services/api/apiRequest";

const Bookmarks = () => {
  const router = useRouter();

  const {
    data: bookmarkData,
    isLoading: isBookmarkLoading,
    error: bookmarkError,
  } = useQuery({
    queryKey: [APP_KEYS.REPORTS_BOOKMARK],
    queryFn: () => GetBookmarkedReport(1, 20),
    enabled: true,
  });

  const navigateToReport = (slug: string) => {
    router.push(`/blog/${slug}`, { scroll: false });
  };

  return (
    <div className="w-full px-20">
      <div className="w-full flex items-center mb-6 border-b pb-2 gap-2">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-600"
        >
          ← Back
        </Button>
        <h3 className="text-xl font-bold text-[#1C1C1C]">
          Bookmarks ({bookmarkData?.data?.length})
        </h3>
      </div>

      {isBookmarkLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ReportCardSkeleton key={index} />
          ))}
        </div>
      ) : bookmarkData?.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
          {bookmarkData?.data.map((report: any) => (
            <ReportCard
              key={report._id}
              report={report}
              onClick={() => navigateToReport(report.slug)}
              isBookmarked={true}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">You are yet to bookmark any report</p>
        </div>
      )}
    </div>
  );
};
export default Bookmarks;
