import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BsExclamation } from "react-icons/bs";
import {
  Check,
  CheckSquare,
  CircleCheck,
  SquareMousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/shadcn-checkbox";

interface AnswerMultiChoiceQuestionProps {
  question: string;
  questionType: string;
  options: string[];
  selectedOptions: string[];
  onChange?: (selected: string[]) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
}

const AnswerMultiChoiceQuestion: React.FC<AnswerMultiChoiceQuestionProps> = ({
  question,
  options,
  selectedOptions,
  questionType,
  onChange,
  EditQuestion,
  DeleteQuestion,
  index,
  status,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  const [localSelectedOptions, setLocalSelectedOptions] = useState<string[]>(
    selectedOptions || []
  );

  useEffect(() => {
    if (selectedOptions !== localSelectedOptions) {
      setLocalSelectedOptions(selectedOptions);
    }
  }, [selectedOptions]);

  const handleOptionChange = (option: string) => {
    // Prevent changes since these are user responses
    return;
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
          </h3>
          {pathname.includes("survey-response-upload") && status && (
            <div>{getStatus}</div>
          )}
        </div>
        {options?.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center my-2">
            <label
              className={cn(
                "relative flex items-center w-full",
                "cursor-not-allowed opacity-75"
              )}
              htmlFor={`option-${optionIndex}`}
              aria-label={option}
            >
              <Checkbox
                id={`option-${optionIndex}`}
                checked={localSelectedOptions?.includes(option)}
                onCheckedChange={() => handleOptionChange(option)}
                disabled={true}
                className="mr-2 data-[state=checked]:bg-[#5B03B2] data-[state=checked]:border-[#5B03B2]"
              />
              <span className="ml-2">{option}</span>
            </label>
          </div>
        ))}
        {pathname === "/surveys/edit-survey" && (
          <div className="flex justify-end gap-4">
            <button
              className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
              onClick={EditQuestion}
            >
              Edit
            </button>
            <button
              className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
          <span className="flex items-center gap-1 text-xs capitalize">
            {questionType === "multiple_choice" ? (
              <SquareMousePointer className="text-[#9D50BB] w-3 h-3" />
            ) : questionType === "checkbox" ? (
              <CheckSquare className="text-[#9D50BB] w-3 h-3" />
            ) : (
              <CircleCheck className="text-[#9D50BB] w-3 h-3" />
            )}
            {questionType.split("_").join(" ")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AnswerMultiChoiceQuestion;
