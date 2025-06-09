import React, { ReactNode, useEffect, useState } from "react";
import { useShopStore } from "../../../store/useShopStore";
import { SuccessDialog } from "../SuccessDialog";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/new-dialog";
import { Button } from "@/components/ui/button";
import { Banner } from "../../Banner";
import { Input } from "@/components/ui/shadcn-input";
import BuyPollcoinsFlow from "../BuyPollcoins";
import { useUserBalance } from "@/components/shop/queries/useBalance";
import { LoadingSpinner } from "../BuyPollcoins/CheckoutDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { formatNumber } from "@/components/payouts/functions";
import { Pollcoin } from "@/assets/images";
import Image from "next/image";

type BuyDialogProps = {
  children: ReactNode;
  title: string;
  creditsPerUnit: number;
  pricePerCredit: number;
  minimumPurchase: number;
  placeholder?: string;
  isLoading?: boolean;
  onPurchase: (amount: string) => void;
};

export function BuyServicesDialog(props: BuyDialogProps) {
  const {
    children,
    title,
    creditsPerUnit,
    pricePerCredit,
    minimumPurchase,
    placeholder,
    isLoading,
    onPurchase,
  } = props;

  const [analysisStep, setAnalysisStep] = useState<
    "buy" | "checkout" | "success"
  >("buy");
  const [open, setOpen] = useState(false);
  const [credit, setCredit] = useState("");
  const [analysisAmount, setAnalysisAmount] = useState("");
  const [error, setError] = useState("");
  const { reset, setPollStep, setPollDialogOpen, loading, setLoading } =
    useShopStore();
  const description = `You have purchased ${credit} ${title}`;
  const { data } = useUserBalance();
  const { restrictedBalance = 0 } = data || {};

  const pollcoinRequired = credit ? parseFloat(credit) * pricePerCredit : 0;

  const hasValidCredits =
    credit !== "" &&
    !isNaN(pollcoinRequired) &&
    pollcoinRequired >= minimumPurchase;

  const isBalanceInsufficient =
    hasValidCredits && pollcoinRequired > restrictedBalance;

  useEffect(() => {
    if (credit) {
      const calculatedAmount = (parseFloat(credit) * pricePerCredit).toFixed(2);
      setAnalysisAmount(calculatedAmount);
    } else {
      setAnalysisAmount("");
    }
  }, [credit, setAnalysisAmount, pricePerCredit]);

  const validate = () => {
    const quantityNum = parseFloat(credit);

    if (!credit) {
      setError("Credit amount is required.");
      return false;
    } else if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Enter a valid credit quantity.");
      return false;
    } else if (quantityNum < minimumPurchase) {
      setError(`Minimum purchase is ${minimumPurchase} credits.`);
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setAnalysisStep("checkout");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          if (analysisStep === "success") {
            reset(); // Final reset
          }

          // Reset only if dialog was closed in "buy" step
          if (analysisStep === "buy") {
            setCredit("");
            setAnalysisAmount("");
            setError("");
          }

          setAnalysisStep("buy");
        }
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%] max-[441px]:px-4"
        )}
      >
        {analysisStep === "buy" && (
          <div>
            <div className="mt-5 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold mb-8">{title}</p>

              <Banner />
              <div className="w-full">
                <div className="mt-5">
                  <label htmlFor="credits" className="text-sm">
                    Amount of {title}
                  </label>
                  <Input
                    type="number"
                    name="credits"
                    placeholder={placeholder}
                    className="mt-2 h-[54px]"
                    value={credit}
                    onChange={(e) => {
                      setCredit(e.target.value);
                      if (error) setError("");
                    }}
                  />
                  {error && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}

                  {isLoading ? (
                    <Skeleton className="h-5 w-full mt-2" />
                  ) : (
                    <p className="mt-1 text-xs">
                      Today&apos;s {title} rate: {pricePerCredit}pc ={" "}
                      {creditsPerUnit} {title}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center w-full justify-between h-[54px] border rounded-md bg-muted/50">
                  <div className="h-[54px] flex items-center justify-center min-w-[90px] border-r px-3">
                    <p className="text-sm text-muted-foreground">
                      Pollcoin Amount
                    </p>
                  </div>

                  <input
                    type="text"
                    value={formatNumber(Number(analysisAmount))}
                    readOnly
                    className="h-[54px] flex-1 pl-2.5 bg-transparent outline-none text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {isBalanceInsufficient && (
              <div className="text-sm text-[#FF0E0E] mt-4">
                You don&apos;t have enough coins for this purchase.{" "}
                <BuyPollcoinsFlow nested>
                  <button
                    className="text-tertiary cursor-pointer underline"
                    onClick={() => {
                      setOpen(false);
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
                disabled={isBalanceInsufficient || !credit}
                variant="gradient"
                className="w-full rounded mt-12 max-[441px]:!h-12"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {analysisStep === "checkout" && (
          <CheckoutDialog
            amount={credit}
            rate={pricePerCredit}
            setStep={setAnalysisStep}
            loading={loading}
            pollAmount={analysisAmount}
            setLoading={setLoading}
            title={title}
            onPurchase={onPurchase}
          />
        )}
        {analysisStep === "success" && (
          <SuccessDialog successMessage={description} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}

type CheckoutDialogProps = {
  title: string;
  amount: string;
  rate: number;
  pollAmount: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setStep: (step: "buy" | "checkout" | "success") => void;
  onPurchase: (amount: string) => void;
};
function CheckoutDialog({
  amount,
  title,
  setStep,
  loading,
  pollAmount,
  setLoading,
  rate,
  onPurchase,
}: CheckoutDialogProps) {
  const txnOverview = [
    {
      label: title,
      value: amount,
    },
    {
      label: "Unit Price/coin",
      value: rate,
    },
  ];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await onPurchase(pollAmount);
      setStep("success");
    } catch (error) {
      console.error("Purchase failed:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-full items-center flex-col py-6">
      <p className="text-2xl font-bold ">{title}</p>

      {/* Overview section  */}
      <div className={cn("flex-1 overview h-full flex flex-col w-full")}>
        <div className="min-[440px]:bg-sec-bg p-8 max-[440px]:px-4 flex items-center flex-col pb-20">
          <div className="flex items-center justify-between w-full mb-6">
            <p className="text-xl font-bold">Order Summary</p>
            <button
              onClick={() => setStep("buy")}
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
                <div className="flex items-center gap-1.5">
                  <Image src={Pollcoin} alt="icons" className="size-4" />
                  <p>{item.label === title ? item.value : `${item.value}`}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-between pt-4 mt-6">
            <p className="text-base font-bold">Total</p>
            <div className="flex items-center gap-1.5">
              <Image src={Pollcoin} alt="icons" className="size-4" />
              <p className="text-base font-bold">{pollAmount}</p>
            </div>
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
            onClick={handleCheckout}
            disabled={loading}
            variant="gradient"
            size="lg"
            className="w-full rounded"
          >
            {loading && <LoadingSpinner />}
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
