"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";
import { redirectUrls } from "@/services/api/constants.api";

// Currency formatting utility
const formatCurrency = (amount: number, currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

// Initialize Stripe with fallback key (will be updated dynamically)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

const CheckoutForm = ({
  clientSecret,
  amount,
  pollcoins,
}: {
  clientSecret: string;
  amount: number;
  pollcoins: number;
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [backendPublishableKey, setBackendPublishableKey] = useState<
    string | null
  >(null);

  // Debug logging
  console.log("🔍 CheckoutForm state:", {
    stripe: !!stripe,
    elements: !!elements,
    clientSecret: clientSecret?.substring(0, 20) + "...",
    amount,
    pollcoins,
  });

  // Get publishable key from sessionStorage (set by payment initiation)
  useEffect(() => {
    const publishableKey = sessionStorage.getItem("stripe_publishable_key");
    if (publishableKey) {
      console.log(
        "🔍 Using publishable key from payment response:",
        publishableKey.substring(0, 20) + "..."
      );
      setBackendPublishableKey(publishableKey);
    } else {
      console.log(
        "🔍 No publishable key found in sessionStorage, using fallback"
      );
      // Fallback to environment variable
      setBackendPublishableKey(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null
      );
    }
  }, []);

  // Debug Stripe account info
  useEffect(() => {
    if (stripe) {
      console.log("🔍 Stripe instance loaded");
      console.log(
        "🔍 Client secret from API:",
        clientSecret?.substring(0, 30) + "..."
      );
      console.log(
        "🔍 PaymentIntent ID from client_secret:",
        clientSecret?.split("_secret_")[0]
      );

      // Test if we can retrieve the PaymentIntent
      if (clientSecret) {
        stripe
          .retrievePaymentIntent(clientSecret)
          .then((result) => {
            console.log("🔍 PaymentIntent retrieval result:", result);
            if (result.error) {
              console.error("🔍 PaymentIntent error:", result.error);
            }
          })
          .catch((error) => {
            console.error("🔍 PaymentIntent retrieval failed:", error);
          });
      }
    }
  }, [stripe, clientSecret]);

  // Additional debugging for Stripe Elements
  useEffect(() => {
    if (stripe && elements) {
      console.log("🔍 Stripe Elements loaded successfully");
    } else {
      console.log("🔍 Stripe Elements not ready yet", {
        stripe: !!stripe,
        elements: !!elements,
      });
    }
  }, [stripe, elements]);

  // Timeout to show fallback if PaymentElement doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stripe && elements && !paymentElementReady) {
        console.log("🔍 PaymentElement timeout - showing fallback");
        setErrorMessage(
          "Payment form is taking longer than expected to load. Please refresh the page."
        );
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [stripe, elements, paymentElementReady]);

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
        return_url: redirectUrls.success,
      },
    });

    if (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-purple-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
          <p className="text-purple-100 text-sm mt-1">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🪙</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">PollCoins</h3>
                <p className="text-sm text-gray-500">Digital currency</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {pollcoins.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">coins</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-xl font-bold text-gray-800">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Information
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 min-h-[200px]">
                {stripe && elements ? (
                  <div>
                    <PaymentElement
                      onLoadError={(error) => {
                        console.error("🔍 PaymentElement load error:", error);

                        // Handle specific Stripe account mismatch error
                        if (
                          error.error?.message?.includes(
                            "client_secret provided does not match"
                          )
                        ) {
                          setErrorMessage(
                            "Payment configuration error. Please contact support."
                          );
                        } else {
                          setErrorMessage(
                            "Failed to load payment form. Please refresh the page."
                          );
                        }
                      }}
                      onReady={() => {
                        console.log("🔍 PaymentElement is ready");
                        setPaymentElementReady(true);
                      }}
                    />
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      💳 Enter your card details above
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">
                        Loading payment form...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <div>
                    <p className="text-red-700 text-sm font-medium">
                      {errorMessage}
                    </p>
                    {errorMessage.includes("Payment configuration error") && (
                      <div className="mt-2 text-xs text-red-600">
                        <p>
                          <strong>Issue:</strong> Stripe account mismatch
                          between frontend and backend.
                        </p>
                        <p>
                          <strong>Solution:</strong> Ensure your frontend
                          publishable key matches the Stripe account used by
                          your backend API.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Pay {formatCurrency(amount)}</span>
                  <span>→</span>
                </div>
              )}
            </Button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">🔒</span>
              </div>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientSecret = searchParams.get("cs");
  const amount = parseFloat(searchParams.get("amount") || "0");
  const pollcoins = parseInt(searchParams.get("pollcoins") || "0");
  const [backendPublishableKey, setBackendPublishableKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!clientSecret || !amount || !pollcoins) {
      toast.error("Invalid checkout parameters");
      router.replace("/shop");
      return;
    }
  }, [clientSecret, amount, pollcoins, router]);

  // Get publishable key from sessionStorage (set by payment initiation)
  useEffect(() => {
    const publishableKey = sessionStorage.getItem("stripe_publishable_key");
    if (publishableKey) {
      console.log(
        "🔍 Using publishable key from payment response:",
        publishableKey.substring(0, 20) + "..."
      );
      setBackendPublishableKey(publishableKey);
    } else {
      console.log(
        "🔍 No publishable key found in sessionStorage, using fallback"
      );
      // Fallback to environment variable
      setBackendPublishableKey(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null
      );
    }
  }, []);

  if (!clientSecret || !amount || !pollcoins) {
    return null;
  }

  const options = {
    clientSecret: clientSecret as string,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600">
              Complete your PollCoin purchase safely
            </p>
          </div>
        </div>

        {/* Checkout Form */}
        {backendPublishableKey ? (
          <Elements
            stripe={loadStripe(backendPublishableKey)}
            options={options}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              amount={amount}
              pollcoins={pollcoins}
            />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">
                Loading payment configuration...
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Stripe Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
