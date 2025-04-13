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

import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";
import { cn } from "@/lib/utils";
import { BuyServicesDialog } from "./dialogs/BuyServices";

export function InAppPurchases() {
  const ServicesData = [
    {
      title: "AI Survey Generation Credit",
      cta: "AI Survey Generation",
      rate: 5,
      placeholder: "Enter AI-Credit amount",
      src: "/assets/shop/svg/credit.svg",
    },
    {
      title: "OCR Document Scan Credit",
      cta: "OCR Document Scan",
      rate: 5,
      placeholder: "Enter OCR Credit amount",
      src: "/assets/shop/svg/OCRScan.svg",
    },
    {
      title: "AI Analysis Credit",
      cta: "AI Analysis",
      rate: 5,
      placeholder: "Enter AI Analysis Credit Amount",
      src: "/assets/shop/svg/AIAnalysis.svg",
    },
    {
      title: "AI Report Generation Credit",
      cta: " AI Reporting",
      rate: 5,
      placeholder: "Enter AI Report Generation amount",
      src: "/assets/shop/svg/AIReporting.svg",
    },
    {
      title: "Voice Transcription credit",
      cta: "Voice Transcription",
      rate: 5,
      placeholder: "Enter Voice Transcription credit amount",
      src: "/assets/shop/svg/VoiceTranscription.svg",
    },
  ];
  return (
    <div className="mt-10 flex-col gap-5 flex max-md:px-4">
      <p className="text-xl font-bold">In-app Purchases</p>
      <div className="flex md:items-stretch gap-4 h-full max-md:grid grid-cols-2">
        <BuyRespondent />

        {ServicesData.map((service, index) => {
          const { title, rate, placeholder, cta, src } = service;

          return (
            <div
              key={title}
              className={cn(
                "bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 gap-3 py-2.5 border flex flex-col justify-between h-full w-full",
              )}
            >
              <div className="flex w-full items-center justify-center">
              <div className="px-8 w-[127px] h-[127px] flex items-center justify-center relative">
                <Image
                  src={src}
                  alt="icons"
                  layout="fill"
                  className="object-contain"
                />
              </div>
              </div>

              <div className="mt-auto flex flex-col items-center justify-center px-3">
                <BuyServicesDialog
                  title={title}
                  rate={rate}
                  placeholder={placeholder}
                >
                  <Button
                    variant="gradient"
                    className="h-6 gap-1 text-xs w-full"
                  >
                    {cta}
                    <Image src={Arrow} alt="icons" className="w-4 h-4" />
                  </Button>
                </BuyServicesDialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
