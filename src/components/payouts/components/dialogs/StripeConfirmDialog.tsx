import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
import { formatNumber } from "../../functions";
import { useStripePayout } from "@/lib/payout";
import { StripePayoutBank } from "@/services/api/getStripePayoutBanks";
import { toast } from "react-toastify";
import { usePayoutStore } from "../../store/usePayoutStore";

type StripeConfirmDialogProps = {
  children: ReactNode;
  response: StripePayoutBank;
  payAmount: string;
  gateway: string;
};
export default function StripeConfirmDialog(props: StripeConfirmDialogProps) {
  const { response, children, payAmount, gateway } = props;
  const { account_name, account_number, sort_code, _id } = response;
  const { mutate: stripePayout, isPending: stripePayoutLoading } =
    useStripePayout();
  const { setStep, setWasRedirected, loading, setGateway } = usePayoutStore();

  const isProcessing = loading || stripePayoutLoading;
  const confirmationData = [
    {
      label: "Account Name",
      value: account_name || "",
    },
    {
      label: "Account Number",
      value: account_number || "",
    },
    {
      label: "Sort Code",
      value: sort_code || "",
    },
    {
      label: "Coin Amount",
      value: formatNumber(Number(payAmount)) || "",
    },
  ];
  const handleStripeRedirectedConfirmation = () => {
    if (!response) {
      toast.error("No payout bank available for Stripe");
      return;
    }

    const payoutBankId = _id;

    const amount = Number(payAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }
    localStorage.setItem("payoutGateway", gateway);
    setGateway(gateway);
    console.log(gateway);
    stripePayout(
      {
        amount,
        payout_bank_id: payoutBankId,
      },
      {
        onSuccess: (data) => {
          toast.success("Stripe payout processed successfully");
          setWasRedirected(false);
          setStep("success");
          // Additional success handling if needed
        },
        onError: (error) => {
          toast.error("Failed to process Stripe payout");
          console.error("Stripe payout error:", error);
        },
      }
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[10000000000000]"
        className="z-[10000000000000000]"
      >
        <DialogHeader>
          <DialogTitle>Confirm Payout Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-8">
          {confirmationData.map((item) => {
            const { label, value } = item;
            return (
              <div key={label} className="flex items-center gap-3">
                <p className="min-w-[140px]">{label}</p>
                <input
                  className="h-10 flex-1 pl-2.5 outline-none text-muted-foreground select-none border rounded-md bg-muted/50"
                  readOnly
                  value={value}
                />
              </div>
            );
          })}
        </div>

        <DialogFooter className="w-full">
          <div className="flex gap-4 w-full">
            <DialogClose className="w-1/2">
              <Button variant={"outline"} className="min-w-full">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="gradient"
              className="w-1/2 rounded-md gap-2"
              onClick={handleStripeRedirectedConfirmation}
              disabled={isProcessing}
            >
              {isProcessing && <LoadingSpinner />}
              {isProcessing ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
