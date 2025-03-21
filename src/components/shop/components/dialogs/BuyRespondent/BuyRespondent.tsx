"use client";
import React from "react";
import { Arrow, Purchases1 } from "@/assets/images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const BuyRespondent = () => {
  return (
    <div className="bg-[#FCFCFD] rounded-[11.72px] max-md:gap-6 max-w-[204px] py-2.5 border-[0.59px] flex flex-col justify-between h-full w-full">
      <div className="px-8">
        <Image src={Purchases1} alt="icons" className="size-full" />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center justify-center">
            <Button variant="gradient" className="h-[25px] gap-1 text-xs">
              Respondents <Image src={Arrow} alt="icons" className="size-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[80%] md:max-w-[425px] max-h-[60vh] lg:max-h-[425px] flex flex-col justify-center items-center gap-5 bg-white border-0 outline-none px-10 py-5">
          Buy Res Data
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default BuyRespondent;
