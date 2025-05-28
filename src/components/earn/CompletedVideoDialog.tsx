"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import congrats from "@/assets/images/congrats.svg";
import Coin from "@/assets/images/Coin.png";
import logoGold from "@/assets/images/logo-gold.png";
import { Button } from "@/components/ui/button";
import { FaVideo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectHasNextVideo } from "@/redux/slices/earnDialogSlice";
import Modal from "@/components/reusable/Modal";

interface CompletedVideoDialogProps {
  openCompletedVideo: boolean;
  onOpenCompletedVideoChange: (open: boolean) => void;
  onWatchNext: () => void;
  currentVideoIndex: number;
  reward: number;
  videos: any;
  handleContinueExit: () => void;
}

const CompletedVideoDialog: FC<CompletedVideoDialogProps> = ({
  openCompletedVideo,
  onOpenCompletedVideoChange,
  onWatchNext,
  currentVideoIndex,
  reward,
  videos,
  handleContinueExit,
}) => {
  const hasNextVideo = useSelector(selectHasNextVideo);

  return (
    <>
      {openCompletedVideo && (
        <Modal className="w-[90%] md:max-w-[425px] min-h-auto border-0 outline-none px-5 lg:px-10 py-5 z-[1000000] flex flex-col justify-center items-center gap-5">
          <Image src={congrats} width={250} height={250} alt="congrats" />
          <div className="flex flex-col gap-3 items-center justify-center">
            <h1 className="text-base lg:text-[28px] font-bold text-center text-[#333333]">
              Congratulations!
            </h1>
            <div className="flex items-center gap-1">
              <Image
                src={logoGold}
                width={20}
                height={20}
                alt="Stacked Coins"
              />
              <p className="text-[40px] text-[#5B03B2] font-bold">+{reward}</p>
            </div>
            <p className="text-sm lg:text-base text-[#898989] text-center">
              You have been rewarded with Pollcoins by completing the task
            </p>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-xs font-bold text-center rounded-lg capitalize hover:scale-105 transition-all"
              type="button"
              onClick={onWatchNext}
              disabled={currentVideoIndex >= videos.length - 1}
            >
              {currentVideoIndex >= videos.length - 1 ? (
                "No more Ads"
              ) : (
                <div className="flex items-center gap-2">
                  <FaVideo className="text-white text-lg" />
                  Watch Next Ad (
                  <Image
                    src={Coin}
                    width={15}
                    height={15}
                    alt="Stacked Coins"
                  />{" "}
                  +{videos[currentVideoIndex + 1]?.reward || 0})
                </div>
              )}
            </Button>
          </div>
          <p
            className="text-base text-[#6A06CD] cursor-pointer underline"
            onClick={handleContinueExit}
          >
            Back
          </p>
          <p className="text-[#6A6A6A] text-sm">
            You have watched{" "}
            <span className="text-[#5B03B2] font-bold">
              {currentVideoIndex + 1}/{videos.length} Ads today
            </span>
          </p>
        </Modal>
      )}
    </>
  );
};
export default CompletedVideoDialog;
