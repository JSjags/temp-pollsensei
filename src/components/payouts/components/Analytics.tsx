import React from "react";
import { Header } from "./Header";
import {
  CoinRedeemed,
  CoinsObtained,
  OverallEarnings,
  PayoutInfoIcon,
  Pollcoin,
  RedeemableCoin,
} from "@/assets/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePayoutStore } from "../store/usePayoutStore";
import { useUserBalance } from "@/components/shop/queries/useBalance";
import { Skeleton } from "@/components/ui/skeleton";

export function Analytics() {
  const { data, isLoading } = useUserBalance();
  const { unrestrictedBalance } = data || {};
  const { overallEarnings, coinsObtained, redeemableCoins, coinsRedeemed } =
    usePayoutStore();

  const analyticData = [
    {
      label: "Overall Earnings",
      value: overallEarnings,
      icon: OverallEarnings,
    },
    {
      label: "Coins Obtained",
      value: coinsObtained,
      icon: CoinsObtained,
    },
    {
      label: "Redeemable Coins",
      value: unrestrictedBalance || 0,
      icon: RedeemableCoin,
    },
    {
      label: "Coins Redeemed",
      value: coinsRedeemed,
      icon: CoinRedeemed,
    },
  ];
  return (
    <div className="flex flex-col gap-7">
      <Header />
      <div className="grid grid-cols-4 max-[1220px]:grid-cols-2 gap-4 w-full max-md:px-5 max-md:hidden">
        {analyticData.map((analytic) => {
          const { label, icon, value } = analytic;
          return (
            <div
              key={label}
              className="bg-white rounded-[6.8px] p-5 shadow-[0px_1.36px_4.08px_0px_#34037914] w-auto"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {isLoading ? (
                      <Skeleton className="h-5 w-full" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Image src={Pollcoin} alt="icons" className="size-6" />
                        <h4 className="text-xl font-bold">
                          {value.toLocaleString()}
                        </h4>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "size-[34px] flex items-center justify-center"
                    )}
                  >
                    <Image src={icon} alt="icons" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#D7AEF91A] md:rounded-2xl md:border-l border-l-tertiary md:px-12 py-4 w-full flex max-md:flex-col max-md:gap-6 px-5">
        <div className="flex md:items-center md:justify-center items-start md:gap-7 gap-3 w-auto md:border-r border-r-tertiary md:pr-10">
          <Image src={PayoutInfoIcon} alt="info" className="min-w-9" />
          <div>
            <h4 className="font-bold text-[1.75rem] max-md:text-lg">
              1000 <span className="font-normal">Pollcoins</span>
            </h4>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-[#05BF43] rounded-full animate-pulse" />
              <p className="text-xs text-[#7A8699]">Threshold Amount</p>
            </div>
          </div>
          <p className="text-new-tertiary text-xs w-[45%]">
            The threshold amount of Pollcoins must be obtained before
            accumulated coins can be redeemed for cash through payouts
          </p>
        </div>
        <div className="md:pl-10">
          <p className="text-new-tertiary text-xs md:w-[55%]">
            You will be paid for each survey you take at the end of the survey
            in PollCoins. You can then convert accumulated Pollcoins to USD.
          </p>
        </div>
      </div>
    </div>
  );
}
