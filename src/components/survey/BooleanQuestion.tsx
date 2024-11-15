import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
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
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  // State to store the selected option
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Handle option selection
  const handleOptionChange = (option: string) => {
    setSelectedOption(option); // Set the selected option
    console.log(`Selected option for question ${question}:`, option); // Log the selected option
    if (onChange) {
      onChange(option); // Trigger external onChange callback if provided
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
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start">
            <div className="group flex justify-between gap-2 items-start">
              <p>
                <span>{index}. </span> {question}
                {is_required === true && (
                  <span className="text-2xl ml-2 text-red-500">*</span>
                )}
              </p>
              <PollsenseiTriggerButton
                key={index}
                imageUrl={stars}
                tooltipText="Rephrase question"
                className={"group-hover:inline-block hidden"}
                triggerType="rephrase"
                question={question}
                optionType={questionType}
                options={options}
                // options={options ?? ["Yes", "No"]}
                setEditId={setEditId}
                onSave={onSave!}
                index={index}
              />
            </div>
          </h3>
        </div>
        {(options ?? ["Yes", "No"]).map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center my-2">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="radio"
                id={`option-${optionIndex}`}
                name={question}
                value={option}
                className="mr-2 text-[#5B03B2] radio hidden peer"
                checked={selectedOption === option}
                required={is_required}
                onChange={() => handleOptionChange(option)}
              />
              <span
                className={`w-5 h-5 border-2 rounded-full shadow-inner flex flex-col peer-checked:before:bg-[#5B03B2] peer-hover:shadow-[0_0_5px_0px_rgba(255,165,0,0.8)_inset] before:content-[''] before:block before:w-3/5 before:h-3/5 before:m-auto before:rounded-full`}
                style={{ borderColor: colorTheme }}
              ></span>
              <span className="ml-2">{option}</span>
            </label>
          </div>
        ))}
        {pathname === "/surveys/edit-survey" && (
          <div className="flex justify-end gap-4">
            <button
              className="bg-transparent border text-[#828282] border-[#828282]  px-5 py-1 rounded-full"
              onClick={EditQuestion}
            >
              Edit
            </button>
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}
        {pathname === "/surveys/add-question-m" && (
          <div className="flex justify-end gap-4">
            {/* <button
              className="bg-transparent border text-[#828282] border-[#828282]  px-5 py-1 rounded-full"
              onClick={EditQuestion}
            >
              Edit
            </button> */}
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}
        {/* {pathname === "/surveys/edit-survey" ||
          (pathname === "/surveys/add-question-m" && (
            <div className="flex justify-end gap-4 mt-4">
              {pathname === "/surveys/add-question-m" ? (
                ""
              ) : (
                <button
                  className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
                  onClick={EditQuestion}
                >
                  Edit
                </button>
              )}
              <button
                className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          ))} */}
        {pathname.includes("edit-survey") && (
          <div className="flex items-center gap-4">
            <span>Required</span>
            <Switch
              checked={is_required}
              onCheckedChange={
                setIsRequired
                  ? (checked: boolean) => setIsRequired(checked)
                  : undefined
              }
              className="bg-[#9D50BB] "
            />
          </div>
        )}
        <div className="flex justify-end">
          {pathname === "/surveys/edit-survey" ||
          pathname.includes("surveys/question") ? (
            ""
          ) : (
            <p>{questionType === "boolean" ? "Boolean" : ""}</p>
          )}
        </div>
      </div>
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default BooleanQuestion;
