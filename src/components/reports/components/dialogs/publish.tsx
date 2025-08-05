import * as React from "react";
import { DialogBody, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SenseiIcon, ManualIcon } from "../../assets"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReportOnboardState } from "../../queries/useOnboardState";
import Terms from "./terms";
import { useAiSummary } from "../../queries/useAISummary";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useReportDraftStore } from "../../stores";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";

type SummaryValue = "ai" | "manual";

type SummaryMethod = {
  label: string;
  value: SummaryValue;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PublishDialogProps {
  report: any; // Assuming 'report' is passed as a prop, adjust type as needed
  reportId: string;
  reportName: string;
  value?: SummaryValue;
  defaultValue?: SummaryValue;
  onValueChange?: (val: SummaryValue) => void;
}

const summaryMethods: SummaryMethod[] = [
  { label: "Summarize with AI", value: "ai", icon: SenseiIcon },
  { label: "Summarize Manually", value: "manual", icon: ManualIcon },
];

export function PublishDialog({
  report,
  value,
  defaultValue,
  reportId,
  onValueChange,
  reportName,
}: PublishDialogProps) {
  const { data: onboardResp, isLoading: isOnboardingLoading } = useReportOnboardState();
  const aiSummaryMutation = useAiSummary();
  const setSummaryMethod = useReportDraftStore((s) => s.setSummaryMethod);
  const setSummaryContent = useReportDraftStore((s) => s.setSummaryContent);
  const router = useRouter();
  const acceptedTerms = Boolean(onboardResp?.accepted_terms);

  const [internal, setInternal] = React.useState<SummaryValue | null>(
    defaultValue ?? null
  );
  const active = value ?? internal;

  // Track whether we've initiated navigation to prevent double‑clicks
  const [isRouting, setIsRouting] = React.useState(false);

  // compute main action button label
  const proceedLabel = React.useMemo(() => {
    if (aiSummaryMutation.isPending) return "Processing AI...";
    if (isRouting) {
      return active === "ai" ? "Proceeding with AI..." : "Proceeding Manually...";
    }
    if (!active) return "Proceed";
    return active === "ai" ? "Proceed with AI" : "Proceed (Manual)";
  }, [aiSummaryMutation.isPending, isRouting, active]);


  const pushToDraft = React.useCallback(() => {
  if (isRouting) return;
  setIsRouting(true);
  router.push(
    `/reports/drafts/${reportId}?title=${encodeURIComponent(reportName)}&url=${encodeURIComponent(report.url)}`
  );
}, [isRouting, router, reportId, reportName, report.url]);
  const handleSelect = (val: SummaryValue) => {
    if (!value) {
      setInternal(val);
    }
    onValueChange?.(val);
    setSummaryMethod(val);
  };


  const handleCardClick = (val: SummaryValue) => {
    handleSelect(val);
  };

  const handleProceed = () => {
    if (!active || isRouting) return;

    if (active === "manual") {
      pushToDraft();
      return;
    }

    // active === "ai"
    aiSummaryMutation.mutate(reportId, {
      onSuccess: (aiText: any) => {
        // store AI text if returned
        if (typeof aiText === "string") {
          setSummaryContent(aiText);
        } else if (aiText?.summary) {
          setSummaryContent(aiText.summary);
        }
        toast.success("AI summary generated successfully!");
        pushToDraft();
      },
      onError: (err: any) => {
        console.log("AI summary error:", err);
        toast.error(err?.message || "Failed to generate AI summary");
      },
    });
  };

  return (
    <DialogBody className="w-full">
      <div className="gap-10 flex items-center justify-center flex-col w-full">
        <h3 className="font-bold text-xl text-sec-text">Select Summary Method</h3>

        <div className="flex items-center gap-6 w-full">
          {summaryMethods.map((method) => {
            const Icon = method.icon;
            const isActive = active === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => handleCardClick(method.value)}
                aria-pressed={isActive}
                disabled={isRouting || aiSummaryMutation.isPending}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors relative",
                  "text-sm font-medium text-left",
                  "border-border bg-background hover:bg-accent hover:text-accent-foreground flex-col text-sec-text",
                  isActive &&
                    "border-tertiary bg-tertiary/10 text-tertiary hover:bg-tertiary/20",
                  (isRouting || aiSummaryMutation.isPending) && "opacity-60 cursor-not-allowed"
                )}
              >
                <Icon className="size-16 shrink-0" />
                <span>{method.label}</span>
                {isActive && (
                  <Image
                    src={"/assets/report/check.svg"}
                    alt="Selected"
                    width={24}
                    height={24}
                    className="absolute top-2 right-2"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-10">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded"
              disabled={isRouting || aiSummaryMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          {!acceptedTerms ? (
            <Terms
              active={active}
              // prevent repeat triggers during routing/mutation
              onAgree={() => {
                if (isRouting || aiSummaryMutation.isPending) return;
                handleProceed();
              }}
            />
          ) : (
            <Button
              variant="gradient"
              className="rounded"
              disabled={!active || aiSummaryMutation.isPending || isRouting ||isOnboardingLoading}
              onClick={handleProceed}
            >
              {aiSummaryMutation.isPending || isRouting ||isOnboardingLoading && <LoadingSpinner/>}
              {proceedLabel}
            </Button>
          )}
        </div>
      </div>
    </DialogBody>
  );
}
