"use client";
import React from "react";
import ReportCard from "@/components/blog/ReportCard";
import SidebarReportCard from "@/components/blog/SidebarReportCard";
import FeaturedReportCarousel from "@/components/blog/FeaturedReportCarousel";
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
}

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();

  const {
    data: latestReport,
    isLoading: isLatestReportLoading,
    isError: isLatestReportError,
  } = useQuery({
    queryKey: [APP_KEYS.LAEST_REPORTS],
    queryFn: GetLatestReport,
  });

  const {
    data: recentReports = [],
    isLoading: isRecentReportsLoading,
    isError: isRecentReportsError,
  } = useQuery({
    queryKey: [APP_KEYS.MOST_RECENT_REPORTS],
    queryFn: GetMostRecentReport,
  });

  const {
    data: popularReports = [],
    isLoading: isPopularReportsLoading,
    isError: isPopularReportsError,
  } = useQuery({
    queryKey: [APP_KEYS.POPULAR_REPORTS],
    queryFn: GetPopularReport,
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

  const latestReportData = latestReport ? [transformReport(latestReport)] : [];

  const recentReportsData = Array.isArray(recentReports)
    ? recentReports.map(transformReport)
    : [];

  const popularReportsData = Array.isArray(popularReports)
    ? popularReports.map(transformReport)
    : [];

  const isAnyLoading =
    isLatestReportLoading || isRecentReportsLoading || isPopularReportsLoading;
  const isAnyError =
    isLatestReportError || isRecentReportsError || isPopularReportsError;

  if (isAnyError) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          Error loading reports. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <main className="min-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3 h-auto">
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
                className="flex flex-col xl:grid gap-7 xl:gap-3 flex-1"
                style={{
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gridTemplateRows: "1fr 1fr",
                  height: "100%",
                }}
              >
                {isRecentReportsLoading
                  ? // Show skeleton for all 4 slots
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="grid-item">
                        <SidebarCardSkeleton />
                      </div>
                    ))
                  : // Render recent reports with empty placeholders
                    Array.from({ length: 4 }).map((_, index) => {
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

          {/* Reports Grid */}
          <div className="w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
              Reports
            </h3>

            {isPopularReportsLoading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ReportCardSkeleton key={index} />
                ))}
              </div>
            ) : popularReportsData.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-7 xl:gap-3">
                {popularReportsData.map((report: any) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    onClick={() => navigateToReport(report.slug)}
                  />
                ))}
              </div>
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

export default Dashboard;
