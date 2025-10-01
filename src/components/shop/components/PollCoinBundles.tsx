"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { Pollcoin } from "@/assets/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useShopStore } from "../store/useShopStore";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserBundles,
  UserPollcoinBundle,
} from "@/services/api/getUserBundles";
import { usePollcoinPurchase, PurchasePayload } from "@/lib/purchase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import axios from "axios";
import { redirectUrls } from "@/services/api/constants.api";

interface PollCoinBundle {
  id: string;
  name?: string;
  price: number;
  pollcoins: number;
  bonus?: number;
  tag?: string;
  discount?: number;
  originalPrice?: number;
  popular?: boolean;
  currency: string;
}

// Loading skeleton component
const BundleSkeleton = () => (
  <div className="relative bg-white overflow-hidden rounded-xl border border-gray-200 p-4 animate-pulse">
    {/* Background skeleton */}
    <div className="absolute pointer-events-none z-0 flex items-center justify-end top-1/2 right-3 transform -translate-y-1/2">
      <div className="w-28 h-28 bg-gray-200 rounded-full opacity-20" />
    </div>

    {/* Tag skeleton */}
    <div className="absolute top-0 right-0 w-full flex justify-end pointer-events-none z-20">
      <div className="w-20 h-6 bg-gray-200 rounded transform rotate-45" />
    </div>

    <div className="text-start relative z-10">
      {/* Bundle name skeleton */}
      <div className="mb-2">
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      {/* Price skeleton */}
      <div className="mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>

      {/* PollCoins skeleton */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 w-20 bg-gray-200 rounded-full" />
    </div>
  </div>
);

// Currency formatting utility
const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

// Get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency.toUpperCase()) {
    case "USD":
      return "$";
    case "NGN":
      return "₦";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return currency;
  }
};

// Transform API data to component format
const transformBundleData = (apiBundle: UserPollcoinBundle): PollCoinBundle => {
  const pollcoins = apiBundle.amount;
  let price = apiBundle.price;
  let bonus: number | undefined;
  let discount: number | undefined;
  let originalPrice: number | undefined;

  // Calculate pricing based on discount type
  if (apiBundle.discount_type === "percentage" && apiBundle.percentage) {
    originalPrice = price;
    price = price * (1 - apiBundle.percentage / 100);
    discount = apiBundle.percentage;
  } else if (apiBundle.discount_type === "bonus" && apiBundle.bonus) {
    bonus = apiBundle.bonus;
  }

  return {
    id: apiBundle._id,
    name: apiBundle.name,
    price: Math.round(price * 100) / 100, // Round to 2 decimal places
    pollcoins,
    bonus,
    tag: apiBundle.tag,
    discount,
    originalPrice,
    popular:
      apiBundle.tag?.toLowerCase().includes("popular") ||
      apiBundle.tag?.toLowerCase().includes("black friday") ||
      apiBundle.tag?.toLowerCase().includes("early bird") ||
      false,
    currency: apiBundle.currency,
  };
};

export function PollCoinBundles() {
  const router = useRouter();
  const { setPollcoins, setPollAmount, setPollDialogOpen, setPollStep } =
    useShopStore();
  const { toast } = useToast();
  const purchasePollcoins = usePollcoinPurchase();

  // Loading state for each bundle (tracked by bundle ID)
  const [loadingBundles, setLoadingBundles] = useState<Set<string>>(new Set());

  // Geo location for payment gateway selection
  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useQuery({
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

  // Fetch bundles from API
  const {
    data: bundlesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-pollcoin-bundles"],
    queryFn: () => fetchUserBundles({ page: 1, page_size: 50 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Transform API data
  const bundles = React.useMemo(() => {
    if (Boolean(bundlesResponse?.data?.length)) {
      return bundlesResponse!.data
        .filter((bundle) => bundle.status === "published")
        .map(transformBundleData);
    }
    return [];
  }, [bundlesResponse]);

  const handleBuyNow = async (bundle: PollCoinBundle) => {
    // Check if this bundle is already loading
    if (loadingBundles.has(bundle.id)) {
      return;
    }

    // Check if location data is loaded
    if (locationLoading) {
      toast({
        title: "Loading",
        description: "Detecting your location for payment...",
        variant: "default",
      });
      return;
    }

    if (locationError || !locationData) {
      toast({
        title: "Error",
        description: "Unable to detect your location. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Add this bundle to loading state
    setLoadingBundles((prev) => new Set(prev).add(bundle.id));
    try {
      // Make POST request to get order summary
      const response = await axiosInstance.post(
        "/purchases/pollcoins/order-summary",
        {
          bundleId: bundle.id,
        }
      );

      if (response.data.orderSummary) {
        const { orderSummary, breakdown } = response.data;

        // Set the bundle values in the store for success handling
        setPollcoins(orderSummary.pollcoinsAmount.toString());
        setPollAmount(orderSummary.totalAmount.toString());

        // Store in localStorage for success page handling
        localStorage.setItem(
          "purchasedPollcoins",
          orderSummary.pollcoinsAmount.toString()
        );

        // Use the reference ID from the order summary
        const orderReferenceId = orderSummary.referenceId;

        // Use the payment gateway from the order summary response
        const paymentGateway = breakdown.paymentDetails.gateway_to_use;

        // Create payment payload
        const paymentPayload: PurchasePayload = {
          paymentGateway,
          orderReferenceId,
          redirect_url: redirectUrls.success,
        };

        // Initiate payment directly
        const result = await purchasePollcoins.mutateAsync(paymentPayload);

        // Extract publishable key from payment response if available
        const publishableKey =
          (result.data?.payment as any)?.publishable_key ||
          (result.data as any)?.publishable_key;
        if (publishableKey) {
          // Store the publishable key for the checkout page
          sessionStorage.setItem("stripe_publishable_key", publishableKey);
        }

        if (result.success) {
          if (
            paymentGateway === "stripe" &&
            result.data?.payment?.client_secret
          ) {
            // Handle Stripe payment - redirect to checkout page
            const checkoutUrl = `/shop/checkout?cs=${result.data.payment.client_secret}&amount=${orderSummary.totalAmount}&pollcoins=${orderSummary.pollcoinsAmount}`;

            window.location.href = checkoutUrl; // Re-enabled for testing
          } else if (
            paymentGateway === "paystack" &&
            result.data?.payment?.authorization_url
          ) {
            // Handle Paystack payment - redirect to authorization URL

            window.location.href = result.data.payment.authorization_url;
          } else {
            toast({
              title: "Payment Error",
              description: "Invalid payment response from server",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Payment Error",
            description: result.message || "Failed to initiate payment",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to get order summary",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to get order summary",
        variant: "destructive",
      });
    } finally {
      // Remove this bundle from loading state
      setLoadingBundles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bundle.id);
        return newSet;
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <BundleSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            Failed to load bundles
          </div>
          <div className="text-gray-600">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  // No bundles state
  if (bundles.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto">
          {/* Empty state illustration */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full flex items-center justify-center">
                <Image
                  src={Pollcoin}
                  alt="PollCoin"
                  className="w-12 h-12 opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Empty state content */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">
              No bundles available
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We're currently preparing some amazing PollCoin bundles for you.
              Check back soon for great deals and special offers!
            </p>
          </div>

          {/* Action button */}
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className={cn(
              `relative bg-white overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg hover:scale-105`,
              //   bundle.popular
              //     ? "border-purple-500 shadow-lg"
              //     :
              "border-gray-200 hover:border-purple-300"
            )}
          >
            {/* Background Pollcoin Symbol */}
            <div
              className="absolute pointer-events-none z-0 flex items-center justify-end"
              style={{
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                height: "0",
                width: "100%",
              }}
            >
              <Image
                src={Pollcoin}
                alt="PollCoin background"
                className="w-28 h-28 opacity-10 select-none"
                style={{
                  position: "relative",
                  zIndex: 0,
                  pointerEvents: "none",
                  filter: "blur(0.5px)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* Popular Badge */}
            {/* {bundle.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              </div>
            )} */}

            {/* Early Bird Tag */}
            {bundle.tag && (
              <div className="absolute top-0 right-0 w-full flex justify-end pointer-events-none z-20">
                <div
                  className="origin-top-right"
                  style={{
                    position: "relative",
                    width: "max-content",
                    right: "-26px",
                    top: "18px",
                  }}
                >
                  <div
                    className="bg-purple-700 text-white text-xs font-bold py-1 px-8 shadow-lg"
                    style={{
                      transform: "rotate(45deg)",
                      minWidth: "120px",
                      textAlign: "center",
                      pointerEvents: "auto",
                    }}
                  >
                    {bundle.tag}
                  </div>
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {bundle.discount && (
              <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold">
                  -{bundle.discount}%
                </div>
              </div>
            )}

            <div className="text-start relative z-10">
              {/* Bundle Name */}
              {bundle.name && (
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {bundle.name}
                  </h3>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-700 mr-2">
                  {formatCurrency(bundle.price, bundle.currency)}
                </span>
                {bundle.originalPrice && (
                  <span className="!text-lg text-gray-400 line-through">
                    {formatCurrency(bundle.originalPrice, bundle.currency)}
                  </span>
                )}
              </div>

              {/* PollCoins */}
              <div className="">
                <div className="flex items-center justify-start gap-2 mb-2">
                  <Image src={Pollcoin} alt="PollCoin" className="w-8 h-8" />
                  <span className="text-2xl font-bold text-purple-800">
                    {bundle.pollcoins.toLocaleString()}
                  </span>
                  <span className="text-2xl text-purple-800 font-bold">
                    PollCoins
                  </span>
                </div>

                {/* Bonus */}
                <div className="h-10">
                  {bundle.bonus && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      +{bundle.bonus.toLocaleString()} PollCoins Bonus
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                variant="ghost"
                className="h-10 rounded-full text-base hover:!bg-transparent text-gray-500 hover:text-gray-700 px-0 font-medium gap-2 hover:scale-105 transition-transform w-fit"
                onClick={() => {
                  handleBuyNow(bundle);
                }}
                disabled={
                  loadingBundles.has(bundle.id) ||
                  purchasePollcoins.isPending ||
                  locationLoading
                }
              >
                {loadingBundles.has(bundle.id) || locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {locationLoading ? "Detecting location..." : "Loading..."}
                  </>
                ) : (
                  <>
                    Buy now
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
