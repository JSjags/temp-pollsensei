"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMeQuery,
  getSubscriptionTiers,
  initPaymentQuery,
} from "@/services/admin";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentPage from "@/subpages/payment/StripeRedirect";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { User } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";

export interface TPricing {
  _id: string;
  name: string;
  description: string;
  monthly_price_naira: number;
  monthly_price_dollar: number;
  yearly_price_naira: number;
  yearly_price_dollar: number;
  total_yearly_price_naira: number;
  total_yearly_price_dollar: number;
  trial_period: number;
  number_of_collaborators: number;
  number_of_monthly_responses: number;
  number_of_accounts: number;
  features: [
    {
      _id: string;
      feature_name: string;
    },
    {
      _id: string;
      feature_name: string;
    },
    {
      _id: string;
      feature_name: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TCurrentPlan {
  name: string;
  description: string;
  currency: string;
  monthly_cost: number;
  yearly_cost: number;
  next_billing_date: string;
  next_billing_amount: number;
  auto_renewal: boolean;
}

export const useGeoLocation = () => {
  return useQuery({
    queryKey: ["geolocation"],
    queryFn: async () => {
      const response = await axios.get("https://ipapi.co/json/");
      return {
        country: response.data.country_name,
        isNigeria: response.data.country_name === "Nigeria",
        isSuccess: true,
      };
    },
    retry: 1,
  });
};

const PaymentGatewayButton = ({
  name,
  logo,
  planId,
  organization_id,
  onClick,
  selected,
}: {
  name: string;
  logo: string;
  planId?: string;
  organization_id?: string;
  onClick: () => void;
  selected?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center w-full p-4 mb-4 border rounded-lg transition-colors gap-4",
      selected ? "border-2 border-purple-600 bg-purple-50" : "hover:bg-gray-50"
    )}
    type="button"
  >
    <Image
      src={logo}
      alt={name}
      width={120}
      height={40}
      className="object-contain h-10 w-fit"
    />
    <p className={selected ? "font-bold text-purple-700" : undefined}>{name}</p>
    {/* {selected && (
      <span className="ml-2 text-purple-600 font-semibold">Selected</span>
    )} */}
  </button>
);

export function PricingCards() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const ref = useRef(null);

  const userData = useQuery<{ data: User }>({
    queryKey: ["profile"],
    queryFn: getMeQuery,
  });

  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useGeoLocation();

  const tiersData = useQuery<TPricing[]>({
    queryKey: ["tiers"],
    queryFn: getSubscriptionTiers,
  });

  const user = useSelector((state: RootState) => state.user);

  const handleUpgrade = (index: number) => {
    setSelectedTier(index);
    setDialogOpen(true);
  };

  // Helper to determine plan order for upgrade/downgrade logic
  const getPlanOrder = (plans: TPricing[]) => {
    // You can sort by price or use the order from the API
    return plans.map((plan) => plan._id);
  };

  const renderButton = (tier: TPricing, index: number, plans: TPricing[]) => {
    const currentPlanId = userData.data?.data?.plan?._id;
    const planOrder = getPlanOrder(plans);
    const currentIndex = planOrder.indexOf(currentPlanId!);
    if (tier._id === currentPlanId) {
      return (
        <Button
          className={cn(
            "w-full text-xs sm:text-sm bg-transparent border-0 hover:bg-transparent",
            index === 1 && "text-white"
          )}
          variant="secondary"
          disabled
        >
          Current plan
        </Button>
      );
    } else if (currentIndex < index) {
      // Upgrade
      return (
        <Button
          onClick={() => handleUpgrade(index)}
          className="w-full text-xs sm:text-sm border-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2]/90 hover:to-[#9D50BB]/90 text-white"
          variant="secondary"
        >
          Upgrade plan
        </Button>
      );
    } else if (currentIndex > index) {
      // Downgrade
      return null;
      // (
      //   <Button
      //     onClick={() => handleUpgrade(index)}
      //     className="w-full text-xs sm:text-sm border-0"
      //     variant="outline"
      //   >
      //     Downgrade plan
      //   </Button>
      // );
    }
    return null;
  };

  const paymentMutation = useMutation({
    mutationKey: ["init-payment"],
    mutationFn: (payload: {
      gateway: string;
      plan_id: string;
      organization_id: string;
      redirect_url?: string;
      plan_type: string;
      country: string;
      coupon_code?: string;
    }) => initPaymentQuery(payload),
    onSuccess: (data) => {
      if (data?.authorization_url) {
        router.push(data?.authorization_url);
      }
      if (data?.data?.link) {
        router.push(data?.data?.link);
      }
      if (data?.client_secret) {
        if (
          typeof selectedTier === "number" &&
          tiersData.data &&
          tiersData.data[selectedTier]
        ) {
          const planId = tiersData.data?.[selectedTier]?._id ?? "";
          router.push(
            `/settings/subscription/checkout?cs=${data.client_secret}&p_id=${planId}`
          );
        }
      }
      setDialogOpen(false);
    },
    onError: (error) => {
      console.log(error);
      // INSERT_YOUR_CODE
      // Show a toast with the error message if available
      if ((error as any)?.response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else if ((error as any)?.message) {
        toast.error((error as any).message);
      } else {
        toast.error("An error occurred during payment. Please try again.");
      }
      // Clear the form fields after an error
      setCouponCode("");
      setSelectedGateway(null);
      setSelectedTier(null);
      setDialogOpen(false);
    },
  });

  return (
    <>
      {tiersData.isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="relative rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 overflow-hidden border border-[#9D50BB21] animate-pulse"
            >
              <div className="space-y-4">
                <div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="mt-2 flex items-baseline">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="ml-1 h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="my-6 h-[1px] bg-gray-500/30" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="py-3"></div>
                <div className="h-9 w-full bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tiersData.isSuccess && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {tiersData.data.map((tier, index) => (
              <motion.div
                key={tier._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={cn(
                  "relative rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 overflow-hidden border flex flex-col flex-1",
                  tier.name === "Pro Plan"
                    ? "border-[#EDEDED] bg-[#5B03B2] text-white"
                    : "border-[#9D50BB21] bg-[#ffffff]"
                )}
              >
                {/* Highlight Pro Plan as Most Popular */}
                {tier.name === "Pro Plan" && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-[#F7AC0A] to-[#BE6C07] px-3 py-2 text-xs sm:text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">
                      {tier.name}
                    </h3>
                    <div className="mt-2 flex items-baseline">
                      <span
                        className={cn(
                          "text-2xl sm:text-3xl font-bold tracking-tight text-purple-600",
                          tier.name === "Pro Plan"
                            ? "text-white"
                            : "text-purple-600"
                        )}
                      >
                        {tier.monthly_price_naira === 0 &&
                        tier.monthly_price_dollar === 0
                          ? "FREE"
                          : !locationData?.isNigeria
                          ? `$${tier.monthly_price_dollar.toLocaleString()}`
                          : `₦${tier.monthly_price_naira.toLocaleString()}`}
                      </span>
                      <span
                        className={cn(
                          "ml-1 text-xs sm:text-sm text-muted-foreground",
                          tier.name === "Pro Plan" ? "text-white/80" : ""
                        )}
                      >
                        {tier.monthly_price_naira === 0 &&
                        tier.monthly_price_dollar === 0
                          ? ""
                          : "per month"}
                      </span>
                    </div>
                  </div>
                  <div className="my-6 h-[1px] bg-gray-500/30" />
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-medium">
                      What you will get
                    </h4>
                    <ul
                      className={cn(
                        "space-y-2 text-xs sm:text-sm text-muted-foreground",
                        tier.name === "Pro Plan" ? "text-white/80" : ""
                      )}
                    >
                      {tier.features.map((feature) => (
                        <li
                          key={feature._id}
                          className="flex justify-start items-center"
                        >
                          <CheckCircle2Icon
                            className={cn(
                              "mr-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-600 shrink-0",
                              tier.name === "Pro Plan"
                                ? "text-white"
                                : "text-purple-600"
                            )}
                          />
                          <span className="text-left">
                            {feature.feature_name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="py-3"></div>
                </div>
                {renderButton(tier, index, tiersData.data)}
              </motion.div>
            ))}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
              className="sm:max-w-md z-[100000]"
              overlayClassName="z-[100000] backdrop-blur-md"
            >
              <DialogHeader>
                <DialogTitle className="text-center mb-4">
                  Choose Payment Method
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="coupon-code"
                    className="block text-sm font-medium mb-1"
                  >
                    Coupon Code (optional)
                  </label>
                  <input
                    id="coupon-code"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {!locationLoading && !locationError && (
                  <>
                    <div className="text-sm font-semibold mb-2">
                      Select Payment Method
                    </div>
                    <div className="space-y-2">
                      {!locationData?.isNigeria && (
                        <PaymentGatewayButton
                          name="Stripe"
                          logo="/assets/payment/stripe.png"
                          organization_id=""
                          onClick={() => setSelectedGateway("stripe")}
                          selected={selectedGateway === "stripe"}
                        />
                      )}
                      {locationData?.isNigeria && (
                        <PaymentGatewayButton
                          name="Paystack"
                          logo="/assets/payment/paystack.svg"
                          onClick={() => setSelectedGateway("paystack")}
                          selected={selectedGateway === "paystack"}
                        />
                      )}
                    </div>
                    <Button
                      className="w-full mt-4 auth-btn"
                      disabled={
                        !selectedGateway ||
                        selectedTier === null ||
                        paymentMutation.isPending
                      }
                      onClick={() => {
                        if (
                          typeof selectedTier === "number" &&
                          tiersData.data &&
                          tiersData.data[selectedTier] &&
                          selectedGateway
                        ) {
                          const payload: any = {
                            gateway: selectedGateway,
                            plan_id: tiersData.data[selectedTier]._id,
                            organization_id:
                              userData.data?.data?.current_organization || "",
                            plan_type: "monthly",
                            country: locationData?.isNigeria
                              ? "Nigeria"
                              : locationData?.country || "",
                          };
                          if (selectedGateway === "paystack") {
                            payload.redirect_url = `${window.location.origin}/settings/subscription/success`;
                          }
                          if (couponCode) {
                            payload.coupon_code = couponCode;
                          }
                          paymentMutation.mutate(payload);
                        }
                      }}
                    >
                      {paymentMutation.isPending ? "Processing..." : "Proceed"}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
