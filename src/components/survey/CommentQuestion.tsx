import { draggable } from "@/assets/images";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

interface ComponentQuestionProps {
  question: string;
  name?: string;
  questionType: string;
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  index: number;
}

const CommentQuestion: React.FC<ComponentQuestionProps> = ({
  question,
  questionType,
  EditQuestion,
  index,
}) => {
  const pathname = usePathname();

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center gap-3 p-3 rounded ">
      <Image src={draggable} alt="draggable icon" className={pathname === "/surveys/edit-survey" ? "invisible" : "visible"} />
      <div className="w-full">
        <div>
          <h3 className="text-lg font-semibold"><span>{index}. </span>{question}</h3>
         {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
          <textarea
            className="w-full border-none rounded-md p-2"
            placeholder="Type your response here..."
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
          <button className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full">
            Delete
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default CommentQuestion;
