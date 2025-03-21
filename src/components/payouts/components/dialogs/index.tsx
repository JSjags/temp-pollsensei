import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";
import { FirstStep } from "./FirstStep";
import { usePayoutStore } from "../../store/usePayoutStore";
import { CheckoutDialog } from "./CheckoutDialog";
import { SuccessDialog } from "./SuccessDialog";

type BuyDialogProps = {
  children: ReactNode;
};
export function PayoutDialog({ children }: BuyDialogProps) {
  const {
    dialogOpen,
    setDialogOpen,
    step,
    setStep,
    coinAmount,
    coinQuantity,
    reset,
  } = usePayoutStore();
  const description = `You have successfully converted and withdrawn ${coinQuantity} coins ~ $${coinAmount}`;
  let DialogStepComponent = null;

  switch (step) {
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
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          if (step === "success") {
            reset();
          }
          setStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
          {
            "max-w-[941px]": step === "checkout",
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
