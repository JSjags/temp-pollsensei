import React, { ReactNode } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { BuyFirstStep } from "./BuyFirstStep";
import { CheckoutDialog } from "./CheckoutDialog";
import { SuccessDialog } from "../SuccessDialog";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";

type BuyDialogProps = {
  children: ReactNode;
};
export default function BuyPollcoinsFlow({ children }: BuyDialogProps) {
  const {
    pollDialogOpen,
    setPollDialogOpen,
    pollstep,
    setPollStep,
    pollcoins,
    reset,
  } = useShopStore();
  const description = `You have purchased ${pollcoins} Pollcoins`;
  let DialogStepComponent = null;

  switch (pollstep) {
    case "buy":
      DialogStepComponent = <BuyFirstStep />;
      break;
    case "checkout":
      DialogStepComponent = <CheckoutDialog />;
      break;
    case "success":
      DialogStepComponent = <SuccessDialog successMessage={description} />;
      break;
    default:
      DialogStepComponent = <BuyFirstStep />;
  }
  return (
    <Dialog.Root
      open={pollDialogOpen}
      onOpenChange={(open) => {
        setPollDialogOpen(open);
        if (!open) {
          if (pollstep === "success") {
            reset();
          }
          setPollStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]",
          {
            "max-w-[941px]": pollstep === "checkout",
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
