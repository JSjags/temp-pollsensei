import React from "react";
import { Arrow, PayoutCash, Pollcoin } from "@/assets/images";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PayoutDialog } from "./dialogs";
import { usePayoutStore } from "../store/usePayoutStore";
import { useUserBalance } from "@/components/shop/queries/useBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { useNigerianBanks } from "../queries/useNigerianBanks";

export function Header() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading } = useUserBalance();
  const { unrestrictedBalance } = data || {};
  const { redeemableCoins, threshold } = usePayoutStore();

  return (
    <div className="flex md:items-center justify-between max-md:flex-col gap-5 max-md:px-5 ">
      <div className="space-y-2 flex-1">
        <div className="flex lg:items-center gap-2">
          <h1 className="text-xl md:text-[38px] font-bold">
            Hey, {user?.name.split(" ")[0]} 👋
          </h1>
        </div>
        <p className="text-lg md:text-3xl text-new-elements mt-1">
          Here’s your Payout History
        </p>
      </div>
      <div className="flex justify-end w-1/2 max-md:w-full">
        <div
          className={cn(
            "border border-new-elements-border bg-white rounded-2xl flex items-center justify-between w-full gap-4 md:px-8 py-4 max-md:flex-col",
            {}
          )}
        >
          <div className="flex items-center gap-5">
            <div className="max-w-12 w-full">
              <Image src={PayoutCash} alt="money" />
            </div>
            <div className="w-full">
              <p className="text-xs text-[#7A8699]">Redeemble Coins</p>
              {isLoading ? (
                <Skeleton className="h-7 w-full" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Image src={Pollcoin} alt="icons" className="size-8" />
                  <h4 className="font-bold text-[1.75rem]">
                    {unrestrictedBalance?.toLocaleString() || 0}{" "}
                  </h4>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-2 bg-[#05BF43] rounded-full animate-pulse",
                    { "bg-red-500": unrestrictedBalance < threshold }
                  )}
                />
                <p className="text-xs text-[#7A8699]">
                  {unrestrictedBalance < threshold
                    ? "Below Threshold"
                    : "Above Threshold"}
                </p>
              </div>
            </div>
          </div>
          <PayoutDialog>
            <Button
              disabled={unrestrictedBalance === 0}
              variant="gradient"
              className="gap-2"
            >
              Request Payout <Image src={Arrow} alt="arrow" />
            </Button>
          </PayoutDialog>
        </div>
      </div>
    </div>
  );
}
