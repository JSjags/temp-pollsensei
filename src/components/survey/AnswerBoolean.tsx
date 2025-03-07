import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BsExclamation } from "react-icons/bs";
import { BookLock, Check, GripVertical, ToggleLeft } from "lucide-react";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

interface BooleanQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  boolean_value?: boolean;
  onChange?: (value: boolean) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  status?: string;
}

const BooleanQuestion: React.FC<BooleanQuestionProps> = ({
  question,
  options = ["Yes", "No"],
  questionType,
  boolean_value = null,
  EditQuestion,
  DeleteQuestion,
  index,
  onChange,
  is_required,
  setIsRequired,
  status,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [selectedValue, setSelectedValue] = useState<boolean | null>(
    boolean_value
  );

  useEffect(() => {
    setSelectedValue(boolean_value);
  }, [boolean_value]);

  const handleOptionChange = (value: string) => {
    const boolValue =
      value.toLowerCase() === "yes" || value.toLowerCase() === "true";
    setSelectedValue(boolValue);
    if (onChange) {
      onChange(boolValue);
    }
  };

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

  const getRadioValue = () => {
    if (boolean_value === null) return undefined;
    if (options[0] === "Yes") {
      return boolean_value ? "Yes" : "No";
    }
    return boolean_value ? "True" : "False";
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
                </div>
              </h3>
            </div>
          </div>
          <RadioGroup className="flex gap-6" value={getRadioValue()} disabled>
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={option}
                  disabled
                  className="opacity-50"
                />
                <label
                  htmlFor={option}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
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
            <ToggleLeft className="text-[#9D50BB] w-3 h-3" />
            Boolean
          </span>
        </p>
      </div>
    </div>
  );
};

export default BooleanQuestion;
