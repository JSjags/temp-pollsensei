import React from "react";
import Purchases1 from "@/assets/images/shop/purchases-1.svg";
import Purchases2 from "@/assets/images/shop/purchases-2.svg";
import { Button } from "@/components/ui/button";
import Arrow from "@/assets/images/shop/arrow.svg";

export function InAppPurchases() {
  return (
    <div className="mt-10 flex-col gap-5 flex">
      <p className="text-xl font-bold">In-app Purchases</p>
      <div className="flex items-stretch gap-[14px]">
        <div className="bg-[#FCFCFD] rounded-[11.72px] max-w-[204px] py-2.5 border-[0.59px] flex flex-col justify-between h-full w-full">
          <div className="px-8 w-full size-[138px]">
            <Purchases1 />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button variant="gradient" className="h-[25px] gap-1 text-xs">
              Respondents <Arrow className="size-4" />
            </Button>
          </div>
        </div>

        <div className="bg-[#FCFCFD] rounded-[11.72px] max-w-[204px] py-2.5 border-[0.59px] flex flex-col justify-between h-full w-full">
          <div className="px-8">
            <Purchases2 />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button variant="gradient" className="h-[25px] gap-1 text-xs">
              AI-Credit <Arrow className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
