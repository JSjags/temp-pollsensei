import React, { useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import Image from "next/image";
import { LockIcon, PaystackLogo, StripeLogo, VisaLogo } from "@/assets/images";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";

const PaymentOptionsData = [
  {
    label: "Card",
    src: VisaLogo,
  },
  {
    label: "Stripe",
    src: StripeLogo,
  },
  {
    label: "Paystack",
    src: PaystackLogo,
  },
];

export function CheckoutDialog() {
  const [selectedOption, setSelectedOption] = useState<string | null>("Card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [mobileView, setMobileView] = useState<"details" | "overview">(
    "overview"
  );

  const { pollAmount, pollcoins, loading, setLoading, setPollStep } = useShopStore();

  const txnOverview = [
    {
      label: "Amount of Pollcoins",
      value: pollcoins,
    },
    {
      label: "Unit Price",
      value: 0.25,
    },
    {
      label: "VAT",
      value: 0.05,
    },
    {
      label: "Transaction Fee",
      value: 0.01,
    },
    {
      label: "Coin Cost",
      value: pollAmount,
    },
  ];

  // These are just for testing
  const resetLocalState = () => {
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
    setSelectedOption("Card");
  };

  const handleCheckout = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPollStep("success");
      resetLocalState();
    }, 5000);
  };

  return (
    <Dialog.Body className="h-full mt-2.5">
      <div className="flex gap-14 h-full max-[440px]:flex-row-reverse">
        <div
          className={cn(
            "w-[55%] flex flex-col gap-4 details h-full max-[440px]:w-full",
            mobileView !== "details" && "max-[440px]:hidden"
          )}
        >
          <h3 className="text-2xl font-bold text-tertiary">Checkout</h3>
          <div className="flex items-center bg-sec-bg p-4">
            <p>
              Payments are SSL encrypted so that your credit card and payment
              details stay safe.
            </p>
            <Image src={LockIcon} alt="lock icon" />
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-4">
            {PaymentOptionsData.map((option) => (
              <PaymentOptions
                {...option}
                key={option.label}
                isActive={selectedOption === option.label}
                onClick={() => setSelectedOption(option.label)}
              />
            ))}
          </div>
          <div>
            <label htmlFor="name" className="text-sm">
              Card Holder Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter card holder name"
              className="mt-2 h-[54px]"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="number" className="text-sm">
              Card Number
            </label>
            <Input
              type="number"
              id="number"
              name="number"
              placeholder="Enter card number"
              className="mt-2 h-[54px]"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
              }}
            />
          </div>
          <div className="flex w-full items-center gap-2.5 min-[440px]:mt-auto">
            <div className="w-1/2">
              <label htmlFor="expiry" className="text-sm">
                Card Expiry Date
              </label>
              <Input
                type="number"
                id="expiry"
                name="expiry"
                placeholder="Enter CVV"
                className="mt-2 h-[54px]"
                value={cardExpiry}
                onChange={(e) => {
                  setCardExpiry(e.target.value);
                }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="number" className="text-sm">
                CVV
              </label>
              <Input
                type="number"
                id="cvv"
                name="cvv"
                placeholder="Enter CVV"
                className="mt-2 h-[54px]"
                value={cardCVV}
                onChange={(e) => {
                  setCardCVV(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden">
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
        </div>

        <div
          className={cn(
            "flex-1 overview h-full flex flex-col",
            mobileView !== "overview" && "max-[440px]:hidden"
          )}
        >
          <div className="min-[440px]:bg-sec-bg p-8 max-[440px]:px-4 flex items-center flex-col pb-20">
            <div className="flex items-center justify-between max-[440px]:justify-center w-full mb-6">
              <p className="text-xl font-bold">Order Summary</p>
              <button
                onClick={() => setPollStep("buy")}
                className="uppercase underline text-tertiary font-bold max-[440px]:hidden"
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
                    {item.label === "Amount of Pollcoins"
                      ? item.value
                      : `$${item.value}`}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">
                $
                {txnOverview
                  .filter((item) => item.label !== "Amount of Pollcoins")
                  .reduce((acc, item) => acc + Number(item.value), 0)
                  .toFixed(2)}
              </p>
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

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden gap-6">
            <Button
              onClick={() => setPollStep("buy")}
              variant="outline"
              size="lg"
              className="w-1/2 text-sec-text"
            >
              Edit
            </Button>
            <Button
              onClick={() => setMobileView("details")}
              variant="gradient"
              size="lg"
              className="w-1/2 rounded"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </Dialog.Body>
  );
}
type PaymentOptionsProps = {
  label: string;
  src: string;
  isActive: boolean;
  onClick: () => void;
};

const PaymentOptions = ({
  label,
  src,
  isActive,
  onClick,
}: PaymentOptionsProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border flex-1 py-6 rounded-[5px] transition-all duration-300 ease-in-out",
        {
          "border-[#D195FCCC]": isActive,
          "hover:border-[#D195FCCC]": !isActive,
        }
      )}
    >
      <div className="flex items-center flex-col">
        <p>{label}</p>
        <Image src={src} alt={label} />
      </div>
    </button>
  );
};

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
