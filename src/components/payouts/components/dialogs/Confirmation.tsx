import React, { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatNumber } from "../../functions";
import { Button } from "@/components/ui/button";
import { usePaystackPayout, usePaystackPreviousPayoutBank } from "@/lib/payout";
import { usePreviousPayoutBank } from "../../queries/usePreviousPayoutBank";
import { toast } from "react-toastify";
import { usePayoutStore } from "@/components/payouts/store/usePayoutStore";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";

type ConfirmationDialogProps = {
  name: string;
  accountNumber: string;
  bankName: string | undefined;
  bankCode: string | undefined;
  children: ReactNode;
  amount: string;
};

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { name, accountNumber, bankName, children, bankCode, amount } = props;
  const { setLoading, setStep, loading } = usePayoutStore();
  const { mutate: paystackPayout, isPending: payoutLoading } =
    usePaystackPayout();
  const { mutate: previousPaystackPayout, isPending: previousPayoutLoading } =
    usePaystackPreviousPayoutBank();
  const { data: previousBank } = usePreviousPayoutBank();
  const hasPreviousBank = previousBank?.data?.length > 0;
  const isProcessing = loading || payoutLoading;
  const confirmationData = [
    {
      label: "Account Name",
      value: name || "",
    },
    {
      label: "Account Number",
      value: accountNumber || "",
    },
    {
      label: "Bank Name",
      value: bankName || "",
    },
    {
      label: "Coin Amount",
      value: formatNumber(Number(amount)) || "",
    },
  ];

  const handlePaystackCheckout = () => {
    // Validate form fields
    if (
      !name.trim() ||
      name
        .trim()
        .split(" ")
        .filter((part) => part.length > 0).length < 2
    ) {
      toast.error("Please enter your full name (first and last name)");
      return;
    }

    if (!accountNumber.trim()) {
      toast.error("Account number is required");
      return;
    }

    if (!bankCode) {
      toast.error("Please select a bank");
      return;
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }

    setLoading(true);

    if (hasPreviousBank && previousBank?.data?.length > 0) {
      const previousPayoutData = {
        payout_bank_id: previousBank.data[0]._id,
        amount: numericAmount,
      };
      previousPaystackPayout(previousPayoutData, {
        onSuccess: (data) => {
          setLoading(false);
          setStep("success");
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Payout failed");
          console.error("Previous bank payout failed:", error);
        },
      });
    } else {
      const payoutData = {
        account_name: name.trim(),
        account_number: accountNumber,
        bank_code: bankCode,
        amount: numericAmount,
      };

      paystackPayout(payoutData, {
        onSuccess: (data) => {
          setLoading(false);
          setStep("success");
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Payout failed");
          console.error("New bank payout failed:", error);
        },
      });
    }
  };

  return (
    <Dialog >
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
                Edit
              </Button>
            </DialogClose>
            <Button
              variant="gradient"
              className="w-1/2 rounded-md gap-2"
              onClick={handlePaystackCheckout}
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
