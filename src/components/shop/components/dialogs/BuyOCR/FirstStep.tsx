import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadcn-input";
import React, { useEffect, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { Dialog } from "@/components/ui/new-dialog";
import { Banner } from "../../Banner";
import { useUserBalance } from "@/components/shop/queries/useBalance";

export function FirstStep() {
  const { ocrCredits, setOCRCredits, ocrAmount, setOCRAmount, ocrStep, setOCRStep } =
    useShopStore();

  const [error, setError] = useState("");

  const RATE = 5;
  const { data } = useUserBalance();
  const { unrestrictedBalance = 0 } = data || {};

  useEffect(() => {
    if (ocrCredits) {
      const calculatedAmount = (parseFloat(ocrCredits) / RATE).toFixed(2);
      setOCRAmount(calculatedAmount);
    } else {
      setOCRAmount("");
    }
  }, [ocrCredits, setOCRAmount]);

  const validate = () => {
    const quantityNum = parseFloat(ocrCredits);

    if (!ocrCredits) {
      setError("OCR credit amount is required.");
      return false;
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Enter a valid OCR credit quantity.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setOCRStep("checkout");
  };

  const isBalanceZero = unrestrictedBalance === 0;

  return (
    <Dialog.Body className="flex flex-col h-full">
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-8">OCR Document Scan Credit</p>

        <Banner />

        <div className="w-full">
          <div className="mt-5">
            <label htmlFor="credits" className="text-sm">
              Amount of OCR Document Scan Credit
            </label>
            <Input
              type="number"
              name="credits"
              placeholder="Enter OCR Credit amount"
              className="mt-2 h-[54px]"
              value={ocrCredits}
              onChange={(e) => {
                setOCRCredits(e.target.value);
                if (error) setError("");
              }}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <p className="mt-1 text-xs">
              Today&apos;s OCR document scan rate: 1 Pollcoin = {RATE} OCR
              document scan
            </p>
          </div>

          <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
            <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
              <p className="text-sm text-muted-foreground">Pollcoin Amount</p>
            </div>

            <input
              type="text"
              value={ocrAmount}
              readOnly
              className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {isBalanceZero && (
        <p className="text-sm text-red-500 mt-4 text-center">
          You don&apos;t have any Pollcoins. Please top up to buy OCR document
          scan credit.
        </p>
      )}

      <div className="flex mt-auto w-full">
        <Button
          onClick={handleSubmit}
          disabled={!ocrCredits}
          variant="gradient"
          className="w-full rounded mt-12 max-[441px]:!h-12"
        >
          Pay Now
        </Button>
      </div>
    </Dialog.Body>
  );
}
