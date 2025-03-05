import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { draggable, stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Check, GripVertical, Star } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

interface StarRatingQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  scale_value?: number | string;
  onRate?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index?: number;
  canUseAI?: boolean;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
  question,
  options = ["1_star", "2_stars", "3_stars", "4_stars", "5_stars"],
  questionType,
  scale_value = 0,
  onRate,
  EditQuestion,
  DeleteQuestion,
  index,
  setEditId,
  onSave,
  canUseAI = false,
  status,
  is_required,
  setIsRequired,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  // Convert string scale_value (e.g. "4_stars") to number
  const getNumericRating = (value: number | string) => {
    if (typeof value === "string") {
      return parseInt(value[0]);
    }
    return value;
  };

  const rating = getNumericRating(scale_value);

  console.log(rating);

  const getStatus = useMemo(() => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1 transition-all duration-200 hover:bg-green-600">
            <Check
              strokeWidth={1.5}
              className="w-4 h-4 text-white"
              aria-label="Passed validation"
            />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1 transition-all duration-200 hover:bg-red-600">
            <BsExclamation
              className="w-4 h-4 text-white"
              aria-label="Failed validation"
            />
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-500 rounded-full p-1 transition-all duration-200 hover:bg-yellow-600">
            <span
              className="block w-4 h-4 animate-pulse"
              aria-label="Validation pending"
            />
          </div>
        );
      default:
        return null;
    }
  }, [status]);

  return (
    <div
      className={cn(
        "mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300",

        {
          [`font-${questionText?.name
            ?.split(" ")
            .join("-")
            .toLowerCase()
            .replace(/\s+/g, "-")}`]: questionText?.name,
        }
      )}
      style={{
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="flex gap-4">
        <GripVertical
          className={`w-5 h-5 text-gray-400 mt-1 ${
            pathname === "/surveys/create-survey" ? "visible" : "hidden"
          }`}
        />
        <div className="flex-1 space-y-4">
          <div className="flex items-start">
            <span className="font-semibold min-w-[24px]">{index}.</span>
            <div className="flex-1">
              <h3 className="group font-semibold">
                <div className="flex items-start gap-2">
                  <span className="text-left">{question}</span>
                  {is_required && (
                    <span className="text-2xl text-red-500">*</span>
                  )}
                </div>
              </h3>
            </div>
          </div>

          <div className="flex items-center my-2">
            {options.map((_, idx) => (
              <FaStar
                key={idx}
                size={24}
                className={`mr-1 cursor-not-allowed ${
                  idx < rating ? "text-[#5B03B250]" : "text-gray-300"
                }`}
                aria-label={`${idx + 1} stars`}
              />
            ))}
          </div>

          {pathname === "/surveys/edit-survey" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Required</span>
                <Switch
                  checked={is_required}
                  onCheckedChange={
                    setIsRequired && ((checked) => setIsRequired(checked))
                  }
                  className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] scale-90"
                />
              </div>
            </div>
          )}
        </div>
        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus}</div>
        )}
      </div>
      <div className="flex justify-end">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs">
            <Star className="text-[#9D50BB] w-3 h-3" />
            Star Rating
          </span>
        </p>
      </div>
    </div>
  );
};

export default StarRatingQuestion;
