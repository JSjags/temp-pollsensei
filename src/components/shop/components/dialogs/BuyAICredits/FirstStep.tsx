import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React, { useEffect } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { Dialog } from "@/components/ui/new-dialog";

export function FirstStep() {
  const {
    credits,
    aiAmount,
    aiErrors,
    setAiAmount,
    setCredits,
    setAiErrors,
    clearAiError,
    setAIStep,
  } = useShopStore();

  const RATE = 5;

  useEffect(() => {
    if (credits) {
      const calculatedAmount = (parseFloat(credits) / RATE).toFixed(2);
      setAiAmount(calculatedAmount);
    } else {
      setAiAmount("");
    }
  }, [credits, setAiAmount]);

  const validate = () => {
    const newErrors: { quantity?: string } = {};
    const quantityNum = parseFloat(credits);

    if (!credits) {
      newErrors.quantity = "AI-Credit amount is required.";
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Enter a valid AI-Credit quantity.";
    }

    setAiErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setAIStep("checkout");
  };

  return (
    <Dialog.Body className="flex flex-col h-full">
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold">Buy AI-Credit</p>

        <div className="w-full">
          <div className="mt-12">
            <label htmlFor="credits" className="text-sm">
              Amount of AI-Credit
            </label>
            <Input
              type="number"
              name="credits"
              placeholder="Enter AI-Credit amount"
              className="mt-2 h-[54px]"
              value={credits}
              onChange={(e) => {
                setCredits(e.target.value);
                if (aiErrors.quantity) clearAiError("quantity");
              }}
            />
            {aiErrors.quantity && (
              <p className="mt-1 text-xs text-red-600">{aiErrors.quantity}</p>
            )}
            <p className="mt-1 text-xs">
              Today&apos;s AI-Credit rate: 1 Pollcoin = {RATE} AI-Credits
            </p>
          </div>

          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              <p className="text-sm text-muted-foreground">Pollcoin Amount</p>
            </div>

            <input
              type="text"
              value={aiAmount}
              readOnly
              className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex mt-auto w-full">
        <Button
          onClick={handleSubmit}
          disabled={!credits}
          variant="gradient"
          className="w-full rounded mt-12 max-[441px]:!h-12"
        >
          Pay Now
        </Button>
      </div>
    </Dialog.Body>
  );
}
