/* 
UI Design Explanation:
---------------------
The rating scale question uses a horizontal row of circular radio buttons with numbers/labels below.
This design was chosen because:

1. It visually represents a linear scale from low to high
2. The circular radio buttons are intuitive for single-selection
3. Numbers/labels below provide clear meaning for each point on the scale

Visual representation:

[Question Text]

  O     O     O     O     O     O     O
  1     2     3     4     5     6     7
Poor   Fair  Good  Very  Exc.  Out.  Perfect
                  Good

The StarHalf icon was chosen to represent rating scales since it's a universally recognized 
symbol for ratings/scoring systems.
*/

import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, Star, StarHalf } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"; // Using radio instead of checkbox for single selection

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
      <div className="flex items-center gap-3">
        {pathname === "/surveys/create-survey" && (
          <Image src={draggable} alt="draggable icon" />
        )}
        <div className="w-full">
          <div className="flex justify-between w-full items-center">
            <h3 className="text-lg font-semibold text-start">
              <div className="group flex justify-between gap-2 items-start">
                <p>
                  <span>{index}. </span> {question}
                  {is_required === true && (
                    <span className="text-2xl ml-2 text-red-500">*</span>
                  )}
                </p>
                {!pathname.includes("survey-public-response") &&
                  !pathname.includes("create-survey") && (
                    <PollsenseiTriggerButton
                      key={index}
                      imageUrl={stars}
                      tooltipText="Rephrase question"
                      className={"group-hover:inline-block hidden"}
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
          </div>

          {/* Rating Scale UI using RadioGroup for single selection */}
          <RadioGroup
            value={selectedRating}
            onValueChange={handleRatingChange}
            className="flex items-center justify-between gap-2 my-4 w-full"
          >
            {options?.map((option, optionIndex) => (
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

          {/* Edit and Delete Buttons */}
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
