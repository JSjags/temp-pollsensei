import { draggable } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { AutosizeTextarea } from "../ui/autosize-textarea";

interface ComponentQuestionProps {
  question: string;
  name?: string;
  questionType: string;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
}

const CommentQuestion: React.FC<ComponentQuestionProps> = ({
  question,
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
    <div className="mb-4 bg-[#FAFAFA] flex items-center gap-3 p-3 rounded "
    style={{
      fontFamily: `${questionText?.name}`,
      fontSize: `${questionText?.size}px`,
    }}
    >
      <Image src={draggable} alt="draggable icon" className={ 
             pathname === "/surveys/create-survey"
             ? "visible"
             : "invisible"
        } />
      <div className="w-full">
      <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start"><span>{index}. </span>{question}</h3>
         {pathname === "/surveys/edit-survey" || pathname.includes('surveys/question') ? "" : <p>{questionType}</p>}
      </div>
        <div >
          <AutosizeTextarea
            className="w-full border-none rounded-md p-2"
            placeholder="Type your response here..."
            style={{borderColor: colorTheme}}
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
          <button className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full" onClick={DeleteQuestion}>
            Delete
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default CommentQuestion;
