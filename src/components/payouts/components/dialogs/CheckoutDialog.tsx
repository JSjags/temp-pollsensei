import React, { useEffect, useState } from "react";

import Image from "next/image";
import { VisaLogo, StripeLogo, LockIcon, PaystackLogo } from "@/assets/images";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn-input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/new-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { usePayoutStore } from "@/components/payouts/store/usePayoutStore";
import { Bank, useNigerianBanks } from "../../queries/useNigerianBanks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePaystackPayout,
  usePaystackPreviousPayoutBank,
  useStripePayout,
} from "@/lib/payout";
import { useGeoLocation } from "@/subpages/settings/subscription/PricingCards";
import { toast } from "react-toastify";
import { usePreviousPayoutBank } from "../../queries/usePreviousPayoutBank";
import ConfirmationDialog from "./Confirmation";
import StripeDialog from "./Stripe";
import { useStripePayoutBanks } from "../../queries/useStripePayoutBanks";
import { usePayoutConversionRate } from "../../queries/usePayoutConverionrate";
import StripeConfirmDialog from "./StripeConfirmDialog";

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
  // const [selectedOption, setSelectedOption] = useState<string | null>("Card");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [mobileView, setMobileView] = useState<"details" | "overview">(
    "overview"
  );
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    coinAmount,
    coinQuantity,
    loading,
    setStep,
    selectedOption,
    setSelectedOption,
    wasRedirected,
    setWasRedirected,
    setCoinAmount,
  } = usePayoutStore();
  const { data: banks, isLoading } = useNigerianBanks();

  const { data: PayoutBanks } = useStripePayoutBanks();
  const { mutate: paystackPayout, isPending: payoutLoading } =
    usePaystackPayout();

  const { data, isLoading: conversionLoading } = usePayoutConversionRate();
  const { mutate: stripePayout, isPending: stripePayoutLoading } =
    useStripePayout();
  const { data: previousBank } = usePreviousPayoutBank();
  const hasPreviousBank = previousBank?.data?.length > 0;
  const { data: locationData } = useGeoLocation();
  const isNigeria = locationData?.isNigeria;
  const isProcessing = loading || payoutLoading;

  useEffect(() => {
    if (!data) {
      setCoinAmount("");
      return;
    }
    const convertibleAmount = data?.convertible_amount;
    const rate =
      selectedOption === "Stripe"
        ? data?.conversion_rate?.USD
        : data?.conversion_rate?.NGN;

    if (convertibleAmount && rate && parseFloat(coinQuantity)) {
      const coinToCash = (parseFloat(coinQuantity) * rate).toFixed(2);
      setCoinAmount(coinToCash);
    } else {
      setCoinAmount("");
    }
  }, [coinQuantity, data, selectedOption, setCoinAmount]);

  const txnOverview = [
    {
      label: "Amount of Pollcoins",
      value: coinQuantity,
    },

    {
      label: "Amount in cash",
      value: coinAmount,
    },
  ];

  const handleSelectChange = (bankCode: string) => {
    const foundBank = banks?.find((bank) => bank.bank_code === bankCode);
    if (foundBank) {
      setSelectedBank(foundBank);
      setSearchQuery("");
    }
  };

  const handleCheckout = () => {
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

    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    // Validate amount
    const amount = Number(coinQuantity);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }

    setOpen(true);
  };
  const handleUsePreviousBank = () => {
    if (hasPreviousBank) {
      const bankData = previousBank.data[0];
      setName(bankData.account_name || "");
      setAccountNumber(bankData.account_number || "");
      const foundBank = banks?.find(
        (bank) => bank.bank_code === bankData.bank_code
      );
      if (foundBank) {
        setSelectedBank(foundBank);
      }
    }
  };

  const handleStripeRedirectedConfirmation = () => {
    if (!PayoutBanks || PayoutBanks?.length === 0) {
      toast.error("No payout bank available for Stripe");
      return;
    }

    // Get the first available payout bank ID
    const payoutBankId = PayoutBanks[0]?._id;

    // Validate amount
    const amount = Number(coinQuantity);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }

    // Call the Stripe payout mutation with the amount and payout bank ID
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
    <Dialog.Body className="h-full mt-2.5 min-[441px]:min-h-[620px]">
      <div className="flex gap-14 h-full max-[440px]:flex-row-reverse">
        {/* Form Details */}
        <motion.div
          layout
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

          {/* {selectedOption !== "Stripe" && ( */}
          <div className="flex flex-col h-full">
            <AnimatePresence mode="wait">
              <motion.form
                key="card-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col gap-4 h-full"
              >
                <div>
                  {selectedOption === "Paystack" && hasPreviousBank && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleUsePreviousBank}
                        type="button"
                        className="text-tertiary underline"
                      >
                        Use previous payout bank
                      </button>
                    </div>
                  )}
                  {selectedOption !== "Stripe" && (
                    <>
                      <label htmlFor="name" className="text-sm">
                        {selectedOption === "Paystack"
                          ? "Account Name"
                          : "Card Holder Name"}
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={
                          selectedOption === "Paystack"
                            ? "Enter account name"
                            : "Enter card holder name"
                        }
                        className="mt-2 h-[54px]"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </>
                  )}
                </div>
                {selectedOption !== "Paystack" &&
                  selectedOption !== "Stripe" && (
                    <>
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
                    </>
                  )}
                {selectedOption === "Paystack" && (
                  <>
                    <div>
                      <label htmlFor="number" className="text-sm">
                        Account Number
                      </label>
                      <Input
                        type="number"
                        id="number"
                        name="number"
                        placeholder="Enter account number"
                        className="mt-2 h-[54px]"
                        value={accountNumber}
                        onChange={(e) => {
                          setAccountNumber(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex w-full items-center gap-2.5">
                      <div className="w-full">
                        <label htmlFor="bank" className="text-sm">
                          Select Bank
                        </label>
                        <Select
                          value={selectedBank?.bank_code}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger className="mt-2 h-[54px] w-full">
                            <SelectValue placeholder="Choose a bank" />
                          </SelectTrigger>

                          <SelectContent
                            align="end"
                            className="rounded-xl z-[10000000000000000] relative"
                          >
                            {/* Search Input */}
                            <div className="px-2 py-1 fixed top-1 w-full z-40 left-0 right-0">
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300"
                                placeholder="Search banks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                              />
                            </div>

                            <div className="mt-12">
                              {banks
                                ?.filter(
                                  (bank) =>
                                    bank.is_active &&
                                    bank.bank_name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase())
                                )
                                .map((bank) => (
                                  <SelectItem
                                    key={bank.bank_code}
                                    value={bank.bank_code}
                                  >
                                    {bank.bank_name}
                                  </SelectItem>
                                ))}
                            </div>
                            {/* Filtered Banks List */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
            <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden">
              {selectedOption === "Paystack" ? (
                <ConfirmationDialog
                  name={name}
                  bankCode={selectedBank?.bank_code || ""}
                  bankName={selectedBank?.bank_name || ""}
                  accountNumber={accountNumber}
                  amount={coinQuantity}
                  gateway={selectedOption}
                >
                  <Button
                    disabled={
                      isProcessing ||
                      !selectedBank ||
                      !accountNumber ||
                      !name ||
                      accountNumber.length !== 10
                    }
                    variant="gradient"
                    className="w-full rounded !h-12 gap-2 font-bold text-base"
                  >
                    Proceed
                  </Button>
                </ConfirmationDialog>
              ) : (
                <Button
                  disabled={
                    isProcessing ||
                    !cardNumber ||
                    !cardExpiry ||
                    !cardCVV ||
                    !name
                  }
                  variant="gradient"
                  className="w-full rounded !h-12 gap-2 font-bold text-base"
                  onClick={handleCheckout}
                >
                  {isProcessing && <LoadingSpinner />}
                  {isProcessing ? "Processing..." : "Checkout"}
                </Button>
              )}
            </div>
          </div>
          {/* // )} */}
        </motion.div>

        {/* Overview section  */}
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
                onClick={() => setStep("buy")}
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
                      ? Number(item.value).toLocaleString()
                      : `${selectedOption === "Stripe" ? "$" : "₦"}${Number(
                          item.value
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between pt-4 mt-6">
              <p className="text-base font-bold">Total</p>
              <p className="text-base font-bold">
                {selectedOption !== "Stripe" ? "₦" : "$"}
                {txnOverview
                  .filter((item) => item.label !== "Amount of Pollcoins")
                  .reduce((acc, item) => acc + Number(item.value), 0)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
          </div>
          <div className="mt-auto w-full flex items-end justify-end max-[440px]:hidden">
            {selectedOption === "Paystack" ? (
              <ConfirmationDialog
                name={name}
                bankCode={selectedBank?.bank_code || ""}
                bankName={selectedBank?.bank_name || ""}
                accountNumber={accountNumber}
                amount={coinQuantity}
                gateway={selectedOption}
              >
                <Button
                  disabled={
                    isProcessing ||
                    !selectedBank ||
                    !accountNumber ||
                    !name ||
                    accountNumber.length !== 10
                  }
                  variant="gradient"
                  className="w-full rounded !h-12 gap-2 font-bold text-base"
                >
                  Proceed
                </Button>
              </ConfirmationDialog>
            ) : selectedOption === "Stripe" ? (
              wasRedirected || PayoutBanks?.length > 0 ? (
                <StripeConfirmDialog
                 response={PayoutBanks[0] || []}
                 payAmount={coinQuantity}
                 gateway={selectedOption}
                >
                  <Button
                    variant="gradient"
                    className="w-full rounded !h-12 gap-2 font-bold text-base"
                    // onClick={handleStripeRedirectedConfirmation}
                    disabled={
                      isProcessing ||
                      !PayoutBanks ||
                      PayoutBanks.length === 0 ||
                      stripePayoutLoading
                    }
                  >
                    Proceed
                    {/* {stripePayoutLoading && <LoadingSpinner />}
                    {stripePayoutLoading ? "Processing..." : "Checkout"} */}
                  </Button>
                </StripeConfirmDialog>
              ) : (
                <StripeDialog>
                  <Button
                    variant="gradient"
                    className="w-full rounded !h-12 gap-2 font-bold text-base"
                  >
                    Proceed
                  </Button>
                </StripeDialog>
              )
            ) : (
              <Button
                variant="gradient"
                className="w-full rounded !h-12 gap-2 font-bold text-base"
                // onClick={handleCheckout}
              >
                {/* {isProcessing && <LoadingSpinner />} */}
                {/* {isProcessing ? "Processing..." : "Checkout"} */}
                Proceed
              </Button>
            )}
          </div>

          <div className="mt-auto w-full flex items-end justify-end min-[440px]:hidden gap-6">
            <Button
              onClick={() => setStep("buy")}
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
