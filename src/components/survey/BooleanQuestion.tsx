/* 
UI Design Explanation:
---------------------
The boolean question uses a clean, modern design with radio buttons for Yes/No selection.
This design was chosen because:

1. Simple, clear layout that emphasizes the binary choice
2. Custom styled radio buttons with smooth animations
3. Consistent styling with other question types
4. Toggle icon represents binary/boolean nature

Visual representation:

+-------------------------------------------+
|  1. What do you agree with this? *        |  <- Question text with required asterisk
|  [Icon: ToggleLeft]                       |  <- Toggle icon represents boolean
|                                           |
|  O Yes                                    |  <- Custom radio with hover effects
|  O No                                     |  <- Matching theme colors
|                                           |
|  [Edit] [Delete]  Required [Switch]       |  <- Action buttons & required toggle
+-------------------------------------------+

The ToggleLeft icon was chosen since it visually represents a binary/boolean choice
and matches the yes/no nature of the question type.
*/

import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { BsExclamation } from "react-icons/bs";
import { Check, ToggleLeft } from "lucide-react";
import { Switch } from "../ui/switch";

interface BooleanQuestionProps {
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

const BooleanQuestion: React.FC<BooleanQuestionProps> = ({
  question,
  options = ["Yes", "No"],
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

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
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

          <div className="space-y-4 mt-4">
            {(options ?? ["Yes", "No"]).map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`boolean-${index}`}
                    value={option}
                    className="peer sr-only"
                    checked={selectedOption === option}
                    required={is_required}
                    onChange={() => handleOptionChange(option)}
                  />
                  <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              </div>
            ))}
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

          <div className="flex justify-end mt-4">
            {!pathname.includes("edit-survey") &&
              !pathname.includes("surveys/question") && (
                <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
                  <span className="flex items-center gap-1 text-xs">
                    <ToggleLeft className="text-[#9D50BB] w-3 h-3" />
                    Boolean
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

export default BooleanQuestion;
