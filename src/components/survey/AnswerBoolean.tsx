import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";

interface BooleanQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  boolean_value?: boolean; // Added boolean_value prop
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
  options = ["Yes", "No"], // Default options
  questionType,
  boolean_value = null, // Default to null
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

  // State to store the selected boolean value
  const [selectedValue, setSelectedValue] = useState<boolean | null>(boolean_value);

  // Sync the boolean_value prop with state
  useEffect(() => {
    setSelectedValue(boolean_value);
  }, [boolean_value]);

  // Handle option selection
  const handleOptionChange = (value: boolean) => {
    setSelectedValue(value); // Update selected value
    if (onChange) {
      onChange(value); // Trigger onChange callback if provided
    }
  };

    const getStatus = (status: string) => {
      switch (status) {
        case "passed":
          return (
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <Check strokeWidth={1} className="text-xs text-white" />
            </div>
          );
        case "failed":
          return (
            <div className="bg-red-500 rounded-full text-white p-2 mr-3">
              <BsExclamation />
            </div>
          );
  
        default:
          return null;
      }
    };

  return (
    <div
      className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded"
      style={{
        fontFamily: `${questionText?.name}`,
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
        <h3 className="text-lg font-semibold text-start">
          <p>
            <span>{index}. </span> {question}
            {is_required && <span className="text-2xl ml-2 text-red-500">*</span>}
          </p>
        </h3>
        <div className="flex items-center my-2">
          {options.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className="relative flex items-center cursor-pointer mr-4"
            >
              <input
                type="radio"
                name={question}
                value={option}
                className="hidden"
                checked={
                  (option.toLowerCase() === "yes" || option.toLowerCase() === "true") && selectedValue === true ||
                  (option.toLowerCase() === "no" || option.toLowerCase() === "false") && selectedValue === false
                }
                onChange={() =>
                  handleOptionChange(option.toLowerCase() === "yes" || option.toLowerCase() === "true")
                }
                required={is_required}
              />
              <span
                className={`w-5 h-5 border-2 rounded-full shadow-inner flex flex-col before:block before:w-3/5 before:h-3/5 before:m-auto before:rounded-full ${
                  (option.toLowerCase() === "yes" || option.toLowerCase() === "true") && selectedValue === true ||
                  (option.toLowerCase() === "no" || option.toLowerCase() === "false") && selectedValue === false
                    ? "bg-[#5B03B2]"
                    : "bg-transparent"
                }`}
                style={{ borderColor: colorTheme }}
              ></span>
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        {pathname === "/surveys/edit-survey" && (
          <div className="flex items-center gap-4">
            <span>Required</span>
            <Switch
              checked={is_required}
              onCheckedChange={
                setIsRequired
                  ? (checked: boolean) => setIsRequired(checked)
                  : undefined
              }
              className="bg-[#9D50BB]"
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

export default BooleanQuestion;
