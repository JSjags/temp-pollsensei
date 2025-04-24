"use client";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { pollsensei_icon } from "@/assets/images";
import { useDispatch } from "react-redux";
import {
  openSurveyFormDialog,
  closeSurveyTabs,
} from "@/redux/slices/earnDialogSlice";

interface Props {
  title: string;
  description: string;
  image: string;
  poll_coins: number;
  time: number;
  isComplete?: boolean;
  isApplied?: boolean;
  isApproved?: boolean;
}

const SurveyCard: FC<Props> = ({
  title,
  description,
  image,
  poll_coins,
  time,
  isComplete,
  isApplied,
  isApproved,
}) => {
  const dispatch = useDispatch();

  const handleStartNow = () => {
    if (!isComplete && !isApproved && !isApplied) {
      dispatch(closeSurveyTabs());
      dispatch(openSurveyFormDialog());
    }
  };

  const getStatusText = () => {
    if (isComplete || isApproved) return "Completed";
    if (isApplied) return "Applied";
    return "Not Started";
  };

  const getStatusStyle = () => {
    if (isComplete || isApproved || isApplied) {
      return "bg-[#E3FEF3] text-[#05BF43]";
    }
    return "bg-[#FEE3F2] text-[#BF0558]";
  };

  const getButtonText = () => {
    if (isComplete || isApproved) return "Completed";
    if (isApplied) return "Applied";
    return "Start Now";
  };

  const getButtonStyle = () => {
    if (isComplete || isApproved || isApplied) {
      return "bg-[#C7C7C7] hover:bg-[#C7C7C7] cursor-not-allowed text-[#79737E]";
    }
    return "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] cursor-pointer text-white";
  };

  return (
    <div className="bg-white h-auto w-full flex flex-col gap-1 lg:gap-3 rounded-2xl hover:scale-105 transition-all justify-between">
      <div className="relative h-[100px] lg:h-[150px] w-full border-b-2 border-[#08CE26] rounded-t-2xl">
        <Image
          src={image}
          alt="Activity image"
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>
      <div className="w-full h-auto flex flex-col gap-2 p-2">
        <div
          className={`${getStatusStyle()} rounded-full p-3 py-1 w-fit text-[8px] lg:text-[10px] block capitalize`}
        >
          {getStatusText()}
        </div>
        <h3 className="text-[9px] lg:text-xs text-[#1C1C1C] font-bold">
          {title.length > 30 ? `${title.slice(0, 30)}...` : title}
        </h3>
        <p className="text-[#AAAAAA] text-[10px]">
          {description.length > 40
            ? `${description.slice(0, 40)}...`
            : description}
        </p>
        <div className="w-full h-auto flex items-center gap-2">
          <div className="bg-[#E5ECF680] text-[#333333] text-[8px] lg:text-[10px] rounded-full py-1 px-3 flex items-center gap-1">
            <Image
              src={pollsensei_icon}
              width={10}
              height={10}
              alt="pollsensei_icon"
            />
            {poll_coins}pollcoins
          </div>
          <div className="bg-[#E5ECF680] text-[#333333] text-[8px] lg:text-[10px] rounded-full py-1 px-2 block">
            {time}minutes
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        className={`${getButtonStyle()} text-xs font-bold text-center rounded-none rounded-b-2xl capitalize`}
        type="button"
        onClick={handleStartNow}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};
export default SurveyCard;
