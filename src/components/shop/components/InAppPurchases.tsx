"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/assets/images";
import Image from "next/image";

import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";
import { cn } from "@/lib/utils";
import { BuyServicesDialog } from "./dialogs/BuyServices";
import {
  useAIAnalysisRate,
  useAIReportingRate,
  useAISurveyGenerationRate,
  useOCRDocumentRate,
  useVoiceTranscriptionRate,
} from "../queries/useServicesRates";
import { useCreditPurchase } from "../queries/useServicesPurchase";

export function InAppPurchases() {
  const { data: analysisRate, isLoading: analysisLoading } =
    useAIAnalysisRate();
  const { data: ocrRate, isLoading: ocrLoading } = useOCRDocumentRate();
  const { data: surveyRate, isLoading: surveyLoading } =
    useAISurveyGenerationRate();
  const { data: reportingRate, isLoading: reportingLoading } =
    useAIReportingRate();
  const { data: voiceRate, isLoading: voiceLoading } =
    useVoiceTranscriptionRate();

  const servicesWithPurchaseHandlers = [
    {
      serviceType: "ai-survey-generation",
      title: "AI Survey Generation Credit",
      cta: "AI Survey Generation",
      placeholder: "Enter AI-Credit amount",
      src: "/assets/shop/svg/credit.svg",
      creditsPerUnit: surveyRate?.creditsPerUnit,
      pricePerCredit: surveyRate?.pricePerCredit,
      minimumPurchase: surveyRate?.minimumPurchase,
      purchaseService: useCreditPurchase("ai-survey-generation"),
    },
    {
      serviceType: "ocr",
      title: "OCR Document Scan Credit",
      cta: "OCR Document Scan",
      placeholder: "Enter OCR Credit amount",
      src: "/assets/shop/svg/OCRScan.svg",
      creditsPerUnit: ocrRate?.creditsPerUnit,
      pricePerCredit: ocrRate?.pricePerCredit,
      minimumPurchase: ocrRate?.minimumPurchase,
      purchaseService: useCreditPurchase("ocr-document"),
    },
    {
      serviceType: "ai-analysis",
      title: "AI Analysis Credit",
      cta: "AI Analysis",
      placeholder: "Enter AI Analysis Credit Amount",
      src: "/assets/shop/svg/AIAnalysis.svg",
      creditsPerUnit: analysisRate?.creditsPerUnit,
      pricePerCredit: analysisRate?.pricePerCredit,
      minimumPurchase: analysisRate?.minimumPurchase,
      purchaseService: useCreditPurchase("ai-analysis"),
    },
    {
      serviceType: "ai-reporting",
      title: "AI Report Generation Credit",
      cta: "AI Reporting",
      placeholder: "Enter AI Report Generation amount",
      src: "/assets/shop/svg/AIReporting.svg",
      creditsPerUnit: reportingRate?.creditsPerUnit,
      pricePerCredit: reportingRate?.pricePerCredit,
      minimumPurchase: reportingRate?.minimumPurchase,
      purchaseService: useCreditPurchase("ai-reporting"),
    },
    {
      serviceType: "voice-transcription",
      title: "Voice Transcription Credit",
      cta: "Voice Transcription",
      placeholder: "Enter Voice Transcription credit amount",
      src: "/assets/shop/svg/VoiceTranscription.svg",
      creditsPerUnit: voiceRate?.creditsPerUnit,
      pricePerCredit: voiceRate?.pricePerCredit,
      minimumPurchase: voiceRate?.minimumPurchase,
      purchaseService: useCreditPurchase("voice-transcription"),
    },
  ];

  return (
    <div className="mt-10 flex-col gap-5 flex max-md:px-4">
      <p className="text-xl font-bold">In-App Purchases</p>
      <div className="flex md:items-stretch  gap-4 h-full max-lg:grid grid-cols-2">
        <BuyRespondent />

        {servicesWithPurchaseHandlers.map((service, index) => {
          const {
            title,
            placeholder,
            cta,
            src,
            minimumPurchase,
            creditsPerUnit,
            pricePerCredit,
          } = service;

          return (
            <div
              key={title}
              className={cn(
                "bg-[#FCFCFD] rounded-lg max-w-[204px] max-md:gap-6 gap-3 py-2.5 border flex flex-col justify-between h-full w-full"
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

              <div className="mt-auto flex flex-col items-center justify-center px-1.5">
                <BuyServicesDialog
                  title={title}
                  creditsPerUnit={creditsPerUnit}
                  pricePerCredit={pricePerCredit}
                  minimumPurchase={minimumPurchase}
                  placeholder={placeholder}
                  isLoading={
                    analysisLoading ||
                    ocrLoading ||
                    voiceLoading ||
                    surveyLoading ||
                    reportingLoading
                  }
                  onPurchase={(amount: string) => {
                    const parsedAmount = parseFloat(amount);
                    console.log(parsedAmount, "Parsed Amount");

                    if (isNaN(parsedAmount)) {
                      return Promise.reject("Invalid amount");
                    }

                    return service.purchaseService.mutateAsync({
                      amount: parsedAmount,
                      serviceType: service.serviceType,
                    });
                  }}
                >
                  <Button
                    variant="gradient"
                    className="h-6 gap-1 text-xs w-full px-0.5"
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
