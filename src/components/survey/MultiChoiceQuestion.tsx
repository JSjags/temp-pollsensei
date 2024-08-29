import { draggable } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";


interface MultiChoiceQuestionProps {
  question: string;
  questionType: string;
  options: string[] | undefined;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  index: number;
}



const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  question,
  options,
  questionType,
  EditQuestion,
  index,
}) => {
  const pathname = usePathname();



  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
      <Image src={draggable} alt="draggable icon" />
      <div className="w-full">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start"><span>{index}. </span> {question}</h3>
         {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
        </div>
        {options?.map((option, index) => (
          <div key={index} className="flex items-center my-2">
            <input
              type="radio"
              id={`option-${index}`}
              name={question}
              className="mr-2 text-[#5B03B2]"
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
       {pathname === "/surveys/edit-survey" && <div className="flex justify-end gap-4">
          <button className="bg-transparent border text-[#828282] border-[#828282]  px-5 py-1 rounded-full" onClick={EditQuestion}>
            Edit
          </button>
          <button className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full">
            Delete
          </button>
        </div>}
      </div>
    </div>
  );
};

export default MultiChoiceQuestion;
