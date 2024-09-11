import { draggable } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface MultiChoiceQuestionProps {
  question: string;
  questionType: string;
  options: string[] | undefined;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
}

const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  question,
  options,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector((state: RootState) => state?.survey?.color_theme)

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
          pathname === "/surveys/edit-survey" || pathname ==='surveys/preview-survey' ? "invisible" : "visible"
        }
      />
      <div className="w-full">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start">
            <span>{index}. </span> {question}
          </h3>
          {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
        </div>
        {options?.map((option, index) => (
          <div key={index} className="flex items-center my-2">
            {/* <label htmlFor={`option-${index}`}>{option}</label> */}

            <label className="relative flex items-center cursor-pointer">
              <input
                type="radio"
                id={`option-${index}`}
                name={question}
                className="mr-2 text-[#5B03B2] radio hidden peer"
              />
              <span
                className={`w-5 h-5 border-2 rounded-full shadow-inner flex flex-col peer-checked:before:bg-green-500 peer-hover:shadow-[0_0_5px_0px_rgba(255,165,0,0.8)_inset] before:content-[''] before:block before:w-3/5 before:h-3/5 before:m-auto before:rounded-full`}
                style={{borderColor: colorTheme}}
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
