"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/shadcn-input";
import { cn } from "@/lib/utils";
import React, { ReactNode, useState, useEffect } from "react";
import { useConfirmPayout } from "../../queries/useConfirmPayment";
import Image from "next/image";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";

type finalizePaymentProps = {
  children: ReactNode;
  transferCode: string;
  amount: number;
  onSuccess?: () => void;
};

export default function FinalizePayment({
  children,
  transferCode,
  amount,
  onSuccess,
}: finalizePaymentProps) {
  const [otp, setOTP] = useState("");
  const { mutateAsync, isPending } = useConfirmPayout();
  const [view, setView] = useState<"confirm" | "success">("confirm");
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await mutateAsync({ transfer_code: transferCode, otp });
      setView("success");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setView("confirm")}>
        {children}
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[1000000000]"
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]"
        )}
      >
        {view === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Payout</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p>Transfer Code</p>
                <input
                  className="h-10 flex-1 pl-2.5 outline-none text-muted-foreground select-none border rounded-md bg-muted/50"
                  readOnly
                  value={transferCode}
                />
              </div>
              <div className="flex items-center gap-3 w-full">
                <p className="min-w-[27%]">Received OTP</p>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  className="h-10 flex-1"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setOTP(value);
                    }
                  }}
                  autoFocus
                />
              </div>

              <Button
                variant="gradient"
                className="mt-8 rounded-md gap-2"
                onClick={handleConfirm}
                disabled={!otp || isPending}
              >
                {isPending && <LoadingSpinner />}
                {isPending ? "Confirming..." : "Confirm Payment"}
              </Button>
            </div>
          </>
        )}

        {view === "success" && (
          <div>
            <div className="flex items-center justify-center w-full">
              <Image
                src={"/assets/shop/coffetti.png"}
                alt="Confetti celebration"
                width={300}
                height={300}
              />
            </div>
            <div className="flex items-center justify-center w-full mt-6 flex-col">
              <p className="text-[28px] font-bold">Congratulations</p>
              <p className="max-w-[215px] text-center text-muted-foreground">
                ₦{amount} successfully paid out.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}