"use client";
import React, { FC } from "react";
import Image from "next/image";
import congrats from "@/assets/images/congrats.svg";
import stakedCoins from "@/assets/images/stacked-coins.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CongratulationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coins: number;
}

export const CongratulationsDialog: FC<CongratulationsDialogProps> = ({
  open,
  onOpenChange,
  coins = 100,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] md:max-w-[425px] min-h-auto bg-white border-0 outline-none px-5 lg:px-10 py-5 z-[1000000] flex flex-col justify-center items-center gap-5">
        <Image src={congrats} width={250} height={250} alt="congrats" />
        <h1 className="text-base lg:text-[28px] font-bold text-center text-[#333333]">
          Congratulations!
        </h1>
        <div className="flex items-center gap-1">
          <Image src={stakedCoins} width={30} height={30} alt="Stacked Coins" />
          <p className="text-[40px] text-[#5B03B2] font-bold">+{coins}</p>
        </div>
        <p className="text-sm lg:text-base text-[#898989] text-center">
          Earnings from following on social media has been added to your coin
          wallet
        </p>
      </DialogContent>
    </Dialog>
  );
};
