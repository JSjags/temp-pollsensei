"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AIGeneration,
  AIReporting,
  Analysis,
  Arrow,
  AvailableIcon,
  Coins,
  InfoIcon,
  MoneyIcon,
  NonRedeemable,
  OCR,
  Pollcoin,
  RespondentIcon,
  Voice,
} from "@/assets/images";
import Link from "next/link";
import Image from "next/image";
import { PayoutDialog } from "@/components/payouts/components/dialogs";
import { useUserBalance, useUserServicesBalance } from "../queries/useBalance";
import { Skeleton } from "@/components/ui/skeleton";
import Slider, { Settings } from "react-slick";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  fetchTotalPurchasedRespondents,
  fetchPurchasedRespondentsStats,
} from "@/services/api/apiRequest";
import { useWindowSize } from "@uidotdev/usehooks";
import { formatLargeNumber } from "@/utils";

type ServiceBalance = {
  serviceType: string;
  credits: number;
};

interface Purchase {
  _id: string;
  numberOfRespondents: number;
  totalCost: number;
  status: string;
  completedResponses: number;
  purchaseId: string;
  surveyName: string;
  purchaseDate: string;
}

interface TotalPurchasedRespondentsData {
  purchases: Purchase[];
  total: number;
}

export function Analytics() {
  const router = useRouter();
  const [showAllSurveys, setShowAllSurveys] = useState(false);
  const { data, isLoading: balanceLoading } = useUserBalance();
  const { data: servicesBalance, isLoading: servicesBalanceLoading } =
    useUserServicesBalance();
  const { restrictedBalance, unrestrictedBalance, totalBalance } = data || {};
  const [currentSlide, setCurrentSlide] = useState(0);

  const parseFormattedNumber = (formattedNum: string): number => {
    return Number(formattedNum.replace(/,/g, ""));
  };

  const analyticData = [
    {
      // label: "AI Survey Generation",
      label: "Survey Credits(SC)",
      value: 0,
      icon: AIGeneration,
      iconColor: "#3575FF",
      key: "ai-survey-generation",
      description:
        "Credits used for AI-powered survey generation. Each credit allows you to create one survey using our AI assistant.",
    },
    {
      label: "OCR Credits(OC)",
      value: 0,
      icon: OCR,
      iconColor: "#F36643",
      key: "ocr-document",
      description:
        "Credits used for Optical Character Recognition (OCR) document scanning. Each credit processes one document to extract text and data.",
    },
    {
      label: "Analysis Credits(AC)",
      value: 0,
      icon: Analysis,
      iconColor: "#4524F8",
      key: "ai-analysis",
      description:
        "Credits used for AI-powered survey analysis. Each credit provides comprehensive analysis of your survey responses.",
    },
    {
      label: "Report Credits(RC)",
      value: 0,
      icon: AIReporting,
      iconColor: "#0ACF80",
      key: "ai-reporting",
      description:
        "Credits used for AI-generated survey reports. Each credit creates a detailed report with insights and visualizations.",
    },
    {
      label: "Transcription Credits(TC)",
      value: 0,
      icon: Voice,
      iconColor: "#0ACF80",
      key: "voice-transcription",
      description:
        "Credits used for voice transcription services. Each credit transcribes audio recordings to text format.",
    },
  ];
  const populatedAnalyticData = analyticData.map((item) => {
    const matchingService = (servicesBalance as ServiceBalance[])?.find(
      (service) => service.serviceType === item.key
    );

    return {
      ...item,
      value: matchingService?.credits.toLocaleString() || 0,
    };
  });

  const coinsData = [
    {
      label: "Available Pollcoins",
      value: totalBalance?.toLocaleString() || 0,
      icon: AvailableIcon,
      iconColor: "#DDC6EE",
      bgColor: "#51059D",
    },
    {
      label: "Redeemable Pollcoins",
      value: unrestrictedBalance?.toLocaleString() || 0,
      icon: MoneyIcon,
      iconColor: "#D1EAFA",
      bgColor: "#0A3F60",
    },
    {
      label: "Non-Redeemable Pollcoins",
      value: restrictedBalance?.toLocaleString() || 0,
      icon: NonRedeemable,
      iconColor: "#D1D3FA",
      bgColor: "#0053B8",
    },
  ];

  const { data: surveys, isLoading: loadingSurveys } = useQuery({
    queryKey: [...[APP_KEYS.TOTAL_RESPONDENTS]],
    queryFn: () => fetchTotalPurchasedRespondents(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: surveyStats, isLoading: loadingSurveyStats } = useQuery({
    queryKey: [...[APP_KEYS.SURVEY_STATS]],
    queryFn: () => fetchPurchasedRespondentsStats(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 2.1,
    slidesToScroll: 1,
    autoplay: false,
    dotsClass: "flex items-center justify-center",
    centerPadding: "12px",
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
    <TooltipProvider>
      <div className="w-full">
        {/*desktop Banner */}
        <div className="bg-gradient-to-br w-full from-[#9D50BB] max-md:flex-col via-[#5B03B2] max-md:w-full text-white to-[#260D3E] px-4 py-6 max-md:pb-0 md:rounded-[6.8px] relative flex md:items-center justify-between">
          <div className="md:w-1/3">
            <p>Welcome to the</p>
            <h3 className="text-3xl max-md:text-2xl font-bold">
              Pollsensei Shop
            </h3>
          </div>
          <div className="flex max-md:items-center max-md:justify-center w-full max-md:pt-6">
            <div className="rounded-tr-[27px] rounded-tl-[27px] flex max-md:items-center max-md:flex-col max-md:justify-center justify-between w-full gap-[11px] max-md:bg-white/10 md:px-[18px] px-10 pt-[14px] max-md:max-w-[317px] max-md:pb-8">
              <p className="text-[0.8125rem] md:max-w-[547px] max-md:text-center">
                Purchase Pollcoins with cash which is used for in-app purchases
                such as such as buying of respondents, and credit for AI-aided
                features such as Survey generation, Survey Reporting, Voice
                Transcription, Survey Analysis and OCR Document scanning.
              </p>
              <Button
                onClick={() => router.push("/shop/buy-pollcoins")}
                variant={"gradient"}
                className="min-w-[131px] h-[51px] max-md:h-11 max-md:w-full font-bold gap-1 py-[7px] max-md:mt-6 z-40"
              >
                Buy Pollcoins
                <Image src={Arrow} alt="icons" className="size-5" />
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0">
            <Image src={Coins} alt="icons" />
          </div>
        </div>

        <div className="w-full flex gap-4 my-[22px] h-full items-stretch max-[1400px]:flex-col max-md:px-4">
          <div className="flex-1 flex flex-col gap-4 h-full items-stretch min-h-[200px]">
            <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-4">
              {coinsData.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-lg p-4 text-white h-full max-[1100px]:col-span-2 max-[1100px]:order-2",
                    {
                      "max-[1100px]:col-span-4 max-[1100px]:order-1":
                        index === 1,
                    }
                  )}
                  style={{ backgroundColor: `${item.bgColor}` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-[#F7F3FC]">{item.label}</p>
                      {balanceLoading ? (
                        <Skeleton className="h-6 w-full mt-2" />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Image
                            src={Pollcoin}
                            alt="icons"
                            className="size-8"
                          />
                          <h4 className="text-xl font-bold">{item.value}</h4>
                        </div>
                      )}
                    </div>
                    <div
                      style={{ backgroundColor: `${item.iconColor}1A` }}
                      className={cn(
                        "size-[34px] rounded-[6.8px] flex items-center justify-center"
                      )}
                    >
                      <Image src={item.icon} alt="icons" />
                    </div>
                  </div>

                  <div className="flex items-end justify-end pt-2 text-sec-text">
                    {item.label !== "Redeemable Pollcoins" && (
                      <div className="flex items-center gap-1">
                        <span>
                          <Image src={InfoIcon} alt="icons" />
                        </span>
                        <Link
                          href="#"
                          className="text-[#F7F3FC] text-xs underline"
                        >
                          Learn more
                        </Link>
                      </div>
                    )}
                    {item.label === "Redeemable Pollcoins" && (
                      <PayoutDialog>
                        <Button
                          disabled={unrestrictedBalance === 0 || balanceLoading}
                          variant="gradient"
                          className="h-[29px]"
                        >
                          Redeem coins
                        </Button>
                      </PayoutDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="gap-4 w-full grid grid-cols-5 max-[1100px]:grid-cols-4 h-full max-md:hidden">
              {populatedAnalyticData.map((analytic, index) => (
                <div
                  key={analytic.label}
                  className={cn(
                    "bg-white rounded-[6.8px] p-4 shadow-[0px_1.36px_4.08px_0px_#34037914]",
                    "max-[1100px]:col-span-2 max-[1100px]:order-2",
                    {
                      "max-[1100px]:col-span-4 max-[1100px]:order-1":
                        index === populatedAnalyticData.length - 1,
                    }
                  )}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div
                      className={cn(
                        "size-[34px] rounded-[6.8px] flex items-center justify-center bg-[#5B03B21A]"
                      )}
                    >
                      <Image src={analytic.icon} alt="icons" />
                    </div>
                    <div className="flex items-start justify-between mt-1.5">
                      <div className="flex flex-col gap-1.5 w-full">
                        <p className="text-xs text-muted-foreground">
                          {analytic.label}
                        </p>
                        <div className="flex items-center justify-between w-full">
                          {servicesBalanceLoading ? (
                            <Skeleton className="h-6 w-full" />
                          ) : (
                            <h4 className="text-xl font-bold">
                              {formatLargeNumber(
                                parseFormattedNumber(String(analytic.value)) ??
                                  0
                              )}
                            </h4>
                          )}
                          <span>
                            <Image src={InfoIcon} alt="icons" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden w-full analytics">
              <Slider {...settings}>
                {populatedAnalyticData.map((analytic, index) => (
                  <div
                    key={analytic.label}
                    className={cn(
                      "bg-white rounded-[6.8px] min-h-[150px] p-4 shadow-[0px_1.36px_4.08px_0px_#34037914]",
                      "mr-3",
                      { "mr-0": index === analyticData.length - 1 }
                    )}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div
                        className={cn(
                          "size-[34px] rounded-[6.8px] flex items-center justify-center bg-[#5B03B21A]"
                        )}
                      >
                        <Image src={analytic.icon} alt="icons" />
                      </div>
                      <div className="flex items-start justify-between mt-1.5">
                        <div className="flex flex-col gap-1.5 w-full">
                          <p className="text-xs text-muted-foreground">
                            {analytic.label}
                          </p>
                          <div className="flex items-center justify-between w-full">
                            {servicesBalanceLoading ? (
                              <Skeleton className="h-6 w-full" />
                            ) : (
                              <h4 className="text-xl font-bold">
                                {analytic.value}
                              </h4>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  <Image src={InfoIcon} alt="icons" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {analytic.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Surverys */}
          <div className="w-[35%] max-[1400px]:w-full max-sm:w-full rounded-lg py-4 px-4 relative bg-white shadow-[0px_1.36px_4px_0px_#34037914] flex flex-col md:flex-row justify-between gap-5 md:gap-5 h-auto items-stretch">
            <div className="flex justify-between w-full md:w-[48%] h-full items-stretch">
              <div className="w-full flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">
                      Total Purchased Respondents
                    </p>
                    <h4 className="text-xl font-bold">
                      {loadingSurveyStats ? (
                        <Skeleton className="h-6 w-16" />
                      ) : (
                        surveyStats?.total_purchased ?? 0
                      )}
                    </h4>
                  </div>
                  <div
                    className={cn(
                      "w-auto h-auto p-3 rounded-[6.8px] flex items-center justify-center bg-[#4524F8]/10"
                    )}
                  >
                    <Image
                      src={RespondentIcon}
                      width={20}
                      height={15}
                      alt="icons"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span>
                    <Image src={InfoIcon} alt="icons" />
                  </span>
                  <Link
                    href="#"
                    className="text-muted-foreground text-xs underline"
                  >
                    Learn more
                  </Link>
                </div>

                <div className="flex gap-3 mt-auto">
                  <div className="flex flex-col">
                    <p className="text-[#7A8699] text-xs">
                      Available respondents
                    </p>
                    <p className="text-[#00A912] text-xl font-bold">
                      {loadingSurveyStats ? (
                        <Skeleton className="h-6 w-16" />
                      ) : (
                        surveyStats?.remaining ?? 0
                      )}
                    </p>
                  </div>
                  <span className="w-[2px] h-[40px] bg-[#7A8699]">&nbsp;</span>
                  <div className="flex flex-col">
                    <p className="text-[#7A8699] text-xs">Used respondents</p>
                    <p className="text-[#FF9E4F] text-xl font-bold">
                      {loadingSurveyStats ? (
                        <Skeleton className="h-6 w-16" />
                      ) : (
                        surveyStats?.completed_responses ?? 0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "bg-[#FDFAFF] h-full w-full md:w-full relative overflow-hidden",
                {
                  "min-h-[150px]": !surveys?.purchases?.purchases?.length,
                }
              )}
            >
              <div className="max-h-[200px] pb-12">
                <div className="px-2.5 bg-[#CB85FD1A] flex items-center justify-between rounded-tr-[15px] rounded-tl-[15px] py-1.5">
                  <p className="font-bold">Survey</p>
                  <p className="font-bold">Respondents</p>
                </div>

                {loadingSurveys ? (
                  <Skeleton className="w-full h-full" />
                ) : !surveys?.purchases?.purchases?.length ? (
                  <div className="text-center text-sm text-gray-500 py-2 flex items-center justify-center w-full border h-[100px]">
                    You haven&apos;t purchased any respondents yet.
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex flex-col gap-2 px-2.5 py-1.5 transition-all duration-300",
                      showAllSurveys
                        ? "max-h-[400px] overflow-y-auto pb-64"
                        : "max-h-[180px] overflow-hidden"
                    )}
                  >
                    {surveys?.purchases?.purchases.map((purchase: Purchase) => (
                      <div
                        key={purchase?._id}
                        className="flex items-center justify-between text-sec-text"
                      >
                        <p className="text-sm">{purchase?.surveyName}</p>
                        <p className="text-sm">
                          {purchase?.numberOfRespondents}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {surveys?.purchases?.purchases.length > 4 && (
                <div className="text-center mt-2 absolute left-[40%] z-50 bottom-1.5 flex items-center justify-center">
                  <button
                    onClick={() => setShowAllSurveys((prev) => !prev)}
                    className="text-sm text-tertiary underline font-medium"
                  >
                    {showAllSurveys ? "View Less" : "View All"}
                  </button>
                </div>
              )}
              <div className="bg-gradient-to-t from-white to-transparent h-[58px] right-0 left-0 absolute bottom-0 w-full pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
