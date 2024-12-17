"use client";

import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import { TPricing, useGeoLocation } from "./PricingCards";
import { getMeQuery, getSubscriptionTier } from "@/services/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/redux/slices/user.slice";

export function CurrentPlanCard() {
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user?.plan);

  const userData = useQuery<{ data: User }>({
    queryKey: ["profile"],
    queryFn: getMeQuery,
  });

  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useGeoLocation();

  const tierData = useQuery<TPricing>({
    queryKey: ["tier"],
    queryFn: () => getSubscriptionTier(userData.data?.data?.plan._id!),
    enabled: userData.isSuccess,
  });

  if (tierData.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 lg:col-span-3"
      >
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 sm:p-6 relative z-50">
            <div className="space-y-1">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-4 bg-[#5B03B2] text-white p-4 sm:px-6">
            <div>
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-6 w-40 mt-1 bg-white/20" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-6 w-24 mt-1 bg-white/20" />
            </div>
          </div>
        </div>
        <motion.div
          className="absolute -bottom-2 right-0 z-10"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Skeleton className="size-40 rounded-full opacity-0" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 lg:col-span-3"
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 sm:p-6 relative z-50">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold">
              {userData.data?.data?.plan.name}{" "}
              {/* <span className="text-xs sm:text-sm font-normal text-purple-600">
                Launch promo plan
              </span> */}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {!locationData?.isNigeria
                ? `$${tierData.data?.monthly_price_dollar ?? "__"}`
                : `₦${tierData.data?.monthly_price_naira ?? "__"}`}{" "}
              / month
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto Renewal</span>
            <Switch className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#9D50BB] data-[state=checked]:to-[#9D50BB]" />
          </div> */}
        </div>
        <div className="flex gap-4 bg-[#5B03B2] text-white p-4 sm:px-6">
          <div>
            <p className="text-sm font-medium">Next Billing date</p>
            <p className="text-base font-semibold">
              {tierData.data?.monthly_price_dollar === 0 ? "Free" : "N/A"}
              {/* : "10th December, 2025"} */}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Next Billing Amount</p>
            <p className="text-base font-semibold">
              {!locationData?.isNigeria
                ? `$${tierData.data?.monthly_price_dollar ?? "__"}`
                : `₦${tierData.data?.monthly_price_naira ?? "__"}`}
            </p>
          </div>
        </div>
      </div>
      <motion.div
        className="absolute -bottom-2 right-0 z-10"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Image
          src="/assets/subscription/bags.svg"
          alt="Shopping bag image"
          width={128}
          height={128}
          className="size-40"
        />
      </motion.div>
    </motion.div>
  );
}
