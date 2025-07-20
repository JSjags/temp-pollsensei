"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReports } from "@/components/reports/queries/useCategories";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { FilterButton } from "@/components/reports/components/filter";
import {
  AllResearchIcon,
  DraftIcon,
  PublishedIcon,
} from "@/components/reports/assets";
import Image from "next/image";
import { DownloadIcon, More, ShareIcon } from "@/assets/images";
import { SurveyCardSkeleton } from "@/components/reports/components/MyReports";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { PublishDialog } from "@/components/reports/components/dialog/publish";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDeleteReport } from "@/components/reports/queries/useDeleteReports";
import { DeleteConfirmDialog } from "@/components/reports/components/dialog/confirm-dialog";

export default function ReportsPage() {
  const params = useParams();
  const surveyId = params.id as string;
  const router = useRouter();

  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const deleteMutation = useDeleteReport();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleDeleteClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedReportId) {
      deleteMutation.mutate(selectedReportId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedReportId(null);
        },
      });
    }
  };

  const { data, isLoading, isError } = useReports(surveyId, tab, page);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      // You might want to show a toast notification here
      toast.error("Failed to download the report. Please try again.");
    }
  };
  useEffect(() => {
    if (!isLoading && !isError && page > 1 && (data?.data?.length ?? 0) === 0) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [isLoading, isError, data, page]);

  const currentReports = data?.data ?? [];
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value)}
        className="mb-6 w-full"
      >
        <Tabs.List className="bg-white w-full flex items-center justify-center">
          {[
            { value: "all", label: "All Reports", Icon: AllResearchIcon },
            { value: "published", label: "Published", Icon: PublishedIcon },
            { value: "draft", label: "Drafts", Icon: DraftIcon },
          ].map(({ value, label, Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className={cn(
                "relative px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors",
                "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px]",
                "after:bg-transparent after:transition-all after:duration-300",
                "data-[state=active]:after:bg-tertiary data-[state=active]:text-tertiary"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  tab === value ? "text-tertiary" : "text-[#4F5B67]"
                )}
              />
              <span
                className={tab === value ? "text-tertiary" : "text-[#4F5B67]"}
              >
                {label}
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="flex justify-between items-center my-6">
          <h3
            className="text-lg font-semibold flex items-center gap-2 cursor-pointer hover:underline transition-all duration-300 ease-in-out"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" /> My Reports
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-lg bg-white p-2 md:min-w-[292px]">
              <SearchIcon className="text-[#9D50BB]" size={20} />
              <input
                type="search"
                placeholder="Search Survey"
                className="w-full bg-transparent"
              />
            </div>
            <FilterButton />
          </div>
        </div>
        <Tabs.Content value={tab}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <SurveyCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load reports.</p>
          ) : data?.data?.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data?.data?.map((report: any) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onDownloadClick={() =>
                    handleDownload(report.url, `${report.name}.docx`)
                  }
                  onShareClick={() => console.log("Share clicked")}
                  onDeleteClick={() => handleDeleteClick(report._id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!data?.data?.length || data.data.length < 9}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

type ReportCardProps = {
  report: any;
  onShareClick: () => void;
  onDownloadClick: () => void;
  onDeleteClick: () => void;
  isDeleting?: boolean;
};

function ReportCard ({
  report,
  onShareClick,
  onDownloadClick,
  onDeleteClick,
  isDeleting,
}:ReportCardProps){
  const moreContent = [
    { label: "Rename", action: () => {} },
    { label: "Duplicate", action: () => {} },
    { label: "Share", action: onShareClick },
    { label: "Delete", action: onDeleteClick, destructive: true },
  ];

  return (
    <div className="border bg-white hover:shadow transition py-8 px-4 rounded-[10.43px] cursor-pointer duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-2 w-full">
        <h4
          className="text-xl truncate whitespace-nowrap overflow-hidden max-w-[90%]"
          title={report.name}
        >
          {report.name}
        </h4>
        <Popover>
          <PopoverTrigger asChild>
            <button type="button">
              <Image src={More} alt="More options" width={24} height={24} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="!w-fit">
            <div className="flex flex-col gap-4">
              {moreContent.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={item.destructive && isDeleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                  }}
                  className={cn(
                    "text-left text-sm cursor-pointer bg-transparent hover:bg-secondary hover:text-tertiary p-2 px-3 rounded transition-all duration-300 ease-in-out",
                    item.destructive &&
                      "text-[#FF3E3E] hover:bg-[#FF3E3E]/20 hover:text-[#FF3E3E]/85 disabled:opacity-50"
                  )}
                >
                  {item.destructive && isDeleting ? "Deleting..." : item.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <p className="text-xs text-new-muted mb-3">
        Created: {new Date(report.createdAt).toLocaleDateString()}
      </p>

      <p
        className="text-sm text-new-muted mb-3 line-clamp-2"
        title={report.survey?.description}
      >
        {report.survey?.description}
      </p>

      <div className="mt-10 flex items-center justify-between">
        <Dialog>
          <DialogTrigger>
            <Button variant="gradient" className="rounded-md">
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent className="py-14 px-10 w-[100vw]" showXBtn={false}>
            <PublishDialog />
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareClick();
            }}
            className="hover:opacity-80 transition-opacity duration-300 ease-in-out"
          >
            <Image src={ShareIcon} alt="Share" width={24} height={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownloadClick();
            }}
            className="hover:opacity-80 transition-opacity duration-300 ease-in-out"
          >
            <Image src={DownloadIcon} alt="Download" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

function ShareDialog() {
  return <div></div>;
}
