import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { Check, GripVertical, BarChart2 } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

interface LikertScaleQuestionProps {
  question: string;
  options: string[];
  questionType?: string;
  scale_value?: string[]; // User's response
  index?: number;
  status?: string;
}

const LikertScaleQuestion: React.FC<LikertScaleQuestionProps> = ({
  question,
  questionType,
  options = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree",
  ],
  scale_value,
  index,
  status,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const getStatus = (status: string) => {
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
                </div>
              </h3>
            </div>
          </div>

          <RadioGroup
            defaultValue={scale_value as any}
            className="flex justify-between gap-5 my-4"
            disabled
          >
            {options?.map((option, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <RadioGroupItem
                  value={option}
                  id={`likert-${idx}`}
                  className="text-[#5B03B2]"
                />
                <Label htmlFor={`likert-${idx}`} className="">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs">
            <BarChart2 className="text-[#9D50BB] w-3 h-3" />
            Likert Scale
          </span>
        </p>
      </div>
    </div>
  );
};

export default LikertScaleQuestion;
