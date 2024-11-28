import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface LinearScaleQuestionProps {
  question: string;
  questionType: string;
  scaleStart: number;
  scaleEnd: number;
  index?: number;
  onChange?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  options?: string[] | undefined;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const LinearScaleQuestion: React.FC<LinearScaleQuestionProps> = ({
  question,
  questionType,
  scaleStart,
  scaleEnd,
  index,
  onChange,
  EditQuestion,
  DeleteQuestion,
  setEditId,
  options,
  onSave,
}) => {
  const pathname = usePathname();

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(parseInt(e.target.value));
    }
  };

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
      <Image src={draggable} alt="draggable icon" />
      <div className="w-full">
        <div className="flex justify-between w-full items-center">
          <h3 className="group text-lg font-semibold text-start">
            {question}
            {
               !pathname.includes("survey-public-respons") &&
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
              index={index!}
            />
            }
          </h3>
          {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
        </div>
        <div className="flex items-center my-2">
          <label className="mr-2">{scaleStart}</label>
          <input
            type="range"
            min={scaleStart}
            max={scaleEnd}
            className="mr-2 text-[#5B03B2] w-full"
            onChange={handleScaleChange}
          />
          <label className="ml-2">{scaleEnd}</label>
        </div>
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

export default LinearScaleQuestion;
