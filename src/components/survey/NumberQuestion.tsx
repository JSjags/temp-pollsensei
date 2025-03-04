/*
UI/UX Design Comments:

The number input will look like:

+-------------------------------------------+
|  [Grip]                                   |  <- Drag handle (visible on create)
|    |                                      |
|    1. What is your preferred rating? *    |  <- Question with required asterisk
|    [AI Rephrase Button - Shows on hover]  |  <- AI assist button
|                                           |
|    +-----------------------------------+  |
|    |  Enter a number (0-10)            |  |  <- Number input field
|    +-----------------------------------+  |
|                                           |
|    [Error: Please enter valid number]     |  <- Validation message
|                                           |
|    [Edit] [Delete]                        |  <- Action buttons
|                                           |
|    Required [Switch]                      |  <- Required toggle
|                                           |
|    [Number Question Badge]                |  <- Question type indicator
+-------------------------------------------+

Key Design Decisions:
1. Consistent layout with other question types
2. Drag handle for reordering on create survey
3. AI rephrase button shows on hover
4. Clear validation feedback
5. Matches shadcn/ui design system
*/

import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import { Check, Hash, GripVertical } from "lucide-react";
import { Switch } from "../ui/switch";
import { Input } from "../ui/shadcn-input";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import ActionButtons from "./ActionButtons";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";
import { cn } from "@/lib/utils";

interface NumberQuestionProps {
  question: string;
  response?: string;
  questionType: string;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  min?: number;
  max?: number;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  isEdit?: boolean;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
  surveyData?: SurveyData;
}

const NumberQuestion: React.FC<NumberQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  min,
  max,
  options,
  onChange,
  status,
  is_required,
  setIsRequired,
  onSave,
  setEditId,
  isEdit = false,
  surveyData,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [error, setError] = useState<string>("");
  const [value, setValue] = useState(response || "");

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input, numbers, decimals, and negative signs
    if (inputValue === "" || /^-?\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
      setError("");

      const numValue = parseFloat(inputValue);
      if (min !== undefined && max !== undefined) {
        if (numValue < min || numValue > max) {
          setError(`Please enter a number between ${min} and ${max}`);
        }
      }

      if (onChange) {
        onChange(inputValue);
      }
    } else {
      setError("Please enter a valid number");
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
                <Input
                  type="text"
                  className="w-full"
                  placeholder={
                    min !== undefined && max !== undefined
                      ? `Enter a number between ${min} and ${max}`
                      : "Enter a number"
                  }
                  value={value}
                  onChange={handleNumberChange}
                  required={is_required}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            </div>
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey") ||
            pathname.includes("/edit-draft-survey")) && (
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

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey") ||
            pathname.includes("/edit-draft-survey")) && (
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
                    <Hash className="text-[#9D50BB] w-3 h-3" />
                    Number
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

export default NumberQuestion;
