import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DownloadIcon, More, ShareIcon } from "@/assets/images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PublishDialog } from "./dialogs/publish";
import { usePreviewReportById } from "../queries/useCategories";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
// ReportCard (controlled popover)
// -----------------------------------------------------------------------------
export type ReportCardProps = {
  report: any; // TODO: replace with a proper Report type
  onCardClick: () => void;
  onShareClick: () => void;
  onDownloadClick: () => void;
  onDeleteClick: () => void;
  onDuplicateClick: () => void;
  onRenameClick: () => void;
  isDeleting?: boolean;
  isDuplicating?: boolean;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
};

export function ReportCard({
  report,
  onShareClick,
  onDownloadClick,
  onDeleteClick,
  onDuplicateClick,
  onRenameClick,
  isDeleting,
  isDuplicating,
  popoverOpen,
  onCardClick,
  onPopoverOpenChange,
}: ReportCardProps) {
  const router = useRouter()
  const {data} = usePreviewReportById(report._id)
console.log(data, "report data in ReportCard");
  const moreContent = [
    { label: "Rename", action: onRenameClick },
    { label: "View Report", action: onCardClick },
   ...(data?.post
    ? [
        {
          label: "View Published Post",
          action: () => {
            router.push(`/preview/${report._id}?view=post`);
          },
        },
      ]
    : []),
    {
      label: isDuplicating ? "Duplicating..." : "Duplicate",
      action: onDuplicateClick,
      duplicating: true, // used to defer closing until success
    },
    { label: "Share", action: onShareClick },
    {
      label: isDeleting ? "Deleting..." : "Delete",
      action: onDeleteClick,
      destructive: true,
    },
  ];

  return (
    <div
      // onClick={onCardClick}
      // onClick={handleCardClick} // Added the click handler back
      className="border bg-white hover:shadow transition py-8 px-4 rounded-[10.43px] cursor-pointer duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between mb-2 w-full">
        <h4
          className="text-xl truncate whitespace-nowrap overflow-hidden max-w-[90%]"
          title={report.name}
        >
          {report.name}
        </h4>
        <Popover open={popoverOpen} onOpenChange={onPopoverOpenChange}>
          <PopoverTrigger asChild>
            <button type="button">
              <Image src={More} alt="More options" width={24} height={24} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="!w-fit p-2">
            <div className="flex flex-col gap-4">
              {moreContent.map((item, idx) => {
                const disabled =
                  (item.duplicating && isDuplicating) ||
                  (item.destructive && isDeleting);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                      if (!item.duplicating) {
                        onPopoverOpenChange(false);
                      }
                    }}
                    className={cn(
                      "text-left text-sm cursor-pointer bg-transparent hover:bg-secondary hover:text-tertiary p-2 px-3 rounded transition-all duration-300 ease-in-out",
                      item.destructive &&
                        "text-[#FF3E3E] hover:bg-[#FF3E3E]/20 hover:text-[#FF3E3E]/85 disabled:opacity-50",
                      item.duplicating && "disabled:opacity-50"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
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
            <Button variant={report.status === 'draft'?"gradient":'destructive'} className="rounded-md">
             {report.status === 'draft'?"Publish":"Unpublish"}
            </Button>
          </DialogTrigger>
          <DialogContent className="py-14 px-10 w-[100vw]" showXBtn={false}>
            <PublishDialog
              reportId={report?._id}
              reportName={report?.name}
              report={report}
            />
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
}
