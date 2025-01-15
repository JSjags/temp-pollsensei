import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { draggable, stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Check, GripVertical } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface StarRatingQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  currentRating?: number;
  onRate?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index?: number;
  canUseAI?: boolean;
  status?: string;
  is_required?: boolean;
  isEdit?: boolean;
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
  options = ["1 star", "2 star", "3 star", "4 star", "5 star"],
  questionType,
  currentRating = 0,
  onRate,
  EditQuestion,
  DeleteQuestion,
  index,
  setEditId,
  onSave,
  canUseAI = false,
  status,
  is_required,
  isEdit = false,
  setIsRequired,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(currentRating);

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    if (onRate) onRate(rating);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1.5 mr-3">
            <Check strokeWidth={1.5} className="text-white w-4 h-4" />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1.5 mr-3">
            <BsExclamation className="text-white w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300"
      style={{
        fontFamily: questionText?.name,
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="flex gap-4">
        <GripVertical
          className={`w-5 h-5 text-gray-400 mt-1 ${
            pathname === "/surveys/create-survey" ? "visible" : "invisible"
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

                  {!pathname.includes("survey-public-response") && isEdit && (
                    <PollsenseiTriggerButton
                      key={index}
                      imageUrl={stars}
                      tooltipText="Rephrase question"
                      className="hidden group-hover:inline-block transition transform hover:scale-110"
                      triggerType="rephrase"
                      question={question}
                      optionType={questionType}
                      options={options}
                      setEditId={setEditId}
                      onSave={onSave!}
                      index={index!}
                    />
                  )}
                </div>
              </h3>

              <div className="flex items-center gap-2 mt-4">
                {options.map((_, idx) => (
                  <FaStar
                    key={idx}
                    size={24}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      (hoveredRating !== null
                        ? hoveredRating
                        : selectedRating) > idx
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                    onMouseEnter={() => setHoveredRating(idx + 1)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => handleRate(idx + 1)}
                  />
                ))}
                {/* <span className="ml-2 text-sm text-gray-600">
                  {hoveredRating || selectedRating || 0} out of {options.length}{" "}
                  stars
                </span> */}
              </div>
            </div>
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey")) && (
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                onClick={EditQuestion}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname.includes("edit-survey") && (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={
                  setIsRequired
                    ? (checked: boolean) => setIsRequired(checked)
                    : undefined
                }
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              />
            </div>
          )}

          <div className="flex justify-end">
            {!pathname.includes("edit-survey") &&
              !pathname.includes("surveys/question") && (
                <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
                  {questionType === "star_rating" && (
                    <span className="flex items-center gap-1 text-xs">
                      <FaStar className="text-[#9D50BB]" />
                      Star Rating
                    </span>
                  )}
                </p>
              )}
          </div>
        </div>

        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>
    </div>
  );
};

export default StarRatingQuestion;
