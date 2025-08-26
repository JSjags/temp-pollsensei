"use client";
import React, { useState } from "react";
import ReportCard from "@/components/blog/ReportCard";
import SidebarReportCard from "@/components/blog/SidebarReportCard";
import FeaturedReportCarousel from "@/components/blog/FeaturedReportCarousel";
import Pagination from "@/components/blog/Pagination";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  GetLatestReport,
  GetMostRecentReport,
  GetPopularReport,
} from "@/services/api/apiRequest";
import {
  ReportCardSkeleton,
  SidebarCardSkeleton,
  FeaturedCarouselSkeleton,
  PaginationSkeleton,
} from "@/components/blog/Skeletons";

interface Report {
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

interface PaginatedResponse {
  data: Report[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

interface BlogDashboardProps {
  activeFilter: "dashboard" | "category" | "interest";
  filterData?: PaginatedResponse | Report[];
  isFilterLoading: boolean;
  filterType: "dashboard" | "category" | "interest";
}

const BlogDashboard: React.FC<BlogDashboardProps> = ({
  activeFilter,
  filterData,
  isFilterLoading,
  filterType,
}) => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  // Pagination state for popular reports (only used in dashboard view)
  const [popularReportsPage, setPopularReportsPage] = useState(1);
  const [popularReportsPageSize] = useState(9);

  // Pagination state for filtered content
  const [filterPage, setFilterPage] = useState(1);
  const [filterPageSize] = useState(9);

  // Only fetch dashboard-specific data when in dashboard mode
  const {
    data: latestReport,
    isLoading: isLatestReportLoading,
    isError: isLatestReportError,
  } = useQuery({
    queryKey: [APP_KEYS.LAEST_REPORTS],
    queryFn: GetLatestReport,
    enabled: activeFilter === "dashboard",
  });

  const {
    data: recentReports = [],
    isLoading: isRecentReportsLoading,
    isError: isRecentReportsError,
  } = useQuery({
    queryKey: [APP_KEYS.MOST_RECENT_REPORTS],
    queryFn: GetMostRecentReport,
    enabled: activeFilter === "dashboard",
  });

  const {
    data: popularReportsResponse,
    isLoading: isPopularReportsLoading,
    isError: isPopularReportsError,
  } = useQuery({
    queryKey: [APP_KEYS.POPULAR_REPORTS],
    queryFn: () => GetPopularReport(),
    enabled: activeFilter === "dashboard",
  });

  const navigateToReport = (slug: string) => {
    router.push(`/blog/${slug}`, { scroll: false });
  };

  const transformReport = (report: any) => ({
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
    tags: report.fields_of_interest?.map((field: any) => field.name) || [],
  });

  // Transform data for dashboard view
  const latestReportData = latestReport ? [transformReport(latestReport)] : [];
  const recentReportsData = Array.isArray(recentReports)
    ? recentReports.map(transformReport)
    : [];
  const popularReports =
    popularReportsResponse?.data || popularReportsResponse || [];
  const popularReportsData = Array.isArray(popularReports)
    ? popularReports.map(transformReport)
    : [];

  // Handle filter data
  const getFilteredReports = () => {
    if (!filterData) return [];

    const reports = Array.isArray(filterData)
      ? filterData
      : filterData.data || [];
    return reports.map(transformReport);
  };

  const filteredReports = getFilteredReports();
  const totalPages =
    filterData && !Array.isArray(filterData)
      ? filterData.totalPages
      : Math.ceil(filteredReports.length / filterPageSize);
  const totalItems =
    filterData && !Array.isArray(filterData)
      ? filterData.totalItems
      : filteredReports.length;

  const handlePopularReportsPageChange = (page: number) => {
    setPopularReportsPage(page);
    document.getElementById("reports-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleFilterPageChange = (page: number) => {
    setFilterPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Error handling
  const isAnyError =
    activeFilter === "dashboard"
      ? isLatestReportError || isRecentReportsError || isPopularReportsError
      : false;

  if (isAnyError) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          Error loading reports. Please try again.
        </div>
      </div>
    );
  }

  // Render filtered view (Category/Interest/Explore All)
  if (activeFilter !== "dashboard") {
    return (
      <div className="min-h-screen w-full bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeFilter === "category"
                ? "Category Reports"
                : activeFilter === "interest"
                ? "Interest Reports"
                : "All Reports"}
            </h2>
            <p className="text-gray-600 mt-2">
              {activeFilter === "category"
                ? "Reports tailored to your selected categories"
                : activeFilter === "interest"
                ? "Reports matching your interests"
                : "Explore all available reports"}
            </p>
          </div>

          {isFilterLoading ? (
            <>
              <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
                {Array.from({ length: filterPageSize }).map((_, index) => (
                  <ReportCardSkeleton key={index} />
                ))}
              </div>
              <PaginationSkeleton />
            </>
          ) : filteredReports.length > 0 ? (
            <>
              <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
                {filteredReports.map((report: any) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    onClick={() => navigateToReport(report.slug)}
                  />
                ))}
              </div>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={
                    filterData && !Array.isArray(filterData)
                      ? filterData.currentPage
                      : filterPage
                  }
                  totalPages={totalPages}
                  onPageChange={handleFilterPageChange}
                  showInfo={true}
                  totalItems={totalItems}
                  itemsPerPage={filterPageSize}
                  className="mt-8"
                />
              )}
            </>
          ) : (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  {activeFilter === "category"
                    ? "No category reports found"
                    : activeFilter === "interest"
                    ? "No interest reports found"
                    : "No reports found"}
                </p>
                <Button
                  onClick={() => router.push("/blog")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Explore All Reports
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Render dashboard view (default)
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="w-full grid lg:grid-cols-2 gap-3 h-auto">
            {/* Left Column - Featured (Latest Report) */}
            <div className="h-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest</h2>

              {isLatestReportLoading ? (
                <FeaturedCarouselSkeleton />
              ) : latestReportData.length > 0 ? (
                <FeaturedReportCarousel
                  reports={latestReportData}
                  onReportClick={(report: any) => {
                    navigateToReport(report.slug);
                  }}
                />
              ) : (
                <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">No latest reports available</p>
                </div>
              )}
            </div>

            {/* Right Column - Most Recent Reports */}
            <div className="flex flex-col h-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Most Recent Reports
              </h3>

              <div
                className="grid lg:grid-cols-2 gap-7 xl:gap-3 flex-1"
                style={{
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gridTemplateRows: "1fr 1fr",
                  height: "100%",
                }}
              >
                {isRecentReportsLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="grid-item">
                        <SidebarCardSkeleton />
                      </div>
                    ))
                  : Array.from({ length: 4 }).map((_, index) => {
                      const report = recentReportsData[index];
                      if (!report) {
                        return (
                          <div
                            key={index}
                            className="grid-item bg-gray-100 rounded-lg flex items-center justify-center"
                          >
                            &nbsp;
                          </div>
                        );
                      }

                      return (
                        <div key={report._id} className="grid-item">
                          <SidebarReportCard
                            report={report}
                            onClick={() => navigateToReport(report.slug)}
                          />
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>

          {/* Reports Grid with Pagination */}
          <div className="w-full" id="reports-section">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
              Popular Reports
            </h3>

            {isPopularReportsLoading ? (
              <>
                <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
                  {Array.from({ length: popularReportsPageSize }).map(
                    (_, index) => (
                      <ReportCardSkeleton key={index} />
                    )
                  )}
                </div>
                <PaginationSkeleton />
              </>
            ) : popularReportsData.length > 0 ? (
              <>
                <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3 mb-8">
                  {popularReportsData.map((report: any) => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      onClick={() => navigateToReport(report.slug)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={
                    popularReportsResponse?.currentPage || popularReportsPage
                  }
                  totalPages={
                    popularReportsResponse?.totalPages ||
                    Math.ceil(
                      popularReportsData.length / popularReportsPageSize
                    )
                  }
                  onPageChange={handlePopularReportsPageChange}
                  showInfo={true}
                  totalItems={
                    popularReportsResponse?.totalItems ||
                    popularReportsData.length
                  }
                  itemsPerPage={popularReportsPageSize}
                  className="mt-8"
                />
              </>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No popular reports available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDashboard;
