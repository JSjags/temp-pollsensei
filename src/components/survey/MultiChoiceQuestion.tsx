import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface MultiChoiceQuestionProps {
  question: string;
  questionType: string;
  options: string[] | undefined;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  canUseAI?: boolean;
}

const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  question,
  options,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  onChange,
  canUseAI = false,
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
              </p>
              <PollsenseiTriggerButton
                imageUrl={stars}
                tooltipText="Rephrase question"
                className={"group-hover:inline-block hidden"}
                triggerType="rephrase"
              />
            </div>
          </h3>
          {pathname === "/surveys/edit-survey" ||
          pathname.includes("surveys/question") ? (
            ""
          ) : (
            <p>{questionType}</p>
          )}
        </div>
        {options?.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center my-2">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="radio"
                id={`option-${optionIndex}`}
                name={question}
                value={option}
                className="mr-2 text-[#5B03B2] radio hidden peer"
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
              />
              <span
                className={`w-5 h-5 border-2 rounded-full shadow-inner flex flex-col peer-checked:before:bg-green-500 peer-hover:shadow-[0_0_5px_0px_rgba(255,165,0,0.8)_inset] before:content-[''] before:block before:w-3/5 before:h-3/5 before:m-auto before:rounded-full`}
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
      </div>
    </div>
  );
};

export default MultiChoiceQuestion;
