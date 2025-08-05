"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React, { useEffect, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { Dialog } from "@/components/ui/new-dialog";
import { useDailyRate } from "@/components/shop/queries/useDailyRate";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";
import { usePollcoinOrderSummary } from "@/components/shop/queries/usePollcoinsPurchase";

import { LoadingSpinner } from "./CheckoutDialog";
import { OrderSummaryPayload } from "@/components/shop/types";

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
    setLoading,
    loading,
    setOrderSummary,
    setOrderBreakdown
  } = useShopStore();
  const { data: dailyRate, isLoading } = useDailyRate();
  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const pollcoinSummaryMutation = usePollcoinOrderSummary();

  // Default global rates (for users outside Nigeria)
  const [baseAmount, setBaseAmount] = useState<number | null>(null);
  const [baseCoins, setBaseCoins] = useState<number | null>(null);

  // Nigerian-specific rates
  const nairaAmount = 1; // ₦1500
  const nairaCoins = 1; // 2000 pollcoins

  useEffect(() => {
    if (dailyRate && dailyRate.baseAmount && dailyRate.baseCoins) {
      setBaseAmount(dailyRate.baseAmount);
      setBaseCoins(dailyRate.baseCoins);
    }
  }, [dailyRate]);

  useEffect(() => {
    if (pollcoins) {
      let calculatedAmount = "0.00";

      if (isNigeria) {
        calculatedAmount = (
          (parseFloat(pollcoins) * nairaAmount) /
          nairaCoins
        ).toFixed(2);
      } else if (baseAmount && baseCoins) {
        calculatedAmount = (
          (parseFloat(pollcoins) * baseAmount) /
          baseCoins
        ).toFixed(2);
      }

      setPollAmount(calculatedAmount);
    } else {
      setPollAmount("");
    }
  }, [pollcoins, baseAmount, baseCoins, isNigeria, setPollAmount]);

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
  
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: OrderSummaryPayload = {
      amount: parseFloat(pollAmount),
      pollcoins: parseFloat(pollcoins),
      currency: isNigeria ? "NGN" : "USD",
    };

    try {
      setLoading(true);

      const res = await pollcoinSummaryMutation.mutateAsync(payload);
      const summary = res?.data?.orderSummary;
      const breakdown = res?.data.breakdown

      if (summary) {
        setOrderSummary(summary);
        setOrderBreakdown(breakdown);
        setPollStep("checkout");
      }
    } catch (error) {
      console.error("Summary error", error);
      // Optionally show a toast or dialog error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Body>
      <div className="mt-5 flex flex-col items-center justify-center z-50 text-black">
        <p className="text-2xl font-bold text-new-tertiary">Buy Pollcoins</p>

        <div className="w-full">
          {/* Quantity of Pollcoins */}
          <div className="mt-12">
            <label htmlFor="pollcoins" className="text-sm text-new-tertiary">
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
            {isLoading ? (
              <Skeleton className="h-3 w-[50%] mt-2" />
            ) : (
              <p className="mt-1 text-xs text-new-tertiary">
                Today’s coin rate:{" "}
                {isNigeria
                  ? `₦${nairaAmount} / ${nairaCoins} pollcoins`
                  : `$${baseAmount} / ${baseCoins} pollcoins`}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md focus-within:ring-2 focus-within:ring-purple-800 focus-within:ring-offset-2">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              {locationLoading ? (
                <Skeleton className="h-3 w-[50%] mt-2" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cost ({isNigeria ? "₦" : "$"})
                </p>
              )}
            </div>
            <input
              type="number"
              name="pollAmount"
              placeholder="0.00"
              className="h-[54px] border flex-1 pl-2.5 outline-none"
              value={pollAmount}
              readOnly
            />
          </div>
          {pollErrors.amount && (
            <p className="mt-1 text-xs text-red-600">{pollErrors.amount}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !pollAmount || !pollcoins || (!baseAmount && !isNigeria)}
        variant="gradient"
        className="w-full rounded mt-12 gap-2"
      >
        {loading && <LoadingSpinner />}
        {loading ? "Processing..." : "Pay"}
      </Button>
    </Dialog.Body>
  );
}
