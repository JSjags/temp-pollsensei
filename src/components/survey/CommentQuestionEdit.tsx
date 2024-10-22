import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";

interface CommentQuestionEditProps {
  question: string;
  options: string[] | undefined;
  questionType: string;
  onSave?: (
    updatedQuestion: string,
    editedQuestionType: string,
    updatedOptions?: string[]
  ) => void;
  onCancel?: () => void;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    paddingLeft: "1.3rem",
    border: "none",
    backgroundColor: "#fff",
    color: "#8A7575",
    outline: "none",
  }),
};

const CommentQuestionEdit: React.FC<CommentQuestionEditProps> = ({
  question,
  questionType,
  onSave,
  options,
  onCancel,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<string>(question);
  const [editedOptions, setEditedOptions] = useState<string[]>(options || [""]);
  const [editedQuestionType, setEditedQuestionType] =
    useState<string>(questionType);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedOptions];
    newOptions[index] = value;
    setEditedOptions(newOptions);
  };

  const handleSave = () => {
    if (onSave) {
      // @ts-ignore
      onSave(editedQuestion, editedOptions, editedQuestionType);
      // onSave(editedQuestion, editedQuestionType, editedOptions);
    }
  };

  const handleAddOption = () => {
    setEditedOptions([...editedOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...editedOptions];
    newOptions.splice(index, 1);
    setEditedOptions(newOptions);
  };

  const handleQuestionTypeChange = (selectedOption: any) => {
    setEditedQuestionType(selectedOption.value);
    switch (selectedOption.value) {
      case "Likert Scale":
        setEditedOptions([
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ]);
        break;
      case "Multi-choice":
        setEditedOptions([""]);
        break;
      case "Comment":
        setEditedOptions([]);
        break;
      default:
        setEditedOptions([""]);
    }
  };

  const selectOptions = [
    { value: "Comment", label: "Comment" },
    { value: "Multi-choice", label: "Multiple Choice" },
    // { value: "Likert Scale", label: "Likert Scale" },
    // { value: "Linear Scale", label: "Linear Scale" },
    { value: "star_rating", label: "Star Rating" },
  ];

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
      <Image src={draggable} alt="draggable icon" />
      <div className="w-full flex flex-col">
        <div className="flex justify-between w-full items-center">
          <input
            type="text"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="text-lg font-semibold text-start w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between py-4 items-center">
          <small>Question Type</small>
          <Select
            className="select-container border-2 rounded mx-4 my-4"
            classNamePrefix="questionType"
            defaultValue={selectOptions.find(
              (opt) => opt.value === questionType
            )}
            value={selectOptions.find(
              (opt) => opt.value === editedQuestionType
            )}
            name="questionType"
            options={selectOptions}
            styles={customStyles}
            onChange={handleQuestionTypeChange}
          />
        </div>

        {editedQuestionType === "Comment" ? (
          <div className="mt-4">
            <textarea
              className="w-full border-none rounded-md p-2 bg-gray-100 focus:outline-none"
              placeholder="Type your response here..."
              rows={4}
              disabled
            />
          </div>
        ) : (
          <div>
            {editedOptions.map((option, index) => (
              <div key={index} className="flex items-center my-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mr-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
                {editedOptions.length > 1 && (
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 ml-2"
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            ))}
            {editedQuestionType === "Multi-choice" && (
              <button
                onClick={handleAddOption}
                className="text-blue-500 mt-2 text-start"
              >
                Add Option
              </button>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="text-blue-500 bg-white px-5 border border-blue-500 py-1 rounded-full"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentQuestionEdit;
