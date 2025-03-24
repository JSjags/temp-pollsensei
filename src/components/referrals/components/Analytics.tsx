"use client";
import {
  RedeemableCoins,
  RedeemableHowIcon,
  RedeemCoins,
  RedeemedCoins,
  ReferralIcon,
} from "@/assets/images";
import React, { useState } from "react";

import { Dialog } from "@/components/ui/new-dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Redeemable from "@/components/shop/components/dialogs/Redeemable";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Slider, { Settings } from "react-slick";

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
    <div className="w-full">
      <Header />

      <div className="w-full my-7 lg:hidden">
        <MobileSlider />
      </div>
      <div className="grid grid-cols-4 gap-4 w-full max-md:px-5 mt-6 max-md:hidden">
        {analyticData.map(({ label, icon, value }) => (
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
        ))}
      </div>

      <div className="w-full justify-end flex mt-4 max-md:hidden">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="gradient">Redeem coins</Button>
          </Dialog.Trigger>
          <Dialog.Content className="z-[100000000000] max-w-[442px] w-full max-[440px]:max-h-[85%]">
            <Redeemable />
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  );
}

function MobileSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dotsClass: "flex items-center justify-center",
    appendDots: (dots) => (
      <div className="!static !flex !items-center !justify-center">
        <ul className="slick-dots w-full !flex gap-1 items-center justify-center">
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={cn(
          "p-2 border-[3.43px] border-transparent transition-all duration-300 ease-in-out size-16 rounded-full flex items-center justify-center",
          {
            "scale-110": i === currentSlide,
          }
        )}
      >
        {/* <div
          className={cn("flex w-2 h-1 relative rounded-full bg-[#E0C8EA]", {
            "w-[30px] bg-[#9D50BB]": i === currentSlide,
          })}
        /> */}
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
      </div>
    ),
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
  };

  return (
    <Slider {...settings}>
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
    </Slider>
  );
}
