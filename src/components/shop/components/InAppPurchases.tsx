"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Arrow, Purchases2 } from "@/assets/images";
import Image from "next/image";
// import BuyDialog from "./dialogs/BuyPollcoins";
import BuyAICredit from "./dialogs/BuyAICredits";
import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";

export function InAppPurchases() {
  return (
    <div className="mt-10 flex-col gap-5 flex max-md:px-5">
      <p className="text-xl font-bold">In-app Purchases</p>
      <div className="flex md:items-stretch gap-[14px] h-full">
        <BuyRespondent />

        <div className="bg-[#FCFCFD] rounded-[11.72px] max-w-[204px] max-md:gap-6 py-2.5 border-[0.59px] flex flex-col justify-between h-full w-full">
          <div className="px-8">
            <Image src={Purchases2} alt="icons" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <BuyAICredit>
              <Button variant="gradient" className="h-[25px] gap-1 text-xs">
                AI-Credit <Image src={Arrow} alt="icons" className="size-4" />
              </Button>
            </BuyAICredit>
          </div>
        </div>
      </div>
    </div>
  );
}
