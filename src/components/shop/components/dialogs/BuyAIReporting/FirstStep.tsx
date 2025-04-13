import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React, { useEffect, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { Dialog } from "@/components/ui/new-dialog";
import { Banner } from "../../Banner";
import { useUserBalance } from "@/components/shop/queries/useBalance";
import BuyPollcoinsFlow from "../BuyPollcoins";
import { useAIAnalysisRate } from "@/components/shop/queries/useServicesRates";

export function FirstStep() {
  const {
    aiReportingCredit,
    setAIReportingDialogOpen,
    setAIReportingCredits,
    setAIReportingStep,
    aiReportingAmount,
    setAIReportingAmount,
    setPollStep,
    setPollDialogOpen,
  } = useShopStore();
  const [error, setError] = useState("");
  const RATE = 5;
  const { data } = useUserBalance();
  // const { unrestrictedBalance = 0 } = data || {};
  const unrestrictedBalance = 400;
  // const { data: rate } = useAIAnalysisRate();
  
  const pollcoinRequired = aiReportingCredit
    ? parseFloat(aiReportingCredit) / RATE
    : 0;

  const hasValidCredits =
    aiReportingCredit !== "" &&
    !isNaN(pollcoinRequired) &&
    pollcoinRequired > 0;

  const isBalanceInsufficient =
    hasValidCredits && pollcoinRequired > unrestrictedBalance;

  useEffect(() => {
    if (aiReportingCredit) {
      const calculatedAmount = (parseFloat(aiReportingCredit) / RATE).toFixed(
        2
      );
      setAIReportingAmount(calculatedAmount);
    } else {
      setAIReportingAmount("");
    }
  }, [aiReportingCredit, setAIReportingAmount]);

  const validate = () => {
    const quantityNum = parseFloat(aiReportingCredit);

    if (!aiReportingCredit) {
      setError("AI reporting credit amount is required.");
      return false;
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Enter a valid AI reporting credit quantity.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setAIReportingStep("checkout");
  };

  return (
    <Dialog.Body className="flex flex-col h-full max-[440px]:px-6">
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-8">AI Report Generation Credit</p>

        <Banner />
        <div className="w-full">
          <div className="mt-5">
            <label htmlFor="credits" className="text-sm">
              Amount of AI Report Credit
            </label>
            <Input
              type="number"
              name="credits"
              placeholder="Enter AI Report Generation amount"
              className="mt-2 h-[54px]"
              value={aiReportingCredit}
              onChange={(e) => {
                setAIReportingCredits(e.target.value);
                if (error) setError("");
              }}
              // disabled={isBalanceInsufficient}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <p className="mt-1 text-xs">
              Today&apos;s AI-Credit rate: 1 Pollcoin = {RATE} Survey Report
              Generation
            </p>
          </div>

          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              <p className="text-sm text-muted-foreground">Pollcoin Amount</p>
            </div>

            <input
              type="text"
              value={aiReportingAmount}
              readOnly
              className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {isBalanceInsufficient && (
        <div className="text-sm text-[#FF0E0E] mt-4">
          You don’t have enough coins for this purchase.{" "}
          <BuyPollcoinsFlow nested>
            <button
              className="text-tertiary cursor-pointer underline"
              onClick={() => {
                setAIReportingDialogOpen(false);
                setPollStep("buy");
                setPollDialogOpen(true);
              }}
            >
              Purchase coin
            </button>
          </BuyPollcoinsFlow>{" "}
          to complete your purchase
        </div>
      )}

      <div className="flex mt-auto w-full">
        <Button
          onClick={handleSubmit}
          disabled={isBalanceInsufficient || !aiReportingCredit}
          variant="gradient"
          className="w-full rounded mt-12 max-[441px]:!h-12"
        >
          Pay Now
        </Button>
      </div>
    </Dialog.Body>
  );
}
