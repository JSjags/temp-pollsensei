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
export default function BuyAICredit({ children }: BuyDialogProps) {
  const { aiDialogOpen, setAIDialogOpen, aiStep, setAIStep, credits, reset } =
    useShopStore();
  const description = `You have purchased ${credits} Pollcoins`;
  let DialogStepComponent = null;

  switch (aiStep) {
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
      open={aiDialogOpen}
      onOpenChange={(open) => {
        setAIDialogOpen(open);
        if (!open) {
          if (aiStep === "success") {
            reset();
          }
          setAIStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
          {
            "max-w-[941px]": aiStep === "checkout",
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
