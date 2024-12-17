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

interface PricingTier {
  name: string;
  price: string;
  period: string;
  bgColor: string;
  textColor: string;
  features: string[];
  cta: {
    text: "Current plan" | "Downgrade plan" | "Upgrade plan";
    variant: "default" | "outline" | "secondary";
  };
  popular?: boolean;
}

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

const tiers: PricingTier[] = [
  {
    name: "Basic",
    price: "FREE",
    period: "",
    bgColor: "bg-[#ffffff]",
    textColor: "",
    features: [
      "Unlimited access",
      "1 Account",
      "200 monthly responses",
      "AI survey/Poll generation",
      "Data Export (pdf)",
    ],
    cta: {
      text: "Downgrade plan",
      variant: "outline",
    },
  },
  {
    name: "Pro",
    price: "£20",
    period: "per month",
    bgColor: "bg-[#5B03B2]",
    textColor: "text-white",
    features: [
      "Everything in Basic",
      "Add Contributors (Up to 4)",
      "Unlimited Polls and Surveys",
      "10,000 monthly responses",
      "Account Customization",
      "Offline data collection and analytics",
      "AI survey assistant",
      "Automatic AI survey reporting",
      "Speech to text feature",
      "Data Export (xls, pdf, ppt)",
      "Priority Email support",
    ],
    cta: {
      text: "Upgrade plan",
      variant: "secondary",
    },
    popular: true,
  },
  {
    name: "Business",
    price: "£99.99",
    period: "per month",
    bgColor: "bg-[#ffffff]",
    textColor: "",
    features: [
      "Everything in Pro",
      "Multiple accounts",
      "Unlimited contributors",
      "Unlimited responses",
      "A/B testing & randomization",
      "Skip Logic",
      "Multilingual Survey",
      "Advanced Data Export (xls, pdf, ppt, Power BI)",
      "Dedicated customer success manager",
    ],
    cta: {
      text: "Upgrade plan",
      variant: "default",
    },
  },
];

const PaymentGatewayButton = ({
  name,
  logo,
  planId,
  organization_id,
  onClick,
}: {
  name: string;
  logo: string;
  planId?: string;
  organization_id?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-full p-4 mb-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
  >
    <Image
      src={logo}
      alt={name}
      width={120}
      height={40}
      className="object-contain h-10 w-fit"
    />
    <p>{name}</p>
  </button>
);

export function PricingCards() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
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

  console.log("Helele");
  console.log(userData.data?.data);

  const renderButton = (tier: TPricing, index: number) => {
    if (index === 0) {
      return null;
    }
    if (index === 1) {
      if (tier._id === userData.data?.data?.plan._id) {
        return (
          <Button
            className={cn(
              "w-full text-xs sm:text-sm bg-transparent border-0 hover:bg-transparent",
              index === 1 ? "text-white" : ""
            )}
            variant={"secondary"}
            disabled
          >
            Current plan
          </Button>
        );
      } else if (tiersData.data?.[0]._id === userData.data?.data?.plan._id) {
        return (
          <Button
            onClick={() => handleUpgrade(index)}
            className={cn(
              "w-full text-xs sm:text-sm border-0",
              index === 1
                ? "bg-gradient-to-r from-[#5B03B2] to-black hover:from-[#5B03B2]/90 hover:to-black/90 text-white"
                : "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2]/90 hover:to-[#9D50BB]/90"
            )}
            variant={"secondary"}
          >
            Upgrade plan
          </Button>
        );
      } else {
        return null;
      }
    }
    if (index === 2) {
      if (tier._id === userData.data?.data?.plan._id) {
        return (
          <Button
            className={cn(
              "w-full text-xs sm:text-sm bg-transparent border-0 hover:bg-transparent text-black border-black"
            )}
            variant={"default"}
            disabled
          >
            Current plan
          </Button>
        );
      } else if (tiersData.data?.[0]._id === userData.data?.data?.plan._id) {
        return (
          <Button
            onClick={() => handleUpgrade(index)}
            className={cn(
              "w-full text-xs sm:text-sm border-0 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2]/90 hover:to-[#9D50BB]/90"
            )}
            variant={"default"}
          >
            Upgrade plan
          </Button>
        );
      } else {
        return null;
      }
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
    }) => initPaymentQuery(payload),
    onSuccess: (data) => {
      if (data?.authorization_url) {
        router.push(data?.authorization_url);
      }
      if (data?.data?.link) {
        router.push(data?.data?.link);
      }
      if (data?.client_secret) {
        router.push(
          `/settings/subscription/checkout?cs=${data.client_secret}&p_id=${
            tiersData.data![selectedTier!]._id
          }`
        );
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      {tiersData.isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiersData.data.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={cn(
                  "relative rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 overflow-hidden border flex flex-col flex-1",
                  index === 1 ? "border-[#EDEDED]" : "border-[#9D50BB21]",
                  tiers[index].bgColor && tiers[index].bgColor,
                  tiers[index].textColor && tiers[index].textColor
                )}
              >
                {tiers[index].popular && (
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
                          tiers[index].textColor && tiers[index].textColor
                        )}
                      >
                        {!locationData?.isNigeria
                          ? `$${tier.monthly_price_dollar}`
                          : `₦${tier.monthly_price_naira}`}
                      </span>
                      {tiers[index].period && (
                        <span
                          className={cn(
                            "ml-1 text-xs sm:text-sm text-muted-foreground",
                            tiers[index].textColor && tiers[index].textColor
                          )}
                        >
                          {tiers[index].period}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="my-6 h-[1px] bg-gray-500/30" />
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-medium">
                      What you will get
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {tier.features.map((feature) => (
                        <li
                          key={feature._id}
                          className="flex justify-start items-center"
                        >
                          <CheckCircle2Icon
                            className={cn(
                              "mr-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-600 shrink-0",
                              tiers[index].textColor && tiers[index].textColor
                            )}
                          />
                          <span
                            className={cn(
                              "text-left",
                              tiers[index].textColor && tiers[index].textColor
                            )}
                          >
                            {feature.feature_name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="py-3"></div>
                </div>
                {renderButton(tiersData.data[index], index)}
              </motion.div>
            ))}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center mb-4">
                  Choose Payment Method
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {!locationLoading && !locationError && (
                  <>
                    {!locationData?.isNigeria && (
                      <PaymentGatewayButton
                        name="Stripe"
                        logo="/assets/payment/stripe.png"
                        organization_id=""
                        onClick={() => {
                          paymentMutation.mutate({
                            gateway: "stripe",
                            plan_id: tiersData.data[selectedTier!]._id,
                            organization_id:
                              userData.data?.data?.current_organization!,
                            plan_type: "monthly",
                            country: locationData?.country || "",
                          });
                          setDialogOpen(false);
                        }}
                      />
                    )}
                    {locationData?.isNigeria && (
                      <>
                        <PaymentGatewayButton
                          name="Flutterwave"
                          logo="/assets/payment/flutterwave.jpeg"
                          onClick={() => {
                            paymentMutation.mutate({
                              gateway: "flutterwave",
                              plan_id: tiersData.data[selectedTier!]._id,
                              organization_id:
                                userData.data?.data?.current_organization!,
                              redirect_url: `${window.location.origin}/settings/subscription/success`,
                              plan_type: "monthly",
                              country: "Nigeria",
                            });
                            setDialogOpen(false);
                          }}
                        />
                        <PaymentGatewayButton
                          name="Paystack"
                          logo="/assets/payment/paystack.svg"
                          onClick={() => {
                            paymentMutation.mutate({
                              gateway: "paystack",
                              plan_id: tiersData.data[selectedTier!]._id,
                              organization_id:
                                userData.data?.data?.current_organization!,
                              redirect_url: `${window.location.origin}/settings/subscription/success`,
                              plan_type: "monthly",
                              country: "Nigeria",
                            });
                            setDialogOpen(false);
                          }}
                        />
                      </>
                    )}
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
