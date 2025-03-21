import {
  RedeemableCoins,
  RedeemableHowIcon,
  RedeemCoins,
  RedeemedCoins,
  ReferralIcon,
} from "@/assets/images";
import React from "react";

import { Dialog } from "@/components/ui/new-dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Redeemable from "@/components/shop/components/dialogs/Redeemable";
import { Header } from "./Header";

const analyticData = [
  {
    label: "Referred",
    value: 0,
    icon: ReferralIcon,
  },
  {
    label: "Coins Obtained",
    value: 0,
    icon: RedeemableCoins,
  },
  {
    label: "Redeemable Coins",
    value: 0,
    icon: RedeemCoins,
  },
  {
    label: "Coins Redeemed",
    value: 0,
    icon: RedeemedCoins,
  },
];
export function Analytics() {
  return (
    <>
      <Header />
      <div className="grid grid-cols-4 gap-4 w-full max-md:px-5 mt-6 max-md:hidden">
        {analyticData.map((analytic) => {
          const { label, icon, value } = analytic;
          return (
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
          );
        })}
      </div>
      <div className="w-full justify-end flex mt-4">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="gradient">Redeem coins</Button>
          </Dialog.Trigger>
          <Dialog.Content className="z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]">
            <Redeemable />
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </>
  );
}
