import * as React from "react";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SenseiIcon, ManualIcon } from "../../assets"; // adjust path
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReportOnboardState } from "../../queries/useOnboardState";
import Terms from "./terms";

type SummaryValue = "ai" | "manual";

interface SummaryMethod {
  label: string;
  value: SummaryValue;
  // If your icons are React components that accept className (SVGs), type like this:
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PublishDialogProps {
  /** Controlled value */
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
  onValueChange,
}: PublishDialogProps) {
  const { data:  onboardResp , isLoading, error } = useReportOnboardState();
  const acceptedTerms = onboardResp?.data?.accepted_terms ?? false;
  const [internal, setInternal] = React.useState<SummaryValue | null>(
    defaultValue ?? null
  );
  const active = value ?? internal;

  const handleSelect = (val: SummaryValue) => {
    if (onValueChange) onValueChange(val);
    if (value === undefined) setInternal(val);
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

          {!acceptedTerms && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={!active}
                  variant={"gradient"}
                  className="rounded"
                >
                  Proceed
                </Button>
              </DialogTrigger>
              <DialogContent
                className="min-w-[800px] max-h-[650px]"
                showXBtn={false}
              >
                <Terms />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </DialogBody>
  );
}
