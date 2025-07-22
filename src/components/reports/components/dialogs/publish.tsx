import * as React from "react";
import { DialogBody, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SenseiIcon, ManualIcon } from "../../assets"; // adjust path
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReportOnboardState } from "../../queries/useOnboardState";
import Terms from "./terms";
import { useAiSummary } from "../../queries/useAISummary";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useReportDraftStore } from "../../stores";

type SummaryValue = "ai" | "manual";

interface SummaryMethod {
  label: string;
  value: SummaryValue;
  // If your icons are React components that accept className (SVGs), type like this:
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PublishDialogProps {
  /** Controlled value */
  reportId: string;
  reportName: string;
  value?: SummaryValue;
  /** Initial selection when uncontrolled */
  defaultValue?: SummaryValue;
  /** Called whenever user picks a method */
  onValueChange?: (val: SummaryValue) => void;
}

const summaryMethods: SummaryMethod[] = [
  { label: "Summarize with AI", value: "ai", icon: SenseiIcon },
  { label: "Summarize Manually", value: "manual", icon: ManualIcon },
];

export function PublishDialog({
  value,
  defaultValue,
  reportId,
  onValueChange,
  reportName,
}: PublishDialogProps) {
  const { data: onboardResp } = useReportOnboardState();
  const aiSummaryMutation = useAiSummary();
  const setSummaryMethod = useReportDraftStore((s) => s.setSummaryMethod);
  const setSummaryContent = useReportDraftStore((s) => s.setSummaryContent);
  const router = useRouter();
  const acceptedTerms = Boolean(onboardResp?.accepted_terms);
  const [internal, setInternal] = React.useState<SummaryValue | null>(
    defaultValue ?? null
  );
  const active = value ?? internal;
console.log(onboardResp, "onboardResp");

  const handleSelect = (val: SummaryValue) => {
    console.log("handleSelect called with:", val);

    // Update local state for controlled/uncontrolled behavior
    if (!value) {
      setInternal(val);
    }
    // Call the external onChange handler if provided
    onValueChange?.(val);
    // Update the store
    setSummaryMethod(val);
  };
  const handleCardClick = () => {
    // Navigate to draft page with report ID and title as query params
    router.push(
      `/reports/drafts/${reportId}?title=${encodeURIComponent(reportName)}`
    );
  };
  const handleProceed = () => {
    console.log("handleProceed called with active:", active);
    if (!active) return;

    if (active === "manual") {
      console.log("Navigating to drafts (manual)");
      router.push(
        `/reports/drafts/${reportId}?title=${encodeURIComponent(reportName)}`
      );
    } else if (active === "ai") {
      console.log("Starting AI summary mutation");
      aiSummaryMutation.mutate(reportId, {
        onSuccess: () => {
          console.log("AI summary success");
          toast.success("AI summary generated successfully!");
          router.push(
            `/reports/drafts/${reportId}?title=${encodeURIComponent(
              reportName
            )}`
          );
        },
        onError: (err: any) => {
          console.log("AI summary error:", err);
          toast.error(err.message || "Failed to generate AI summary");
        },
      });
    }
  };


  return (
    <DialogBody className="w-full">
      <div className="gap-10 flex items-center justify-center flex-col w-full">
        <h3 className="font-bold text-xl text-sec-text">
          Select Summary Method
        </h3>
        <div className="flex items-center gap-6 w-full">
          {summaryMethods.map((method) => {
            const Icon = method.icon;
            const isActive = active === method.value;

            return (
              <button
                key={method.value}
                type="button"
                onClick={() => handleSelect(method.value)}
                aria-pressed={isActive}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors relative",
                  "text-sm font-medium text-left",
                  "border-border bg-background hover:bg-accent hover:text-accent-foreground flex-col text-sec-text",
                  isActive &&
                    "border-tertiary bg-tertiary/10 text-tertiary hover:bg-tertiary/20"
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
          <DialogClose>
            <Button variant="outline" className="rounded">
              Cancel
            </Button>
          </DialogClose>

          {!acceptedTerms ? (
            <Terms
              active={active}
              onAgree={() => {
                console.log("Terms onAgree called");
                handleProceed();
              }}
            />
          ) : (
            <Button
              variant="gradient"
              className="rounded"
              disabled={!active || aiSummaryMutation.isPending}
              onClick={() => {
                console.log("Proceed button clicked");
                handleProceed();
              }}
            >
              {aiSummaryMutation.isPending ? "Processing..." : "Proceed"}
            </Button>
          )}
        </div>
      </div>
    </DialogBody>
  );
}

// export function PublishDialog({
//   value,
//   defaultValue,
//   reportId,
//   onValueChange,
// }: PublishDialogProps) {
//   const { data: onboardResp } = useReportOnboardState();
//   const aiSummaryMutation = useAiSummary();
//   const setSummaryMethod = useReportDraftStore((s) => s.setSummaryMethod);
//   const setSummaryContent = useReportDraftStore((s) => s.setSummaryContent);
//   const router = useRouter();
//   const acceptedTerms = Boolean(onboardResp?.accepted_terms);
//   const [internal, setInternal] = React.useState<SummaryValue | null>(
//     defaultValue ?? null
//   );
//   const active = value ?? internal;

//   const handleSelect = (val: SummaryValue) => {
//     setSummaryMethod(val);
//   };

//   const handleProceed = () => {
//     if (!active) return;

//     if (active === "manual") {
//       router.push("/reports/drafts");
//     } else if (active === "ai") {
//       aiSummaryMutation.mutate(reportId, {
//         onSuccess: () => {
//           toast.success("AI summary generated successfully!");
//           router.push("/reports/drafts");
//         },
//         onError: (err: any) => {
//           toast.error(err.message || "Failed to generate AI summary");
//         },
//       });
//     }
//   };

//   // const handleProceed = () => {
//   //   if (active === "manual") {
//   //     router.push(`/reports/drafts/${reportId}`);
//   //   } else if (active === "ai") {
//   //     aiSummaryMutation.mutate(reportId, {
//   //       onSuccess: (resp) => {
//   //         toast.success("AI summary generated successfully!");
//   //         setSummaryContent(resp?.summary ?? "");
//   //         router.push(`/reports/drafts/${reportId}`);
//   //       },
//   //       onError: (err: any) => {
//   //         toast.error(err.message || "Failed to generate AI summary");
//   //       },
//   //     });
//   //   }
//   // };
//   return (
//     <DialogBody className="w-full">
//       <div className="gap-10 flex items-center justify-center flex-col w-full">
//         <h3 className="font-bold text-xl text-sec-text">
//           Select Summary Method
//         </h3>
//         <div className="flex items-center gap-6 w-full">
//           {summaryMethods.map((method) => {
//             const Icon = method.icon;
//             const isActive = active === method.value;

//             return (
//               <button
//                 key={method.value}
//                 type="button"
//                 onClick={() => handleSelect(method.value)}
//                 aria-pressed={isActive}
//                 className={cn(
//                   "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors relative",
//                   "text-sm font-medium text-left",
//                   "border-border bg-background hover:bg-accent hover:text-accent-foreground flex-col text-sec-text",
//                   isActive &&
//                     "border-tertiary bg-tertiary/10 text-tertiary hover:bg-tertiary/20"
//                 )}
//               >
//                 <Icon className="size-16 shrink-0" />
//                 <span>{method.label}</span>
//                 {isActive && (
//                   <Image
//                     src={"/assets/report/check.svg"}
//                     alt="Selected"
//                     width={24}
//                     height={24}
//                     className="absolute top-2 right-2"
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         <div className="flex items-center gap-10">
//           <DialogClose>
//             <Button variant="outline" className="rounded">
//               Cancel
//             </Button>
//           </DialogClose>

//           {!acceptedTerms ? (
//             <Terms active={active} onAgree={() => handleProceed()} />
//           ) : (
//             <Button
//               variant="gradient"
//               className="rounded"
//               disabled={!active || aiSummaryMutation.isPending}
//               onClick={handleProceed}
//             >
//               {aiSummaryMutation.isPending ? "Processing..." : "Proceed"}
//             </Button>
//           )}
//         </div>
//       </div>
//     </DialogBody>
//   );
// }
