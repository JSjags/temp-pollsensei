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
import { Loader2, Bot, FileEdit } from "lucide-react";

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

// Loading overlay component
const LoadingOverlay = ({ message, subMessage }: { message: string; subMessage?: string }) => (
  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-tertiary" />
        <div className="absolute inset-0 h-8 w-8 animate-ping text-tertiary/20">
          <Loader2 className="h-8 w-8" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-900">{message}</p>
        {subMessage && (
          <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
        )}
      </div>
    </div>
  </div>
);

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

  // Determine current loading state
  const isProcessingAI = aiSummaryMutation.isPending;
  const isLoading = isRouting || isProcessingAI || isOnboardingLoading;

  // compute main action button label
  const proceedLabel = React.useMemo(() => {
    if (isProcessingAI) return "Processing AI...";
    if (isRouting) {
      return active === "ai" ? "Proceeding with AI..." : "Proceeding Manually...";
    }
    if (isOnboardingLoading) return "Loading...";
    if (!active) return "Proceed";
    return active === "ai" ? "Proceed with AI" : "Proceed (Manual)";
  }, [isProcessingAI, isRouting, isOnboardingLoading, active]);

  // Get loading message based on state
  const getLoadingMessage = () => {
    if (isProcessingAI) {
      return {
        message: "Generating AI Summary",
        subMessage: "Our AI is analyzing your survey data and creating a comprehensive summary..."
      };
    }
    if (isRouting) {
      return {
        message: active === "ai" ? "Preparing AI Editor" : "Preparing Manual Editor",
        subMessage: "Setting up your draft environment..."
      };
    }
    if (isOnboardingLoading) {
      return {
        message: "Loading",
        subMessage: "Checking your account status..."
      };
    }
    return { message: "Loading..." };
  };

  const pushToDraft = React.useCallback(() => {
    if (isRouting) return;
    setIsRouting(true);
    router.push(
      `/reports/drafts/${reportId}?title=${encodeURIComponent(reportName)}&url=${encodeURIComponent(report.url)}`
    );
  }, [isRouting, router, reportId, reportName, report.url]);

  const handleSelect = (val: SummaryValue) => {
    if (isLoading) return; // Prevent selection during loading
    
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
    if (!active || isLoading) return;

    if (active === "manual") {
      pushToDraft();
      return;
    }

    // active === "ai"
    aiSummaryMutation.mutate(reportId, {
      onSuccess: (response: any) => {
        
        // Handle the response structure based on your API
        let summaryUrl = null;
        let summaryText = null;

        if (response?.data?.summary_url) {
          // Store the URL from the API response
          summaryUrl = response.data.summary_url;
          setSummaryContent(summaryUrl);
        } else if (response?.summary_url) {
          summaryUrl = response.summary_url;
          setSummaryContent(summaryUrl);
        } else if (typeof response === "string") {
          // Direct text response
          summaryText = response;
          setSummaryContent(summaryText);
        } else if (response?.summary) {
          summaryText = response.summary;
          setSummaryContent(summaryText);
        } else {
          // Fallback - store whatever we got
          setSummaryContent(response);
        }

        toast.success("AI summary generated successfully!");
        pushToDraft();
      },
      onError: (err: any) => {
        console.log("AI summary error:", err);
        setIsRouting(false); // Reset routing state on error
        toast.error(err?.message || "Failed to generate AI summary");
      },
    });
  };

  const loadingState = getLoadingMessage();

  return (
    <DialogBody className="w-full relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingState.message} subMessage={loadingState.subMessage} />}
      
      <div className={cn(
        "gap-10 flex items-center justify-center flex-col w-full transition-opacity duration-300",
        isLoading && "opacity-50"
      )}>
        <h3 className="font-bold text-xl text-sec-text">Select Summary Method</h3>

        <div className="flex items-center gap-6 w-full overflow-hidden max-md:flex-col">
          {summaryMethods.map((method) => {
            const Icon = method.icon;
            const isActive = active === method.value;
            const isDisabled = isLoading;
            
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => handleCardClick(method.value)}
                aria-pressed={isActive}
                disabled={isDisabled}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 relative",
                  "text-sm font-medium text-left flex-col text-sec-text",
                  "border-border bg-background hover:bg-accent hover:text-accent-foreground",
                  isActive &&
                    "border-tertiary bg-tertiary/10 text-tertiary hover:bg-tertiary/20",
                  isDisabled && "opacity-60 cursor-not-allowed",
                  !isDisabled && !isActive && "hover:scale-[1.02] hover:shadow-md"
                )}
              >
                <div className="relative">
                  <Icon className="size-16 shrink-0" />
                  {/* Processing indicator for AI method */}
                  {method.value === "ai" && isProcessingAI && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-6 animate-spin text-tertiary" />
                    </div>
                  )}
                  {/* Routing indicator */}
                  {isRouting && isActive && (
                    <div className="absolute -top-1 -right-1">
                      <div className="size-4 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                        <div className="size-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "transition-colors duration-200",
                  isProcessingAI && method.value === "ai" && "text-tertiary"
                )}>
                  {method.label}
                </span>
                {isActive && !isLoading && (
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

        {/* Progress indicators */}
        {isProcessingAI && (
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Bot className="size-4 text-tertiary" />
              <span>AI is working on your summary...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-tertiary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </div>
        )}

        {isRouting && (
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <FileEdit className="size-4 text-green-600" />
              <span>Preparing your draft editor...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "80%" }}></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-10">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>

          {!acceptedTerms ? (
            <Terms
              active={active}
              // prevent repeat triggers during loading
              onAgree={() => {
                if (isLoading) return;
                handleProceed();
              }}
            />
          ) : (
            <Button
              variant="gradient"
              className={cn(
                "rounded relative transition-all duration-200",
                isLoading && "cursor-not-allowed"
              )}
              disabled={!active || isLoading}
              onClick={handleProceed}
            >
              <div className="flex items-center gap-2">
                {isLoading && <LoadingSpinner />}
                <span>{proceedLabel}</span>
              </div>
              
              {/* Subtle pulse effect when processing */}
              {isProcessingAI && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded"></div>
              )}
            </Button>
          )}
        </div>
      </div>
    </DialogBody>
  );
}