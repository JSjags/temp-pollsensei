/* 
Matrix Question Component Design Explanation:
------------------------------------------
This component creates a grid-based question format where users can select one answer 
per row from multiple columns. The design was chosen because:

1. It efficiently presents multiple sub-questions (rows) with the same set of possible answers (columns)
2. The table format makes it easy to scan and compare options
3. Radio buttons ensure only one selection per row
4. The layout is familiar to users who have taken surveys before

Visual representation:

[Question Text]

                   Column1    Column2    Column3    Column4
Row1 Question        O          O          O          O
Row2 Question        O          O          O          O  
Row3 Question        O          O          O          O
Row4 Question        O          O          O          O

Where:
- O represents a radio button
- Each row can only have one selection
- The grid format allows for easy visual scanning
- Column headers and row labels provide context
*/

import { draggable, stars } from "@/assets/images";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { BsExclamation } from "react-icons/bs";
import { Check, GripVertical, Grid, SquareMousePointer } from "lucide-react";
import { Switch } from "../ui/switch";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

interface MatrixQuestionProps {
  question: string;
  questionType: string;
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
  isEdit?: boolean;
}

const MatrixQuestion: React.FC<MatrixQuestionProps> = ({
  question,
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
  isEdit = false,
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
          <div className="bg-green-500 rounded-full p-1.5 mr-3">
            <Check strokeWidth={1.5} className="text-white w-4 h-4" />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-500 rounded-full p-1.5 mr-3">
            <BsExclamation className="text-white w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="mb-6 bg-gray-50 shadow-sm hover:shadow-md rounded-xl p-6 transition-all duration-300"
      style={{
        fontFamily: questionText?.name,
        fontSize: `${questionText?.size}px`,
      }}
    >
      <div className="flex items-center gap-3">
        {pathname === "/surveys/create-survey" && (
          <Image src={draggable} alt="draggable icon" />
        )}
        <div className="w-full">
          <div className="flex justify-between w-full items-center">
            <h3 className="text-lg font-semibold text-start">
              <div className="group flex justify-between gap-2 items-start">
                <p>
                  <span>{index}. </span> {question}
                  {is_required === true && (
                    <span className="text-2xl ml-2 text-red-500">*</span>
                  )}
                </p>
                {!pathname.includes("survey-public-response") &&
                  !pathname.includes("create-survey") && (
                    <PollsenseiTriggerButton
                      key={index}
                      imageUrl={stars}
                      tooltipText="Rephrase question"
                      className={"group-hover:inline-block hidden"}
                      triggerType="rephrase"
                      question={question}
                      optionType={questionType}
                      options={{ rows: rows!, columns: columns! }}
                      setEditId={setEditId}
                      onSave={onSave!}
                      index={index}
                    />
                  )}
              </div>
            </h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="border-b border-gray-200 text-start p-3"></th>
                  {columns?.map((header, headerIndex) => (
                    <th
                      key={headerIndex}
                      className="border-b border-gray-200 text-center p-3 text-gray-700 font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows?.map((rowLabel, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 text-start p-3 text-gray-700">
                      {rowLabel}
                    </td>
                    {columns?.map((_, columnIndex) => (
                      <td
                        key={columnIndex}
                        className="border-b border-gray-200 text-center p-3"
                      >
                        <input
                          type="radio"
                          name={`matrix-${index}-${rowIndex}`}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
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
          </div>

          {(pathname === "/surveys/edit-survey" ||
            pathname.includes("/edit-submitted-survey")) && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                onClick={EditQuestion}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname === "/surveys/add-question-m" && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
                onClick={DeleteQuestion}
              >
                Delete
              </button>
            </div>
          )}

          {pathname.includes("edit-survey") && (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-gray-600">Required</span>
              <Switch
                checked={is_required}
                onCheckedChange={
                  setIsRequired
                    ? (checked: boolean) => setIsRequired(checked)
                    : undefined
                }
                className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            {!pathname.includes("edit-survey") &&
              !pathname.includes("surveys/question") && (
                <p className="text-sm font-medium bg-gradient-to-r from-[#F5F0FF] to-[#F8F4FF] text-[#5B03B2] px-4 py-1.5 rounded-full shadow-sm border border-[#E5D5FF]">
                  <span className="flex items-center gap-1 text-xs">
                    <Grid className="text-[#9D50BB] w-3 h-3" />
                    Matrix Question
                  </span>
                </p>
              )}
          </div>
        </div>

        {pathname.includes("survey-response-upload") && status && (
          <div>{getStatus(status)}</div>
        )}
      </div>
    </div>
  );
};

export default MatrixQuestion;
