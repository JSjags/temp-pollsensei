/*
UI/UX Design Comments:

The number input will look like:

+-------------------------------------------+
|  1. What is your preferred rating? *       |  <- Question header with required asterisk
|  [Icon: HashIcon]                         |  <- Number icon to indicate number input
|                                           |
|  +-----------------------------------+    |
|  |  Enter a number (0-10)            |    |  <- Input field with placeholder
|  +-----------------------------------+    |
|                                           |
|  [Error message if non-numeric input]     |  <- Validation feedback
|                                           |
|  [Edit] [Delete]  Required [Switch]       |  <- Action buttons & required toggle
+-------------------------------------------+

Key Design Decisions:
1. Using HashIcon to represent numeric input
2. Input validation for numbers only (integers/decimals)
3. Matching the shadcn/ui design system
4. Clear error messaging for invalid inputs
5. Consistent styling with other question types
*/

import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import { Check, Hash } from "lucide-react";
import { Switch } from "../ui/switch";
import { Input } from "../ui/shadcn-input";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

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
      className="mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300"
      style={{
        fontFamily: questionText?.name,
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="w-full">
        <div className="group flex justify-between gap-2 items-start">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold">
              <span>{index}. </span>
              {question}
              {is_required && (
                <span className="text-2xl ml-2 text-red-500">*</span>
              )}
            </h3>
          </div>

          {!pathname.includes("survey-public-response") && (
            <PollsenseiTriggerButton
              key={index}
              imageUrl={stars}
              tooltipText="Rephrase question"
              className="group-hover:inline-block hidden"
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

        {(pathname === "/surveys/edit-survey" ||
          pathname.includes("/edit-submitted-survey")) && (
          <div className="flex justify-end gap-3 mt-4">
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
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}

        {pathname.includes("edit-survey") && (
          <div className="flex items-center gap-3 mt-4">
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
      </div>

      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default NumberQuestion;
