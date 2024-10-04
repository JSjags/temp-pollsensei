import React, { useState } from "react";
import Select from "react-select";
import { MdDeleteOutline } from "react-icons/md";
import { Switch } from "@/components/ui/switch";

interface AddQuestionProps {
  onSave?: (question: string, options: string[], questionType: string, is_required:boolean) => void;
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
  const [questionType, setQuestionType] = useState<string>("multiple_choice");
  const [options, setOptions] = useState<string[] | any>([""]);
  const [is_required, setIsRequired] = useState<boolean>(false)

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
      onSave(question, options, questionType, is_required);
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
      case "multiple_choice":
        setOptions([""]);
        break;
      case "long_text":
        setOptions([]);
        break;
      case "matrix_checkbox":
        setOptions({
            Head: ["Head 1", "Head 2", "Head 3", "Head 4", "Head 5"],
            Body: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
          });
          break;
      default:
        setOptions([""]);
    }
  };

  const selectOptions = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "long_text", label: "Comment" },
    // { value: "likert_scale", label: "Likert Scale" },
    // { value: "linear_scale", label: "Linear Scale" },
    { value: "star_rating", label: "Star Rating" },
    // { value: "matrix_checkbox", label: "Matrix" },
  ];

  return (
    <div className="mb-4 bg-[#fff] flex items-center w-full py-4 px-11 gap-3 rounded">
      <div className="w-full flex flex-col">
        <label htmlFor="question">Question</label>
        <div className="flex justify-between w-full items-center mt-2">
          <input
            type="text"
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="text-lg font-semibold text-start w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between py-4 items-center">
          <p>Option</p>
          <Select
            className="select-container border-2 rounded mx-4 my-4"
            classNamePrefix="questionType"
            defaultValue={selectOptions.find((opt) => opt.value === "multiple_choice")}
            value={selectOptions.find((opt) => opt.value === questionType)}
            name="questionType"
            options={selectOptions}
            styles={customStyles}
            onChange={handleQuestionTypeChange}
          />
        </div>

        {questionType !== "long_text" && (
          <div>
            {options.map((option:any, index:any) => (
              <div key={index} className="flex items-center my-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mr-2 w-full bg-transparent border-b py-2 border-gray-300 focus:outline-none focus:border-blue-500"
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
            {questionType === "multiple_choice" && (
              <button
                onClick={handleAddOption}
                className="text-blue-500 mt-2 border py-2 px-4 rounded-full text-start"
              >
                Add Option
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center gap-4 mt-4">
        <div className="flex justify-between items-center gap-4">
          <span>Required</span>
            <Switch checked={is_required} onCheckedChange={()=>setIsRequired((prev)=> !prev)} className="bg-[#9D50BB] " />
          </div>
        

          <div className="flex items-center gap-5">
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
    </div>
  );
};

export default AddQuestion;


