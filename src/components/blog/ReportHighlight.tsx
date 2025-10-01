"use client";
import { MdOutlineShowChart } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  GetReportStats,
  GetReportBookmarksCount,
} from "@/services/api/apiRequest";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ReportHighlight = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();
  const {
    data: reportStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: [APP_KEYS.REPORT_STATS],
    queryFn: () => GetReportStats(),
  });

  const { data: bookmarkStats } = useQuery({
    queryKey: [APP_KEYS.REPORTS_BOOKMARK_COUNT],
    queryFn: () => GetReportBookmarksCount(),
    enabled: !!user,
  });

  if (isLoading)
    return (
      <div className="animate-pulse h-1 bg-gray-200 rounded w-20">&nbsp;</div>
    );
  if (error) return <div>Error loading stats</div>;
  if (!reportStats || !Array.isArray(reportStats) || reportStats.length === 0) {
    return <div>No stats available</div>;
  }

  const stats = reportStats[0];

  return (
    <div className="w-full flex items-center gap-3 bg-transparent">
      {user && (
        <p
          className="text-[#1C1C1C] text-base cursor-pointer hover:underline"
          onClick={() => router.push("/blog/bookmarks")}
        >
          Bookmarks{" "}
          <span className="text-[#A9A9B1] text-sm">
            {" "}
            ({bookmarkStats?.bookmarked_reports_count}){" "}
          </span>{" "}
        </p>
      )}
      <div className="w-auto flex items-center gap-1">
        <span className="font-bold text-base text-[#1C1C1C]">
          +{stats.total_published_reports || 0}
        </span>
        <span className="text-[#A9A9B1] text-sm">Published Reports</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[#1CE718] text-[10px]">
          +{stats.published_this_month || 0}
        </span>
        <MdOutlineShowChart className="text-[#1CE718]" />
        <span className="text-[#9A9595] text-[10px]">This Month</span>
      </div>
      <div className="w-auto flex items-center gap-2">
        <span className="font-[#1C1C1C] text-base">
          {stats.total_unique_publishers || 0}
        </span>
        <span className="text-[#A9A9B1] text-sm">
          {(stats.total_unique_publishers || 0) === 1
            ? "Publisher"
            : "Publishers"}
        </span>
      </div>
    </div>
  );
};

export default ReportHighlight;
