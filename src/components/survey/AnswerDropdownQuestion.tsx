import { draggable } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { BsExclamation } from "react-icons/bs";
import { Check, ChevronDown, CircleCheck, ListFilter } from "lucide-react";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DropdownQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  drop_down_value?: string;
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
}

const DropdownQuestion: React.FC<DropdownQuestionProps> = ({
  question,
  options = [],
  drop_down_value = null,
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
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );

  const [selectedOption, setSelectedOption] = useState<string | null>(
    drop_down_value
  );

  useEffect(() => {
    setSelectedOption(drop_down_value);
  }, [drop_down_value]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
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
      <Image
        src={draggable}
        alt="draggable icon"
        className={
          pathname === "/surveys/create-survey" ? "visible" : "invisible"
        }
      />
      <div className="w-full">
        <div className="flex justify-between w-full items-start gap-2">
          <h3 className="text-lg font-semibold text-start">
            <span>{index}. </span> {question}
            {is_required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {pathname.includes("survey-response-upload") && status && (
            <div>{getStatus}</div>
          )}
        </div>

        <div className="mt-4">
          <Select
            value={selectedOption || ""}
            onValueChange={handleOptionChange}
            disabled={pathname.includes("survey-response-upload")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pathname === "/surveys/edit-survey" && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={setIsRequired}
                className="data-[state=checked]:bg-[#5B03B2]"
              />
            </div>
            <div className="flex gap-2">
              <button
                className="bg-transparent border text-gray-500 border-gray-300 px-4 py-1.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
                onClick={EditQuestion}
              >
                Edit
              </button>
              <button
                className="text-red-500 bg-white px-4 py-1.5 border border-red-500 rounded-full text-sm hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs capitalize">
            <ListFilter className="text-[#9D50BB] w-3 h-3" />
            {questionType.split("_").join(" ")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DropdownQuestion;
