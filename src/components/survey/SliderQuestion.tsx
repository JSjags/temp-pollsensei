/*
Design explanation:
- Added a slider icon (HiOutlineAdjustmentsHorizontal) to visually represent the question type
- Using shadcn/ui Slider component for a more polished look with better touch support
- Added hover effects and transitions for smoother interactions
- Improved spacing and alignment
- Added isEdit prop to control edit mode visibility
- Added tooltip for better UX

Visual representation:

[Slider Icon] Question Text *                    [AI Button]
|--------------------------------------------|
min    [=========O==========================] max
       0    1    2    3    4    5    6    7
[Edit] [Delete]  Required [Switch]
*/

import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";
import { Slider } from "@/components/ui/slider";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SliderQuestionProps {
  question: string;
  questionType: string;
  min?: number;
  max?: number;
  options?: string[];
  value?: number;
  onChange?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  onSave?: (
    updatedQuestion: string,
    updatedMin: number,
    updatedMax: number,
    aiEditIndex?: number
  ) => void;
  index: number;
  canUseAI?: boolean;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  isEdit?: boolean;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  options,
  min,
  max,
  value,
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

  const dynamicMin = options && options.length > 0 ? 0 : min || 0;
  const dynamicMax =
    options && options.length > 0 ? options.length - 1 : max || 5;
  const step =
    options && options.length > 1 ? 1 : (dynamicMax - dynamicMin) / 5;

  const [sliderValue, setSliderValue] = useState<number>(value || dynamicMin);

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue[0]);
    if (onChange) {
      onChange(newValue[0]);
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <div className="bg-green-500 rounded-full p-1 mr-3 transition-colors">
            <Check strokeWidth={1} className="text-xs text-white" />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full text-white p-2 mr-3 transition-colors">
            <BsExclamation />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center w-full p-6 gap-4 rounded-lg"
      style={{
        fontFamily: `${questionText?.name}`,
        fontSize: `${questionText?.size}px`,
      }}
    >
      {isEdit && (
        <Image
          src={draggable}
          alt="draggable icon"
          className="cursor-move hover:opacity-70 transition-opacity"
        />
      )}

      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HiOutlineAdjustmentsHorizontal className="w-6 h-6 text-[#5B03B2]" />
              </TooltipTrigger>
              <TooltipContent>Slider Question</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <h3 className="text-lg font-medium text-start flex-grow">
            <div className="group flex justify-between items-center">
              <p className="flex items-center gap-2">
                <span className="font-bold">{index}.</span> {question}
                {is_required && (
                  <span className="text-2xl text-red-500">*</span>
                )}
              </p>
              {canUseAI && !pathname.includes("survey-public-response") && (
                <PollsenseiTriggerButton
                  key={index}
                  imageUrl={stars}
                  tooltipText="Rephrase question"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  triggerType="rephrase"
                  question={question}
                  optionType={questionType}
                  options={options || []}
                  setEditId={setEditId}
                  onSave={() =>
                    onSave && onSave(question, dynamicMin, dynamicMax, index)
                  }
                  index={index}
                />
              )}
            </div>
          </h3>
        </div>

        <div className="space-y-6">
          <Slider
            value={[sliderValue]}
            min={dynamicMin}
            max={dynamicMax}
            step={step}
            onValueChange={handleSliderChange}
            className="w-full"
          />

          <div className="flex justify-between text-sm text-gray-600">
            {Array.from({ length: dynamicMax - dynamicMin + 1 }, (_, i) => (
              <span key={i} className="text-center">
                {options ? options[i] : dynamicMin + i}
              </span>
            ))}
          </div>
        </div>

        {isEdit && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={(checked) =>
                  setIsRequired && setIsRequired(checked)
                }
                className="bg-[#9D50BB]"
              />
            </div>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full transition-colors"
                onClick={EditQuestion}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 border border-red-500 rounded-full transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {status && <div>{getStatus(status)}</div>}
    </div>
  );
};

export default SliderQuestion;
