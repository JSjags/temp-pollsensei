import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";

interface AnswerMultiChoiceQuestionProps {
  question: string;
  questionType: string;
  options: string[];
  selectedOptions: string[];
  onChange?: (selected: string[]) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?:string;
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
  const colorTheme = useSelector((state: RootState) => state?.survey?.color_theme);

  const [localSelectedOptions, setLocalSelectedOptions] = useState<string[]>(selectedOptions);

 
  useEffect(() => {
    setLocalSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  const handleOptionChange = (option: string) => {
    const isSelected = localSelectedOptions.includes(option);
    const updatedOptions = isSelected
      ? localSelectedOptions.filter((item) => item !== option) 
      : [...localSelectedOptions, option];

    setLocalSelectedOptions(updatedOptions);
    
    if (onChange) {
      onChange(updatedOptions);
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
          <div className="bg-red-500 rounded-full text-white p-1 mr-3">
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
          pathname === "/surveys/create-survey"
            ? "visible"
            : "invisible"
        }
      />
      <div className="w-full">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start">
            <span>{index}. </span> {question}
          </h3>
          {pathname === "/surveys/edit-survey" || 
          pathname.includes('survey-reponse-upload') ||
          pathname.includes('validate-response') 
          ? "" : <p>{questionType}</p>}
        </div>
        {options?.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center my-2">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={`option-${optionIndex}`}
                name={question}
                checked={localSelectedOptions?.includes(option)} 
                onChange={() => handleOptionChange(option)}
                className="mr-2 text-[#5B03B2] hidden peer"
              />
              <span
                className={`w-5 h-5 border-2  shadow-inner flex flex-col peer-checked:before:bg-black peer-hover:shadow-[0_0_5px_0px_rgba(255,165,0,0.8)_inset] before:content-[''] before:block before:w-3/5 before:h-3/5 before:m-auto before:rounded-full`}
                style={{ borderColor: colorTheme }}
              ></span>
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
      {
        pathname.includes('survey-reponse-upload') && status && (<div>{getStatus(status)}</div>)
      }
    </div>
  );
};

export default AnswerMultiChoiceQuestion;
