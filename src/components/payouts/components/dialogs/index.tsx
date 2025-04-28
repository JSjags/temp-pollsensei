import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";
import { FirstStep } from "./FirstStep";
import { usePayoutStore } from "../../store/usePayoutStore";
import { CheckoutDialog } from "./CheckoutDialog";
import { SuccessDialog } from "./SuccessDialog";
import Redeemable from "@/components/shop/components/dialogs/Redeemable";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";

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
    redeemableCoins,
    threshold,
  } = usePayoutStore();
  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const description = `You have successfully converted and withdrawn ${coinQuantity} coins ~ ${isNigeria ? "₦" : "$"}${Number(coinAmount).toLocaleString()}`;

  let DialogStepComponent: React.ReactNode;
  const desc =
    "Your redeemable coins has not reached the transfer minimum of 50 coins. Refer friends to Earn more redeemable coins";
  if (redeemableCoins < threshold) {
    DialogStepComponent = <Redeemable desc={desc} />;
  } else {
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
