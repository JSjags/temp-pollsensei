import React, { ReactNode, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";

import { CheckoutDialog } from "./CheckoutDialog";
import { SuccessDialog } from "../SuccessDialog";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";
import { FirstStep } from "./FirstStep";

type BuyDialogProps = {
  children: ReactNode;
};
export default function BuyOCR({ children }: BuyDialogProps) {
  const {
    credits,
    reset,
    ocrDialogOpen,
    ocrStep,
    setOCRDialogOpen,
    setOCRStep,
  } = useShopStore();
  const description = `You have purchased ${credits} Pollcoins`;
  let DialogStepComponent = null;

  switch (ocrStep) {
    case "buy":
      DialogStepComponent = <FirstStep />;
      break;
    case "checkout":
      DialogStepComponent = <CheckoutDialog />;
      break;
    case "success":
      DialogStepComponent = <SuccessDialog successMessage={description} />;
      break;
    default:
      DialogStepComponent = <FirstStep />;
  }
  return (
    <Dialog.Root
      open={ocrDialogOpen}
      onOpenChange={(open) => {
        setOCRDialogOpen(open);
        if (!open) {
          if (ocrStep === "success") {
            reset();
          }
          setOCRStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
          {
            "max-w-[941px]": ocrStep === "checkout",
          }
        )}
      >
        <div className="flex items-center justify-center w-full pt-3 min-[441px]:hidden">
          <div className="w-[155px] h-1 bg-[#D9D9D9] rounded-[10px]" />
        </div>
        {DialogStepComponent}
      </Dialog.Content>
    </Dialog.Root>
  );
}
