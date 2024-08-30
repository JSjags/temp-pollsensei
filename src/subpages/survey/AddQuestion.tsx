import React, { useState } from "react";
import Select from "react-select";
import { MdDeleteOutline } from "react-icons/md";

interface AddQuestionProps {
  onSave?: (question: string, options: string[], questionType: string) => void;
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
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

const AddQuestion: React.FC<AddQuestionProps> = ({ onSave, onCancel }) => {
  const [question, setQuestion] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("Multi-choice");
  const [options, setOptions] = useState<string[]>([""]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(question, options, questionType);
    }
  };

  const handleQuestionTypeChange = (selectedOption: any) => {
    setQuestionType(selectedOption.value);
    switch (selectedOption.value) {
      case "Likert Scale":
        setOptions([
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ]);
        break;
      case "Multi-choice":
        setOptions([""]);
        break;
      case "Comment":
        setOptions([]);
        break;
      default:
        setOptions([""]);
    }
  };

  const selectOptions = [
    { value: "Multi-choice", label: "Multiple Choice" },
    { value: "Comment", label: "Comment" },
    { value: "Likert Scale", label: "Likert Scale" },
    { value: "Linear Scale", label: "Linear Scale" },
    { value: "star_rating", label: "Star Rating" },
  ];

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded">
      <div className="w-full flex flex-col">
        <div className="flex justify-between w-full items-center">
          <input
            type="text"
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="text-lg font-semibold text-start w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between py-4 items-center">
          <small>Option Type</small>
          <Select
            className="select-container border-2 rounded mx-4 my-4"
            classNamePrefix="questionType"
            defaultValue={selectOptions.find((opt) => opt.value === "Multi-choice")}
            value={selectOptions.find((opt) => opt.value === questionType)}
            name="questionType"
            options={selectOptions}
            styles={customStyles}
            onChange={handleQuestionTypeChange}
          />
        </div>

        {questionType !== "Comment" && (
          <div>
            {options.map((option, index) => (
              <div key={index} className="flex items-center my-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mr-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
                {options.length > 1 && (
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 ml-2"
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            ))}
            {questionType === "Multi-choice" && (
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

export default AddQuestion;
