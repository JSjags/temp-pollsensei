"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePreviewReportById, useReports } from "@/components/reports/queries/useCategories";
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
import { SurveyCardSkeleton } from "@/components/reports/components/MyReports";
import { toast } from "react-toastify";
import { useDeleteReport } from "@/components/reports/queries/useDeleteReports";
import { DeleteConfirmDialog } from "@/components/reports/components/dialogs/confirm-dialog";
import { useDuplicateReport } from "@/components/reports/queries/useDuplicateReport";
import { RenameDialog } from "@/components/reports/components/dialogs/rename-dialog";
import { useRenameReport } from "@/components/reports/queries/useRenameReports";
import { useSearchReports } from "@/components/reports/queries/useSearchReports";
import { Button as ShadButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShareDialog } from "@/components/reports/components/dialogs/share-dialog";
import { ReportCard } from "@/components/reports/components/report-card";

export default function ReportsPage() {
  const params = useParams();
  const surveyId = params.id as string;
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(6);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(6);

  const { data, isLoading, isError } = useReports(
    surveyId,
    tab,
    page,
    pageSize
  );
  const { refetch } = useReports(surveyId, tab, page, pageSize);
 

  const deleteMutation = useDeleteReport();
  const duplicateMutation = useDuplicateReport();
  const renameMutation = useRenameReport();

  // rename dialog state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<{
    id: string;
    name: string;
    shareLink: string;
  } | null>(null);

  const { data: searchData, isLoading: searchLoading } = useSearchReports(
    debouncedSearch,
    page,
    pageSize
  );
  const [openPopoverMap, setOpenPopoverMap] = useState<Record<string, boolean>>(
    {}
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Only set debounced search if there's actual input
    if (value.trim()) {
      setDebouncedSearch(value.trim());
    } else {
      setDebouncedSearch("");
    }
  };

  const setPopoverOpen = (reportId: string, open: boolean) => {
    setOpenPopoverMap((prev) => ({ ...prev, [reportId]: open }));
  };

  const handleRenameClick = (report: any) => {
    setRenameTarget({ id: report._id, name: report.name });
    setRenameDialogOpen(true);
    // close the menu immediately
    setPopoverOpen(report._id, false);
  };

  const handleShareClick = (report: any) => {
    // Generate or get the share link for the report
    const shareLink = `${window.location.origin}/reports/shared/${report._id}`;
    setShareTarget({
      id: report._id,
      name: report.name,
      shareLink,
    });
    setShareDialogOpen(true);
    // close the menu immediately
    setPopoverOpen(report._id, false);
  };

  const handleShareInvite = (emails: string) => {
    // Implement your invite logic here
    console.log("Inviting emails:", emails);

    // Split emails and filter out empty strings
    const emailArray = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const emailCount = emailArray.length;

    if (emailCount === 0) {
      toast.error("Please enter at least one email address");
      return;
    }

    // Show appropriate success message based on email count
    const message =
      emailCount === 1
        ? "Invitation sent successfully!"
        : "Invitations sent successfully!";
    toast.success(message);

    // You can add API call here to send invitations
    // Example: await sendInvitations(shareTarget?.id, emailArray);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleRenameConfirm = (name: string) => {
    if (!renameTarget) return;
    renameMutation.mutate(
      { report_id: renameTarget.id, name },
      {
        onSuccess: () => {
          refetch();
          setRenameDialogOpen(false);
          setRenameTarget(null);
        },
      }
    );
  };

  const handleDeleteClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setDeleteDialogOpen(true);
    setPopoverOpen(reportId, false);
  };

  const handleConfirmDelete = () => {
    if (!selectedReportId) return;
    deleteMutation.mutate(selectedReportId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedReportId(null);
      },
    });
  };

  // Duplicate: leave popover open while pending; close on success (requirement)
  const handleDuplicateClick = (reportId: string) => {
    duplicateMutation.mutate(reportId, {
      onSuccess: () => {
        // useDuplicateReport already toasts & invalidates
        // here we close that specific popover + refetch the current page
        setPopoverOpen(reportId, false);
        refetch();
      },
    });
  };

  const handleDownload = async (
    url: string,
    filename: string,
    reportId?: string
  ) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
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
      toast.error("Failed to download the report. Please try again.");
    } finally {
      if (reportId) setPopoverOpen(reportId, false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && page > 1 && (data?.data?.length ?? 0) === 0) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [isLoading, isError, data, page]);

  const currentReports = (
    debouncedSearch ? searchData?.data ?? [] : data?.data ?? []
  ).sort((a: any, b: any) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    // Extract base name (without "-copy" suffix)
    const baseNameA = nameA.replace(/ -copy$/, "");
    const baseNameB = nameB.replace(/ -copy$/, "");

    // If base names are different, sort alphabetically
    if (baseNameA !== baseNameB) {
      return baseNameA.localeCompare(baseNameB);
    }

    // If base names are the same, original comes before copy
    if (nameA.includes("-copy") && !nameB.includes("-copy")) {
      return 1;
    }
    if (!nameA.includes("-copy") && nameB.includes("-copy")) {
      return -1;
    }

    // If both are copies or both are originals, sort by creation time or ID
    return (b.createdAt || b._id).localeCompare(a.createdAt || a._id);
  });
  const isLoadingReports = debouncedSearch ? searchLoading : isLoading;

  return (
    <div className="mx-auto mt-6 px-4 relative flex flex-col h-screen">
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(value)}
        className="mb-6 w-full"
      >
        <div className="sticky top-0 w-fu">
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
        </div>

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
                placeholder="Search reports"
                className="w-full bg-transparent outline-none"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <FilterButton />
          </div>
        </div>

        {/* <ScrollArea> */}
        <Tabs.Content value={tab} className="">
          {isLoadingReports ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <SurveyCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load reports.</p>
          ) : currentReports.length === 0 ? (
            <Card className="w-full max-w-3xl mx-auto mt-[10vh] border-none shadow-none bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center p-6 text-center space-y-8"
              >
                {/* Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative w-full max-w-[320px] aspect-square"
                >
                  <Image
                    src="/assets/survey-list/no-survey.svg"
                    alt="No surveys created"
                    fill
                    className="object-contain"
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-4 max-w-[600px]"
                >
                  {debouncedSearch ? (
                    <p className="text-base text-muted-foreground">
                      No reports found for &quot;
                      <span className="font-semibold">{debouncedSearch}</span>
                      &quot;. Try a different search term.
                    </p>
                  ) : (
                    <p className="text-base text-muted-foreground">
                      You have not created any report yet. Think on how to
                      start? We can help you do the difficult part using our
                      generative-AI capabilities to create your dream survey.
                    </p>
                  )}
                </motion.div>
                {/* Button */}
                {!debouncedSearch && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <ShadButton
                      className="auth-btn text-white px-8 !h-12 text-lg rounded-lg hover:scale-105 transition-transform"
                      onClick={() => router.push("/surveys/survey-list")}
                    >
                      Generate Report
                    </ShadButton>
                  </motion.div>
                )}
              </motion.div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentReports.map((report: any) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onDownloadClick={() =>
                    handleDownload(
                      report.url,
                      `${report.name}.docx`,
                      report._id
                    )
                  }
                  onShareClick={() => handleShareClick(report)}
                  onDeleteClick={() => handleDeleteClick(report._id)}
                  onDuplicateClick={() => handleDuplicateClick(report._id)}
                  onRenameClick={() => handleRenameClick(report)}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === report._id
                  }
                  isDuplicating={
                    duplicateMutation.isPending &&
                    duplicateMutation.variables === report._id
                  }
                  popoverOpen={!!openPopoverMap[report._id]}
                  onPopoverOpenChange={(open) =>
                    setPopoverOpen(report._id, open)
                  }
                />
              ))}
            </div>
          )}
        </Tabs.Content>
        {/* </ScrollArea> */}
      </Tabs.Root>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false);
            setSelectedReportId(null);
          } else {
            setDeleteDialogOpen(true);
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Rename Dialog */}
      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={(open) => {
          setRenameDialogOpen(open);
          if (!open) {
            setRenameTarget(null);
          }
        }}
        currentName={renameTarget?.name || ""}
        onConfirm={handleRenameConfirm}
        isLoading={renameMutation.isPending}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={(open) => {
          setShareDialogOpen(open);
          if (!open) {
            setShareTarget(null);
          }
        }}
        reportName={shareTarget?.name || ""}
        shareLink={shareTarget?.shareLink || ""}
        onInvite={handleShareInvite}
      />

      {/* Pagination */}
      <div className="flex w-full items-center justify-between sticky bottom-4 mt-auto">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">Results per page</p>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // Reset to first page when page size changes
            }}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-tertiary"
          >
            {[6, 9, 12, 15, 18].map((size) => (
              <option key={size} value={size} className="w-16">
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-4 space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={!currentReports.length || currentReports.length < 9}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

