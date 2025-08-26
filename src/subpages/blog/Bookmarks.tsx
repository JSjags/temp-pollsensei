"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ReportCard from "@/components/blog/ReportCard";
import Pagination from "@/components/blog/Pagination";
import {
  ReportCardSkeleton,
  PaginationSkeleton,
} from "@/components/blog/Skeletons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { GetBookmarkedReport } from "@/services/api/apiRequest";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface BookmarkedReport {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  published_by: {
    _id: string;
    name: string;
    email: string;
  };
  published_at: string;
  echoes_count: number;
  comments_count: number;
  slug: string;
  fields_of_interest?: Array<{ _id: string; name: string }>;
}

interface BookmarksResponse {
  data: BookmarkedReport[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const Bookmarks = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  const {
    data: bookmarkResponse,
    isLoading: isBookmarkLoading,
    error: bookmarkError,
  } = useQuery({
    queryKey: [APP_KEYS.REPORTS_BOOKMARK, currentPage, pageSize],
    queryFn: () => GetBookmarkedReport(currentPage, pageSize),
    enabled: !!user,
  });

  const navigateToReport = (slug: string) => {
    router.push(`/blog/${slug}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const transformReport = (report: BookmarkedReport) => ({
    ...report,
    author: report.published_by?.name || "Anonymous",
    authorImage: null,
    image:
      report.thumbnail ||
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
    date: new Date(report.published_at).toLocaleDateString(),
    views: report.echoes_count || 0,
    comments: report.comments_count || 0,
    excerpt: report.description,
    tags: report.fields_of_interest?.map((field) => field.name) || [],
  });

  // Handle both paginated and non-paginated response formats
  const bookmarkData = bookmarkResponse?.data || bookmarkResponse || [];
  const totalPages =
    bookmarkResponse?.totalPages || Math.ceil(bookmarkData.length / pageSize);
  const totalItems = bookmarkResponse?.totalItems || bookmarkData.length;

  if (bookmarkError) {
    return (
      <div className="w-full px-5 lg:px-20">
        <div className="w-full flex items-center mb-6 border-b pb-2 gap-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600"
          >
            ← Back
          </Button>
          <h3 className="text:base xl:text-xl font-bold text-[#1C1C1C]">
            Bookmarks
          </h3>
        </div>

        <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
          <p className="text-red-600">
            Error loading bookmarks. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 lg:px-20">
      <div className="w-full flex items-center mb-6 border-b pb-2 gap-2">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-600"
        >
          ← Back
        </Button>
        <h3 className="text:base xl:text-xl font-bold text-[#1C1C1C]">
          Bookmarks {!isBookmarkLoading && `(${totalItems})`}
        </h3>
      </div>

      {isBookmarkLoading ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
            {Array.from({ length: pageSize }).map((_, index) => (
              <ReportCardSkeleton key={index} />
            ))}
          </div>
          <PaginationSkeleton />
        </>
      ) : Array.isArray(bookmarkData) && bookmarkData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
            {bookmarkData.map((report: BookmarkedReport) => (
              <ReportCard
                key={report._id}
                report={transformReport(report)}
                onClick={() => navigateToReport(report.slug)}
                isBookmarked={true}
              />
            ))}
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <Pagination
              currentPage={bookmarkResponse?.currentPage || currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showInfo={true}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              className="mt-8"
            />
          )}
        </>
      ) : (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              You haven&apos;t bookmarked any reports yet
            </p>
            <Button
              onClick={() => router.push("/blog")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Explore Reports
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
