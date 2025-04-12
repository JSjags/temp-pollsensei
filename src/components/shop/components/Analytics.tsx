import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  PayoutInfoIcon,
  RespondentIcon,
  Voice,
  WalletIcon,
} from "@/assets/images";
import Link from "next/link";
import Image from "next/image";
import BuyDialog from "./dialogs/BuyPollcoins";
import { usePayoutStore } from "@/components/payouts/store/usePayoutStore";
import { PayoutDialog } from "@/components/payouts/components/dialogs";
import { useShopStore } from "../store/useShopStore";
import { useUserBalance } from "../queries/useBalance";
import { Skeleton } from "@/components/ui/skeleton";
import Slider, { Settings } from "react-slick";
import { motion } from "framer-motion";
import BuyPollcoinsFlow from "./dialogs/BuyPollcoins";
import BuyAICredit from "./dialogs/BuyAICredits";

export function Analytics() {
  const [showAllSurveys, setShowAllSurveys] = useState(false);
  const { data, isLoading: balanceLoading } = useUserBalance();
  const { restrictedBalance, unrestrictedBalance, totalBalance } = data || {};
  const { totalPollcoins } = useShopStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const analyticData = [
    {
      label: "AI Survey Generation",
      value: 0,
      icon: AIGeneration,
      iconColor: "#3575FF",
    },
    {
      label: "OCR Document Scan",
      value: 0,
      icon: OCR,
      iconColor: "#F36643",
    },
    {
      label: "AI Analysis",
      value: 0,
      icon: Analysis,
      iconColor: "#4524F8",
    },
    {
      label: "AI Reporting",
      value: 0,
      icon: AIReporting,
      iconColor: "#0ACF80",
    },
    {
      label: "Voice Transcription",
      value: 0,
      icon: Voice,
      iconColor: "#0ACF80",
    },
  ];

  const coinsData = [
    {
      label: "Available Pollcoins",
      value: parseInt(totalPollcoins) || 0,
      icon: AvailableIcon,
      iconColor: "#DDC6EE",
      bgColor: "#51059D",
    },
    {
      label: "Redeemable Pollcoins",
      value: restrictedBalance,
      icon: MoneyIcon,
      iconColor: "#D1EAFA",
      bgColor: "#0A3F60",
    },
    {
      label: "Non-Redeemable Pollcoins",
      value: unrestrictedBalance,
      icon: NonRedeemable,
      iconColor: "#D1D3FA",
      bgColor: "#0A0E60",
    },
  ];
  const surveys = [
    {
      title: "Client Satisfaction Questionnaire",
      value: 500,
    },
    {
      title: "Product Review Survey",
      value: 200,
    },
    {
      title: "Payment Processing Survey",
      value: 300,
    },
    {
      title: "Service Quality Review",
      value: 500,
    },
    {
      title: "Service Quality Review",
      value: 500,
    },
    {
      title: "Service Quality Review",
      value: 500,
    },
  ];

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
    <div className="w-full">
      {/*desktop Banner */}
      <div className="bg-gradient-to-br w-full from-[#9D50BB] max-md:flex-col via-[#5B03B2] max-md:w-full text-white to-[#260D3E] px-4 py-6 max-md:pb-0 md:rounded-[6.8px] relative flex md:items-center justify-between">
        <div className="md:w-1/3">
          <p>Welcome to the</p>
          <h3 className="text-3xl max-md:text-2xl font-bold">Sensei Shop</h3>
        </div>
        <div className="flex max-md:items-center max-md:justify-center w-full max-md:pt-6">
          <div className="rounded-tr-[27px] rounded-tl-[27px] flex max-md:items-center max-md:flex-col max-md:justify-center justify-between w-full gap-[11px] max-md:bg-white/10 md:px-[18px] px-10 pt-[14px] max-md:max-w-[317px] max-md:pb-8">
            <p className="text-[0.8125rem] md:max-w-[547px] max-md:text-center">
              Purchase Pollcoins with cash which is used for in-app purchases
              such as such as buying of respondents, and credit for AI-aided
              features such as Survey generation, Survey Reporting, Voice
              Transcription, Survey Analysis and OCR Document scanning.
            </p>
            <BuyPollcoinsFlow>
              <Button
                variant={"gradient"}
                className="min-w-[131px] h-[51px] max-md:h-11 max-md:w-full font-bold gap-1 py-[7px] max-md:mt-6 z-40"
              >
                Buy Pollcoins
                <Image src={Arrow} alt="icons" className="size-5" />
              </Button>
            </BuyPollcoinsFlow>
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <Image src={Coins} alt="icons" />
        </div>
      </div>



      <div className="w-full flex gap-4 my-[22px] h-full items-stretch max-sm:flex-col max-md:px-4">
        <div className="flex-1 flex flex-col gap-4 h-full items-stretch min-h-[200px]">
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-4">
            {coinsData.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-lg p-4 text-white h-full max-md:col-span-2 max-md:order-2", // default mobile styles
                  {
                    "max-md:col-span-4 max-md:order-1": index === 1, // move second item to first on mobile
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
                      <h4 className="text-xl font-bold">{item.value}</h4>
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
                      <Button variant="gradient" className="h-[29px]">
                        Redeem coins
                      </Button>
                    </PayoutDialog>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="gap-4 w-full grid grid-cols-5 h-full max-md:hidden">
            {analyticData.map((analytic) => (
              <div
                key={analytic.label}
                className="bg-white rounded-[6.8px] p-4 shadow-[0px_1.36px_4.08px_0px_#34037914]"
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
                        <h4 className="text-xl font-bold">{analytic.value}</h4>
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
              {analyticData.map((analytic, index) => (
                <div
                  key={analytic.label}
                  className={cn(
                    "bg-white rounded-[6.8px] p-4 shadow-[0px_1.36px_4.08px_0px_#34037914]",
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
                          <h4 className="text-xl font-bold">
                            {analytic.value}
                          </h4>
                          <span>
                            <Image src={InfoIcon} alt="icons" />
                          </span>
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
        <div className="w-[35%] max-sm:w-full rounded-lg pt-4 px-5 relative bg-white shadow-[0px_1.36px_4px_0px_#34037914] flex flex-col gap-5 h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground">
                Total Purchased Respondents
              </p>
              <h4 className="text-xl font-bold">0</h4>
            </div>
            <div
              className={cn(
                "size-[34px] rounded-[6.8px] flex items-center justify-center bg-[#4524F8]/10"
              )}
            >
              <Image src={RespondentIcon} alt="icons" />
            </div>
          </div>
          <div className="flex justify-end w-full">
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
          </div>

          <div className="bg-[#FDFAFF] max-h-[140px] overflow-y-auto">
            <div className="px-2.5 bg-[#CB85FD1A] flex items-center justify-between rounded-tr-[15px] rounded-tl-[15px] py-1.5">
              <p className="font-bold">Survey</p>
              <p className="font-bold">Respondents</p>
            </div>

            <div
              className={cn(
                "flex flex-col gap-2 px-2.5 py-1.5 transition-all duration-300",
                showAllSurveys
                  ? "max-h-[300px] overflow-y-auto"
                  : "max-h-[150px] overflow-hidden"
              )}
            >
              {surveys.map((survey) => (
                <div
                  key={survey.title}
                  className="flex items-center justify-between text-sec-text"
                >
                  <p className="text-sm">{survey.title}</p>
                  <p className="text-sm">{survey.value}</p>
                </div>
              ))}
            </div>

            {surveys.length > 4 && (
              <div className="text-center mt-2 absolute left-[45%] z-30 bottom-1.5 flex items-center justify-center">
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
  );
}

// function MobileSlider({
//   analyticData,
// }: {
//   analyticData: ReturnType<typeof getAnalyticData>;
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const settings: Settings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     dotsClass: "flex items-center justify-center",
//     appendDots: (dots) => (
//       <div className="!static !flex !items-center !justify-center">
//         <ul className="slick-dots w-full !flex gap-1 items-center justify-center">
//           {dots}
//         </ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <motion.div
//         layout
//         transition={{
//           type: "spring",
//           stiffness: 300,
//           damping: 30,
//         }}
//         className="h-1 rounded-full"
//         style={{
//           backgroundColor: i === currentSlide ? "#9D50BB" : "#E0C8EA",
//           width: i === currentSlide ? 30 : 8,
//         }}
//       />
//     ),
//     beforeChange: (current, next) => {
//       setCurrentSlide(next);
//     },
//   };

//   return (
//     <Slider {...settings}>
//       {analyticData.map(({ label, icon, value }) => (
//         <div
//           key={label}
//           className="bg-white rounded-[6.8px] p-5 shadow-[0px_1.36px_4.08px_0px_#34037914]"
//         >
//           <div className="h-full flex flex-col justify-between">
//             <div className="flex items-start justify-between">
//               <div className="flex flex-col gap-1.5">
//                 <p className="text-xs text-muted-foreground">{label}</p>
//                 <h4 className="text-xl font-bold">{value}</h4>
//               </div>
//               <div className="size-12 flex items-center justify-center">
//                 <Image src={icon} alt="icons" />
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </Slider>
//   );
// }
