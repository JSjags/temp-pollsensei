import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import VoiceRecorder from "../ui/VoiceRecorder";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface NumberQuestionProps {
  question: string;
  response?: string;
  questionType: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  min?: number;
  max?: number;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const NumberQuestion: React.FC<NumberQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  min,
  max,
  options,
  onChange,
  status,
  is_required,
  setIsRequired,
  onSave,
  setEditId,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );
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
      className="mb-4 bg-[#FAFAFA] flex items-center gap-3 p-3 rounded "
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
        <div className="group flex justify-between gap-2 w-full items-center">
          <h3 className="text-lg font-semibold text-start relative">
            <span>{index}. </span>
            {question}
            {is_required === true && (
              <span className="text-2xl ml-2 text-red-500">*</span>
            )}
          </h3>
          <span></span>
          {!pathname.includes("survey-public-response") && (
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
        <div>
          {/* {errorNum && <p className="text-red-500 text-sm">{errorNum}</p>} */}
          <AutosizeTextarea
            className="w-full border-none rounded-md p-2"
            placeholder={
              min && max
                ? `Enter a number between ${min} and ${max}`
                : "Enter your response here"
            }
            style={{ borderColor: colorTheme }}
            onChange={onChange}
            value={response}
            required={is_required}
          />
        </div>
        {pathname === "/surveys/edit-survey"  && (
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
        { pathname.includes("/edit-submitted-survey") && (
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
     
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}

   
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
          pathname.includes("surveys/question") ||
          pathname.includes("validate-response") ||
          pathname.includes("survey-response-upload") ||
          pathname.includes("survey-public-response") ? (
            ""
          ) : (
            <p>{questionType === "long_text" ? "Comment" : ""}</p>
          )}
        </div>
      </div>
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default NumberQuestion;
