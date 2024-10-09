import { draggable } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import VoiceRecorder from "../ui/VoiceRecorder";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";


interface ComponentQuestionProps {
  question: string;
  response?: string;
  // setResponse: SetStateAction<string>;
  questionType: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?:string;
}

const CommentQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  DeleteQuestion,
  index,
  response,
  onChange,
  status
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );
  // const [response, setResponse] = useState("");

  // const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   // const value = e.target.value;
  //   // setResponse(value); // Update the state
  //   // console.log(`Response for question ${index}:`, value);
  //   setResponse(value);
  // };


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
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start">
            <span>{index}. </span>
            {question}
          </h3>
          {pathname === "/surveys/edit-survey" ||
          pathname.includes("surveys/question") ||
          pathname.includes("validate-response") ||
          pathname.includes("survey-reponse-upload") ||
          pathname.includes("survey-public-response") ? (
            ""
          ) : (
            <p>{questionType === "long_text" ? "Comment" : ""}</p>
          )}
        </div>
        <div>
          <AutosizeTextarea
            className="w-full border-none rounded-md p-2"
            placeholder="Type your response here..."
            style={{ borderColor: colorTheme }}
            onChange={onChange}
            value={response}
          />
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
        {
        pathname.includes('survey-public-response') && (  <VoiceRecorder />)

        }
    
      </div>
      {
        pathname.includes('survey-reponse-upload') && status && (<div>{getStatus(status)}</div>)
      }
    </div>
  );
};

export default CommentQuestion;
