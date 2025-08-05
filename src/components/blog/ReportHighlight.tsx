"use client";
import { MdOutlineShowChart } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { GetReportStats } from "@/services/api/apiRequest";

const ReportHighlight = () => {
  const {
    data: reportStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: [APP_KEYS.REPORT_STATS],
    queryFn: () => GetReportStats(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stats</div>;
  if (!reportStats || !Array.isArray(reportStats) || reportStats.length === 0) {
    return <div>No stats available</div>;
  }

  const stats = reportStats[0];

  return (
    <div className="w-full flex items-center gap-3 bg-transparent">
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
