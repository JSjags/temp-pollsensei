import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface MatrixQuestionProps {
  question: string;
  questionType: string;
  // options: {
  //   Head: string[];
  //   Body: string[];
  // };
  rows?: string[];
  columns?: string[];
  onChange?: (rowIndex: number, columnIndex: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index: number;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
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
  // options,
  rows,
  columns,
  questionType,
  EditQuestion,
  index,
  onChange,
  DeleteQuestion,
  onSave,
  setEditId,
  status,
  is_required,
  setIsRequired,
}) => {
  const pathname = usePathname();

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
                // options={options}
                options={{ rows: rows!, columns: columns! }}
                setEditId={setEditId}
                onSave={onSave!}
                index={index!}
              />
            </h3>
            {/* {pathname !== "/surveys/edit-survey" && <p>{questionType}</p>} */}
          </div>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 text-start"></th>{" "}
                {/* Empty top-left corner */}
                {columns?.map((header, headerIndex) => (
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
              {rows?.map((rowLabel, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border-b border-gray-300 text-start px-4 py-2">
                    {rowLabel}
                  </td>
                  {columns?.map((_, columnIndex) => (
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
          {pathname === "/surveys/edit-survey" ||
            (pathname === "/surveys/add-question-m" && (
              <div className="flex justify-end gap-4 mt-4">
                {pathname === "/surveys/add-question-m" ? (
                  ""
                ) : (
                  <button
                    className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
                    onClick={EditQuestion}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
                  onClick={DeleteQuestion}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
      {pathname.includes("edit-survey") ||
        (pathname === "/surveys/add-question-m" && (
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
        ))}
      <div className="flex justify-end">
        {pathname === "/surveys/edit-survey" ||
        pathname.includes("surveys/question") ? (
          ""
        ) : (
          <p>{questionType === "matrix_checkbox" ? "Matrix" : ""}</p>
        )}
      </div>
      {pathname.includes("survey-reponse-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default MatrixQuestion;
