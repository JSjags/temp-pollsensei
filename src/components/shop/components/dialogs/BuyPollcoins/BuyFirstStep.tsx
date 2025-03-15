import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React from "react";
import { useShopStore } from "../../../store/useShopStore";
import { Dialog } from "@/components/ui/new-dialog";

export function BuyFirstStep() {
  const {
    pollAmount,
    pollcoins,
    pollErrors,
    setPollAmount,
    setPollcoins,
    setPollErrors,
    clearPollError,
    setPollStep,
  } = useShopStore();

  const validate = () => {
    const newErrors: { amount?: string; quantity?: string } = {};
    const amountNum = parseFloat(pollAmount);
    const quantityNum = parseFloat(pollcoins);

    if (!pollcoins) {
      newErrors.quantity = "Pollcoin amount is required.";
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Enter a valid quantity greater than 0.";
    }

    if (!pollAmount) {
      newErrors.amount = "Cost is required.";
    } else if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0.";
    }

    setPollErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPollStep("checkout");
  };

  return (
    <Dialog.Body>
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold">Buy Pollcoins</p>

        <div className="w-full">
          {/* Quantity of Pollcoins */}
          <div className="mt-12">
            <label htmlFor="pollcoins" className="text-sm">
              Amount of Pollcoins
            </label>
            <Input
              type="number"
              name="pollcoins"
              placeholder="500"
              className="mt-2 h-[54px]"
              value={pollcoins}
              onChange={(e) => {
                setPollcoins(e.target.value);
                if (pollErrors.quantity) clearPollError("quantity");
              }}
            />
            {pollErrors.quantity && (
              <p className="mt-1 text-xs text-red-600">{pollErrors.quantity}</p>
            )}
            <p className="mt-1 text-xs">Today’s coin rate: $5 / 20 pollcoins</p>
          </div>

          {/* Cost*/}
          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md focus-within:ring-2 focus-within:ring-purple-800 focus-within:ring-offset-2">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              <p className="text-sm text-muted-foreground">Cost ($)</p>
            </div>
            <input
              type="number"
              name="pollAmount"
              placeholder="0.00"
              className="h-[54px] border flex-1 pl-2.5 outline-none"
              value={pollAmount}
              onChange={(e) => {
                setPollAmount(e.target.value);
                if (pollErrors.amount) clearPollError("amount");
              }}
            />
          </div>
          {pollErrors.amount && (
            <p className="mt-1 text-xs text-red-600">{pollErrors.amount}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!pollAmount || !pollcoins}
        variant="gradient"
        className="w-full rounded mt-12"
      >
        Pay Now
      </Button>
    </Dialog.Body>
  );
}
