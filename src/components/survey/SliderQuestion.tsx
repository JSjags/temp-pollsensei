import { stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import { Check, CheckCircle, GripVertical } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Slider } from "../ui/slider";
import { RxSlider } from "react-icons/rx";
import ActionButtons from "./ActionButtons";
import { SurveyData } from "@/subpages/survey/EditSubmittedSurvey";
import { cn } from "@/lib/utils";

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
  surveyData?: SurveyData;
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
  status,
  is_required,
  setIsRequired,
  isEdit = false,
  surveyData,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const [sliderValue, setSliderValue] = useState<number>(value ?? min ?? 0);

  useEffect(() => {
    setSliderValue(value ?? min ?? 0);
  }, [min, value]);

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

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // Generate smart labels based on range size
  const generateSmartLabels = () => {
    const range = (max ?? 10) - (min ?? 0);
    let step;

    if (range <= 10) {
      step = 1;
    } else if (range <= 100) {
      step = Math.ceil(range / 5) * 5; // Round to nearest 5
    } else if (range <= 1000) {
      step = Math.ceil(range / 5) * 50; // Round to nearest 50
    } else if (range <= 10000) {
      step = Math.ceil(range / 5) * 500; // Round to nearest 500
    } else {
      step = Math.ceil(range / 5) * 5000; // Round to nearest 5000
    }

    const labels = [];
    // Always include min
    labels.push(min ?? 0);

    // Add intermediate points
    for (let i = (min ?? 0) + step; i < (max ?? 10); i += step) {
      labels.push(Math.round(i)); // Round to ensure clean numbers
    }

    // Add max if not already included
    if (labels[labels.length - 1] !== (max ?? 10)) {
      labels.push(max ?? 10);
    }

    return labels;
  };

  const sliderLabels = generateSmartLabels();

  return (
    <div
      key={index}
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
                      onSave={() =>
                        onSave && onSave(question, min ?? 0, max ?? 10, index)
                      }
                      index={index}
                    />
                  )}
                </div>
              </h3>

              <div className="mt-8 px-0">
                <Slider
                  value={[sliderValue]}
                  max={max ?? 10}
                  min={min ?? 0}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="w-full"
                />
                <div className="w-full mt-4 flex justify-between text-sm text-gray-600">
                  {sliderLabels.map((label, i) => (
                    <span key={i} className="text-center">
                      {formatNumber(label)}
                    </span>
                  ))}
                </div>
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
                    <RxSlider className="text-[#9D50BB] w-3 h-3" />
                    Slider
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

export default SliderQuestion;
