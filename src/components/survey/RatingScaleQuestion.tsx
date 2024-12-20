import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface RatingScaleQuestionProps {
  question: string;
  questionType: string;
  options: string[] | undefined; // Options represent each rating level
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

const RatingScaleQuestion: React.FC<RatingScaleQuestionProps> = ({
  question,
  options,
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

  // State to store the selected rating
  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  // Handle rating selection
  const handleRatingChange = (option: string) => {
    setSelectedRating(option);
    if (onChange) {
      onChange(option);
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

        {/* Rating Scale UI */}
        <div className="flex items-center justify-between gap-2 my-4 w-full">
          {options?.map((option, optionIndex) => (
            <div
              className="flex flex-col justify-center items-center"
              key={optionIndex}
            >
              <button
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedRating === option
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } hover:bg-purple-600 hover:text-white transition-colors duration-200`}
                onClick={() => handleRatingChange(option)}
              ></button>
              <span className="flex items-center justify-center">
                {" "}
                {option}
              </span>
            </div>
          ))}
        </div>

        {/* Edit and Delete Buttons */}
        {pathname === "/surveys/edit-survey" || pathname.includes("/edit-submitted-survey") && (
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

{pathname === "/surveys/add-question-m" && (
          <div className="flex justify-end gap-4">
           
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}


        {/* Required Toggle */}
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

        {/* Display Question Type Label */}
        <div className="flex justify-end">
          {pathname === "/surveys/edit-survey" ||
          pathname.includes("surveys/question") ? (
            ""
          ) : (
            <p>{questionType === "rating_scale" ? "Rating Scale" : ""}</p>
          )}
        </div>
      </div>
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default RatingScaleQuestion;
