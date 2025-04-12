"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Arrow,
  Purchases2,
  Purchases3,
  Purchases4,
  Purchases5,
  Purchases6,
} from "@/assets/images";
import Image from "next/image";
// import BuyDialog from "./dialogs/BuyPollcoins";
import BuyAICredit from "./dialogs/BuyAICredits";
import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";
import BuyOCR from "./dialogs/BuyOCR";

export function InAppPurchases() {
  return (
    <div className="mt-10 flex-col gap-5 flex max-md:px-4">
      <p className="text-xl font-bold">In-app Purchases</p>
      <div className="flex md:items-stretch gap-4 h-full max-md:grid grid-cols-2">
        <BuyRespondent />

        <div className="bg-[#FCFCFD] rounded-lg max-w-[204px] gap-3 max-md:gap-6 py-2.5 border flex flex-col justify-between h-full w-full">
          <div className="flex-grow px-8 flex items-center">
            <Image
              src={Purchases2}
              alt="icons"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mt-auto flex flex-col items-center justify-center px-3">
            <BuyAICredit>
              <Button variant="gradient" className="h-6 gap-1 text-xs w-full">
                AI Survey Generation{" "}
                <Image src={Arrow} alt="icons" className="w-4 h-4" />
              </Button>
            </BuyAICredit>
          </div>
        </div>

        <div className="bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 gap-3 py-2.5 border flex flex-col justify-between h-full w-full">
          <div className="flex-grow px-8 flex items-center">
            <Image
              src={Purchases3}
              alt="icons"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mt-auto flex flex-col items-center justify-center px-3">
            <BuyOCR>
              <Button variant="gradient" className="h-6 gap-1 text-xs w-full">
                OCR Document Scan{" "}
                <Image src={Arrow} alt="icons" className="w-4 h-4" />
              </Button>
            </BuyOCR>
          </div>
        </div>

        <div className="bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 py-2.5 border flex flex-col justify-between h-full w-full">
          <div className="flex-grow px-8 flex items-center">
            <Image
              src={Purchases4}
              alt="icons"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mt-auto flex flex-col items-center justify-center px-3">
            <BuyAICredit>
              <Button variant="gradient" className="h-6 gap-1 text-xs w-full">
                AI Analysis{" "}
                <Image src={Arrow} alt="icons" className="w-4 h-4" />
              </Button>
            </BuyAICredit>
          </div>
        </div>

        <div className="bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 py-2.5 border flex flex-col justify-between h-full w-full">
          <div className="flex-grow px-8 flex items-center">
            <Image
              src={Purchases5}
              alt="icons"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mt-auto flex flex-col items-center justify-center px-3">
            <BuyAICredit>
              <Button variant="gradient" className="h-6 gap-1 text-xs w-full">
                AI Reporting{" "}
                <Image src={Arrow} alt="icons" className="w-4 h-4" />
              </Button>
            </BuyAICredit>
          </div>
        </div>

        <div className="bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 py-2.5 border flex flex-col justify-between h-full w-full">
          <div className="flex-grow px-8 flex items-center">
            <Image
              src={Purchases6}
              alt="icons"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mt-auto flex flex-col items-center justify-center px-3">
            <BuyAICredit> 
              <Button variant="gradient" className="h-6 gap-1 text-xs w-full">
                Voice Transcription{" "}
                <Image src={Arrow} alt="icons" className="w-4 h-4" />
              </Button>
            </BuyAICredit>
          </div>
        </div>
      </div>
    </div>
  );
}
