"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionTier, getSubscriptionTiers } from "@/services/admin";
import { TPricing } from "@/subpages/settings/subscription/PricingCards";
import { toast } from "react-toastify";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const planId = searchParams.get("p_id");

  const tierData = useQuery<TPricing>({
    queryKey: ["tier-details"],
    queryFn: () => getSubscriptionTier(planId!),
  });

  console.log(tierData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret!,
      confirmParams: {
        return_url: `${window.location.origin}/settings/subscription/success`,
      },
    });

    if (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!stripe || !elements || tierData.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  console.log(tierData);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Subscription
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Subscribing to {tierData.data?.name}
            </p>
            <p className="text-sm text-gray-500">
              Billed monthly at ${tierData.data?.monthly_price_dollar}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              ${tierData.data?.monthly_price_dollar}
            </p>
            <p className="text-xs text-gray-500">USD</p>
          </div>
        </div>
      </div>
      <PaymentElement />
      {/* {errorMessage && <div>{errorMessage}</div>} */}
      <button
        disabled={!stripe || loading}
        className="bg-gradient-to-r from-[#5B03B2] to-black hover:from-[#5B03B2]/90 hover:to-black/90 text-white w-full p-5 py-3 mt-2 rounded-lg font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading
          ? `Pay $${tierData.data?.monthly_price_dollar}`
          : "Processing..."}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientSecret = searchParams.get("cs");
  const planId = searchParams.get("p_id");

  if (!planId || !clientSecret) {
    router.replace("/settings/subscription");
    return null;
  }
  const options: { clientSecret: string; appearance: { theme: "stripe" } } = {
    clientSecret: clientSecret as string,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div className="p-6">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
