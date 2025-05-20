"use client";
import {
  RedeemableCoins,
  RedeemedCoins,
  ReferralIcon,
} from "@/assets/images";
import React, { useState } from "react";
import Image from "next/image";
import { Header } from "./Header";
import { motion } from "framer-motion";

import Slider, { Settings } from "react-slick";
import { useWindowSize } from "@uidotdev/usehooks";
import { useReferralStats } from "../queries/useReferralStats";
import { Skeleton } from "@/components/ui/skeleton";

export function Analytics() {
  const { width } = useWindowSize();
  const isTablet = width && width <= 768;
  const { data: referralStats, isLoading: referralLoading } =
    useReferralStats();
  const totalReferrals = referralStats?.total_referrals;
  const successfulReferrals = referralStats?.successful_referrals;
  const coinsObtained = referralStats?.referral_rewards?.total_earned;
  const availableCoins = referralStats?.referral_rewards?.available;

  const updatedAnalyticData = getAnalyticData({
    // redeemableCoins: restrictedBalance,
    totalReferrals,
    successfulReferrals,
    coinsObtained,
    availableCoins,
  });
  return (
    <div className="w-full">
      <Header />
      {isTablet ? (
        <div className="w-full my-7">
          <MobileSlider analyticData={updatedAnalyticData} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full max-md:px-5 mt-6">
          {updatedAnalyticData.map(({ label, icon, value }) => (
            <div
              key={label}
              className="bg-white rounded-[6.8px] p-5 shadow-[0px_1.36px_4.08px_0px_#34037914]"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {referralLoading ? (
                      <Skeleton className="h-5 w-full" />
                    ) : (
                      <h4 className="text-xl font-bold">{value}</h4>
                    )}
                  </div>
                  <div className="size-12 flex items-center justify-center">
                    <Image src={icon} alt="icons" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <div className="w-full md:justify-end flex mt-4 max-md:mt-16">
        <PayoutDialog>
          <Button variant="gradient">Redeem coins</Button>
        </PayoutDialog>
      </div> */}
    </div>
  );
}

function getAnalyticData({
  // redeemableCoins,
  totalReferrals,
  successfulReferrals,
  coinsObtained,
  availableCoins,
}: {
  // redeemableCoins: number;
  totalReferrals: number;
  successfulReferrals: number;
  coinsObtained: number;
  availableCoins: number;
}) {
  return [
    // {
    //   label: "Total Referrals",
    //   value: totalReferrals?.toLocaleString(),
    //   icon: ReferralIcon,
    // },
    {
      label: "Successful Referrals",
      value: successfulReferrals?.toLocaleString(),
      icon: ReferralIcon,
    },
    {
      label: "Referral Coins Obtained",
      value: coinsObtained?.toLocaleString(),
      icon: RedeemableCoins,
    },
    // {
    //   label: "Redeemable Coins",
    //   value: redeemableCoins?.toLocaleString(),
    //   icon: RedeemCoins,
    // },
    {
      label: "Available Referral Coins",
      value: availableCoins?.toLocaleString(),
      icon: RedeemedCoins,
    },
  ];
}

function MobileSlider({
  analyticData,
}: {
  analyticData: ReturnType<typeof getAnalyticData>;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dotsClass: "flex items-center justify-center",
    appendDots: (dots) => (
      <div className="!static !flex !items-center !justify-center">
        <ul className="slick-dots w-full !flex gap-1 items-center justify-center">
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="h-1 rounded-full"
        style={{
          backgroundColor: i === currentSlide ? "#9D50BB" : "#E0C8EA",
          width: i === currentSlide ? 30 : 8,
        }}
      />
    ),
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
  };

  return (
    <Slider {...settings}>
      {analyticData.map(({ label, icon, value }) => (
        <div
          key={label}
          className="bg-white rounded-[6.8px] p-5 shadow-[0px_1.36px_4.08px_0px_#34037914]"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <h4 className="text-xl font-bold">{value}</h4>
              </div>
              <div className="size-12 flex items-center justify-center">
                <Image src={icon} alt="icons" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}
