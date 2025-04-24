"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Coin from "@/assets/images/Coin.png";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHasNextVideo,
  selectLastResetTime,
  forceResetAds,
  setLastResetTime,
} from "@/redux/slices/earnDialogSlice";

interface Props {
  title: string;
  desktopDescription: string;
  mobileDescription: string;
  image: StaticImageData;
  buttonText: string;
  coins: number;
  onClick?: () => void;
}

const ActivityCard: FC<Props> = ({
  title,
  desktopDescription,
  mobileDescription,
  image,
  buttonText,
  coins,
  onClick,
}) => {
  const hasNextVideo = useSelector(selectHasNextVideo);
  const lastResetTime = useSelector(selectLastResetTime);
  const dispatch = useDispatch();
  const [timeUntilReset, setTimeUntilReset] = useState<number | null>(null);
  const [isCooldownComplete, setIsCooldownComplete] = useState(false);

  useEffect(() => {
    if (!lastResetTime) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const oneMinute = 60 * 1000;
      const timePassed = now - lastResetTime;
      const timeLeft = Math.max(0, oneMinute - timePassed);

      setTimeUntilReset(timeLeft);

      // Prevent multiple resets by ensuring state change only happens once
      if (timeLeft <= 0 && !isCooldownComplete) {
        setIsCooldownComplete(true);
        dispatch(forceResetAds());
      }
    };

    calculateTimeLeft();

    // Run interval only if cooldown is still active
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [lastResetTime, dispatch, isCooldownComplete]);

  // Reset cooldown state when new ads become available
  useEffect(() => {
    if (hasNextVideo) {
      setIsCooldownComplete(false);
    }
  }, [hasNextVideo]);

  const renderButtonContent = () => {
    return (
      <>
        <div className="hidden lg:flex items-center justify-center w-full">
          {buttonText}
          (<Image src={Coin} width={20} height={20} alt="Coin" /> +{coins})
        </div>
        <div className="flex items-center justify-center w-full lg:hidden">
          {buttonText.includes("Subscribe")
            ? buttonText.slice(0, 9)
            : buttonText}
          (<Image src={Coin} width={10} height={10} alt="Coin" /> +{coins})
        </div>
      </>
    );
  };

  return (
    <div className="bg-white h-auto lg:h-[350px] w-full flex flex-col gap-3 p-3 rounded-xl hover:scale-105 transition-all justify-between">
      <div className="w-full flex flex-col gap-3">
        <h3 className="text-sm text-[#5B03B2] font-bold">{title}</h3>
        <div className="w-full h-auto flex flex-col gap-2">
          <p className="text-[#524D4D] text-xs hidden lg:block">
            {desktopDescription}
          </p>
          <p className="text-[#524D4D] text-[10px] block lg:hidden">
            {mobileDescription}
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div className="relative h-[150px] w-full hidden lg:block">
          <Image
            src={image}
            alt="Activity image"
            fill
            className="object-cover"
          />
        </div>

        <Image
          src={image}
          width={300}
          height={150}
          alt="Activity image"
          className="object-cover lg:hidden"
        />

        <Button
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] text-[9px] lg:text-xs font-bold text-white"
          type="button"
          onClick={onClick}
        >
          {renderButtonContent()}
        </Button>
      </div>
    </div>
  );
};
export default ActivityCard;
