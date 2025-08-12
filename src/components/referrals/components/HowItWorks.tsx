import { HowIcon, Share, StackedCoin } from "@/assets/images";
import Image from "next/image";
import React from "react";

export function HowItWorks() {
  return (
    <div className="mt-10 w-full flex flex-col max-md:mt-16">
      <p className="text-lg font-bold">How it Works</p>

      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[22px] mt-3">
        {howItWorksData.map((item, index) => (
          <div
            key={`how-it-works-data-${index}`}
            className="rounded-[11px] bg-white flex items-center gap-6 py-[35px] px-4 max-h-[185px]"
          >
            <div className="size-[54px] min-w-[54px]">
              <Image src={HowIcon} alt="star" />
            </div>
            <div>
              <p className="font-medium mb-[14px]">{item.title}</p>
              <p className="text-[#444444] text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* share referral link */}
      <div className="mt-5 flex flex-col gap-3">
        <p className="text-lg font-bold">How it Works</p>
        <div className="bg-tertiary w-full rounded-[11px] py-5 px-4 flex md:items-center justify-between max-md:flex-col gap-4">
          <div className="flex items-center gap-6">
            <div className="min-w-[54px]">
              <Image src={StackedCoin} alt="coin svg" />
            </div>
            <div>
              <p className="text-[#DFDFDF]">Direct Referral</p>
              <p className="font-bold text-[28px] text-white">
                15 <span className="text-lg font-normal">PollCoins</span>
              </p>
            </div>
          </div>
          <div className="bg-[#C6BCF18F] rounded-full h-[54px] px-[33px] flex items-center justify-center gap-2">
            <p className="text-white font-medium">Share referral link</p>
            <div className="min-w-[34px]">
              <Image src={Share} alt="share svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const howItWorksData = [
  {
    title: "Refer a friend",
    description:
      "To refer a friend, simply copy and share your personal referral link with them, and ensure they sign up on PollSensei using your referral.",
  },
  {
    title: "Earn Referral Coin",
    description:
      "You are awarded PollCoins for each successful referral.",
  },
  {
    title: "Redeem earned Coins",
    description:
      "You can convert the PollCoins earned from referrals to cash once you have passed the coin threshold.",
  },
];
