/* 
Rating Scale Question Component Design Explanation:
------------------------------------------------
This component creates a rating scale question format where users can select one rating
from a horizontal scale. The design follows the same pattern as other question types,
with consistent styling and behavior.

Visual representation:

[Component Container - Gray bg, rounded corners, shadow on hover]
┌──────────────────────────────────────────────────────────────┐
│ ⋮ [Grip Handle - Only visible in create mode]                │
│                                                              │
│ 1. Question Text Here (Rate from 1-5)                     *  │
│    [AI Rephrase Button - Shows on hover]                     │
│                                                              │
│    [Rating Scale - Horizontal radio buttons with labels]     │
│    ┌──────────────────────────────────────────────────────┐  │
│    │   ○         ○         ○         ○         ○          │  │
│    │   1         2         3         4         5          │  │
│    │  Poor     Fair     Good    Very Good  Excellent      │  │
│    └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

Key Features:
- Dynamic rating scale based on question text or provided options
- Extracts rating range from question text (e.g. "Rate from 1-5")
- Falls back to default options if no range specified
*/

import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, Star, StarHalf, GripVertical } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import ActionButtons from "./ActionButtons";

interface RatingScaleQuestionProps {
  question: string;
  questionType: string;
  options: string[] | undefined;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
  index: number;
  canUseAI?: boolean;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  isEdit?: boolean;
}

const RatingScaleQuestion: React.FC<RatingScaleQuestionProps> = ({
  question,
  options,
  questionType,
  EditQuestion,
  DeleteQuestion,
  setEditId,
  index,
  onChange,
  onSave,
  canUseAI = false,
  status,
  is_required,
  setIsRequired,
  isEdit = false,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [selectedRating, setSelectedRating] = useState<string>("");
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);

  // Extract range from question text
  const extractRange = (question: string) => {
    const numberWords: { [key: string]: number } = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };

    let processedQuestion = question.toLowerCase();
    Object.entries(numberWords).forEach(([word, num]) => {
      processedQuestion = processedQuestion.replace(
        new RegExp(word, "g"),
        num.toString()
      );
    });

    const patterns = [
      /(\d+)\s*-\s*(\d+)/,
      /(\d+)\s*to\s*(\d+)/,
      /rate.*?(\d+).*?to.*?(\d+)/i,
      /scale.*?(\d+).*?to.*?(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = processedQuestion.match(pattern);
      if (match) {
        const [_, start, end] = match;
        return {
          min: parseInt(start),
          max: parseInt(end),
        };
      }
    }

    return null;
  };

  // Generate default labels for a rating scale
  const generateRatingLabels = (min: number, max: number) => {
    const defaultLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    const range = max - min + 1;

    if (range <= defaultLabels.length) {
      return defaultLabels.slice(0, range);
    }

    return Array.from({ length: range }, (_, i) => (i + min).toString());
  };

  useEffect(() => {
    const range = extractRange(question);
    if (range) {
      const { min, max } = range;
      const labels = generateRatingLabels(min, max);
      setDynamicOptions(labels);
    } else if (options && options.length > 0) {
      setDynamicOptions(options);
    } else {
      // Default 5-point scale if no range or options provided
      setDynamicOptions(generateRatingLabels(1, 5));
    }
  }, [question, options]);

  const handleRatingChange = (value: string) => {
    setSelectedRating(value);
    if (onChange) {
      onChange(value);
    }
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
                      index={index}
                    />
                  )}
                </div>
              </h3>

              <div className="mt-4">
                <RadioGroup
                  value={selectedRating}
                  onValueChange={handleRatingChange}
                  className="flex items-center justify-between gap-2 w-full"
                >
                  {dynamicOptions.map((option, optionIndex) => (
                    <div
                      className="flex flex-col justify-center items-center gap-2"
                      key={optionIndex}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`rating-${optionIndex}`}
                        className="h-6 w-6 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={`rating-${optionIndex}`}
                        className="text-sm text-gray-600"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey")) && (
            <ActionButtons onDelete={DeleteQuestion} onEdit={EditQuestion} />
          )}

          {pathname === "/surveys/add-question-m" && (
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname.includes("edit-survey") && (
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
          )}

          <div className="flex justify-end">
            {!pathname.includes("edit-survey") &&
              !pathname.includes("surveys/question") && (
                <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
                  <span className="flex items-center gap-1 text-xs">
                    <StarHalf className="text-[#9D50BB] w-3 h-3" />
                    Rating Scale
                  </span>
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

export default RatingScaleQuestion;
