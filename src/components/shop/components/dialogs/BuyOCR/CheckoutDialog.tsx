import React from "react";
import { useShopStore } from "../../../store/useShopStore";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";

export function CheckoutDialog() {
  const { loading, setLoading, setAIStep, ocrCredits, ocrAmount } = useShopStore();

  const txnOverview = [
    {
      label: "Amount of OCR Scan Credits",
      value: ocrCredits,
    },
    {
      label: "Unit Price/coin",
      value: 5,
    },
    // {
    //   label: "VAT",
    //   value: 0.05,
    // },
    // {
    //   label: "Transaction Fee",
    //   value: 0.01,
    // },
    // {
    //   label: "Coin Cost",
    //   value: aiAmount,
    // },
  ];

  const handleCheckout = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setAIStep("success");
    }, 5000);
  };

  return (
    <Dialog.Body className="h-full mt-4 pb-6">
      <div className="flex gap-6 h-full items-center flex-col">
        <p className="text-2xl font-bold ">OCR Document Scan credit</p>
        {/* Overview section  */}
        <div className={cn("flex-1 overview h-full flex flex-col w-full")}>
          <div className="min-[440px]:bg-sec-bg p-8 max-[440px]:px-4 flex items-center flex-col pb-20">
            <div className="flex items-center justify-between w-full mb-6">
              <p className="text-xl font-bold">Order Summary</p>
              <button
                onClick={() => setAIStep("buy")}
                className="uppercase underline text-tertiary font-bold"
              >
                Edit
              </button>
            </div>
            <div className="flex-col flex gap-2 w-full">
              {txnOverview.map((item) => (
                <div
                  key={item.label}
                  className="w-full flex items-center justify-between border-b border-dashed pb-[14px]"
                >
                  <p className="text-sm font-bold">{item.label}</p>
                  <p>
                    {item.label === "Amount of OCR Scan Credits"
                      ? item.value
                      : `${item.value}pc`}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">{ocrAmount}pc</p>
            </div>
          </div>
          <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              variant="gradient"
              className="w-full rounded h-[53px] gap-2"
            >
              {loading && <LoadingSpinner />}
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden gap-6 px-4">
            <Button
              // onClick={() => setMobileView("details")}
              variant="gradient"
              size="lg"
              className="w-full rounded"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </Dialog.Body>
  );
}

const LoadingSpinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};
