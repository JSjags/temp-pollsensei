import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface MatrixQuestionProps {
  question: string;
  questionType: string;
  options: {
    Head: string[];
    Body: string[];
  };
  onChange?: (rowIndex: number, columnIndex: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  onSave?: (
    updatedQuestion: string,
    updatedOptions: string[],
    updatedQuestionType: string,
    aiEditIndex?: number
  ) => void;
}

const MatrixQuestion: React.FC<MatrixQuestionProps> = ({
  question,
  options,
  questionType,
  EditQuestion,
  index,
  onChange,
  DeleteQuestion,
  onSave,
  setEditId,
}) => {
  const pathname = usePathname();

  return (
    <div className="mb-4 bg-[#FAFAFA] w-full p-3 gap-3 rounded">
      <div className="flex items-center">
        <Image
          src={draggable}
          alt="draggable icon"
          className={
            pathname === "/surveys/create-survey" ? "visible" : "invisible"
          }
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="group text-lg font-semibold text-start">
              <span>{index}. </span> {question}{" "}
              <PollsenseiTriggerButton
                key={index}
                imageUrl={stars}
                tooltipText="Rephrase question"
                className={"group-hover:inline-block hidden"}
                triggerType="rephrase"
                question={question}
                optionType={questionType!}
                options={options}
                setEditId={setEditId}
                onSave={onSave!}
                index={index!}
              />
            </h3>
            {pathname !== "/surveys/edit-survey" && <p>{questionType}</p>}
          </div>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 text-start"></th>{" "}
                {/* Empty top-left corner */}
                {options?.Head?.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    className="border-b border-gray-300 text-center px-4 py-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {options?.Body?.map((rowLabel, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border-b border-gray-300 text-start px-4 py-2">
                    {rowLabel}
                  </td>
                  {options?.Head?.map((_, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="border-b border-gray-300 text-center"
                    >
                      <input
                        type="radio"
                        name={`matrix-${index}-${rowIndex}`}
                        className="text-[#5B03B2]"
                        onChange={() =>
                          onChange && onChange(rowIndex, columnIndex)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {pathname === "/surveys/edit-survey" && (
            <div className="flex justify-end gap-4 mt-4">
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
      </div>
    </div>
  );
};

export default MatrixQuestion;
