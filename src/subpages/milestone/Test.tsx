// import {
//   FaRocket,
//   FaCogs,
//   FaTrophy,
//   FaClipboard,
//   FaFlagCheckered,
// } from "react-icons/fa";
// import {
//   AiOutlineAppstoreAdd,
//   AiOutlineUserAdd,
//   AiOutlineLineChart,
// } from "react-icons/ai";
// import { ReactNode } from "react";
// import KickStart from "./KickStart";

// interface MilestoneProps {
//   icon: ReactNode;
//   title: string;
//   subItems?: string[] | undefined;
// }

// const Milestone = () => {
//   return (
//     <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-10">
//      <KickStart progress="30%"  icon={<FaRocket className="text-purple-500" />} />
//       <div className="relative flex justify-between w-full">
//         <div className="absolute top-1/2 w-full h-0.5 bg-purple-300"></div>
//         <MilestoneItem
//           icon={<FaRocket className="text-purple-500" />}
//           title="Design Survey"
//           subItems={["Generate with AI", "Create Manually"]}
//         />
//         <MilestoneItem
//           icon={<FaCogs className="text-purple-500" />}
//           title="Assign Roles"
//         />
//         <MilestoneItem
//           icon={<AiOutlineAppstoreAdd className="text-purple-500" />}
//           title="Collect Data"
//           subItems={["Buy Respondents", "Share Survey"]}
//         />
//         <MilestoneItem
//           icon={<FaTrophy className="text-purple-500" />}
//           title="Validate Response"
//         />
//         <MilestoneItem
//           icon={<AiOutlineLineChart className="text-purple-500" />}
//           title="Analyze Survey"
//           subItems={["Qualitative Analysis", "Quantitative Analysis"]}
//         />
//         <MilestoneItem
//           icon={<FaClipboard className="text-purple-500" />}
//           title="Generate Report"
//         />
//         <MilestoneItem
//           icon={<FaFlagCheckered className="text-purple-500" />}
//           title="Close Survey"
//         />
//       </div>
//     </div>
//   );
// };

// const MilestoneItem: React.FC<MilestoneProps> = ({ icon, title, subItems }) => {
//   return (
//     <div className="relative flex flex-col items-center w-32 text-center space-y-2">
//       <div className="relative p-1 bg-purple-200 rounded-full">
//         <div className="relative p-1 bg-purple-100 rounded-full">
//           <div className="relative p-4 bg-tranparent rounded-full">
//             <div
//               className="absolute inset-0 rounded-full animate-spin-slow"
//               style={{
//                 background: "conic-gradient(#5B03B2 0% 25%, #e5e5e5 25% 100%)",
//                 mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
//                 WebkitMask:
//                   "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
//               }}
//             />
//             <div className="relative flex items-center justify-center w-full h-full">
//               {icon}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-2 text-sm font-semibold">{title}</div>
//     </div>
//   );
// };

// export default Milestone;


import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";

interface MultiChoiceQuestionEditProps {
  question: string;
  questionType: string;
  options: any;
  onSave?: (updatedQuestion: string, updatedOptions: any, editedQuestionType:string) => void;
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

const MultiChoiceQuestionEdit: React.FC<MultiChoiceQuestionEditProps> = ({
  question,
  options,
  questionType,
  onSave,
  onCancel,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<string>(question);
  const [editedQuestionType, setEditedQuestionType] = useState<string>(questionType);
  const [editedOptions, setEditedOptions] = useState<any>(
    options || { Head: [""], Body: [""] }
  );

  const handleOptionChange = (section: "Head" | "Body", index: number, value: string) => {
    const newOptions = { ...editedOptions };
    console.log(newOptions[section])
    newOptions[section] = [...newOptions[section]];
    newOptions[section][index] = value;
    setEditedOptions(newOptions);
  };

  const handleAddOption = (section: "Head" | "Body") => {
    const newOptions = { ...editedOptions };
    newOptions[section] = [...newOptions[section], ""]; // TODO: I don't know what this is doing here, but i just had to add  it, check behaviour later
    // newOptions[section].push("");
    setEditedOptions(newOptions);
  };

  const handleRemoveOption = (section: "Head" | "Body", index: number) => {
    const newOptions = { ...editedOptions };
    newOptions[section] = [...newOptions[section]];
    newOptions[section].splice(index, 1);
    setEditedOptions(newOptions);
  };
  // const handleRemoveOption = (section: "Head" | "Body", index: number) => {
  //   const newOptions = { ...editedOptions };
  //   if (Array.isArray(newOptions[section])) {
  //     newOptions[section] = [...newOptions[section]];
  //     newOptions[section].splice(index, 1);
  //     setEditedOptions(newOptions);
  //   }
  // };

  const handleSave = () => {
    if (onSave) {
      onSave(editedQuestion, editedOptions, editedQuestionType);
    }
  };

  const handleQuestionTypeChange = (selectedOption: any) => {
    setEditedQuestionType(selectedOption.value);

    switch (selectedOption.value) {
      case "Likert Scale":
        setEditedOptions(["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);
        break;
        
      case "Multi-choice":
        setEditedOptions([""]); 
        break;
        
      case "Comment":
        setEditedOptions([]); 
        break;

      case "Matrix":
        setEditedOptions({
          Head: ["Head 1", "Head 2", "Head 3", "Head 4", "Head 5"],
          Body: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
        });
        break;

      default:
        setEditedOptions([""]);
    }
  };

  const selectOptions = [
    { value: "Multi-choice", label: "Multiple Choice" },
    { value: "Comment", label: "Comment" },
    { value: "Likert Scale", label: "Likert Scale" },
    { value: "Linear Scale", label: "Linear Scale" },
    { value: "star_rating", label: "Star Rating" },
    { value: "Matrix", label: "Matrix" },
  ];

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded">
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
          <small>Option Type</small>
          <Select
            className="select-container border-2 rounded mx-4 my-4"
            classNamePrefix="questionType"
            defaultValue={selectOptions.find(opt => opt.value === questionType)}
            value={selectOptions.find(opt => opt.value === editedQuestionType)}
            name="questionType"
            options={selectOptions}
            styles={customStyles}
            onChange={handleQuestionTypeChange}
          />
        </div>

        {editedQuestionType === "Matrix" && (
          <div>
            <h4 className="font-semibold">Matrix Options</h4>
            <div>
              <h5>Head (Columns)</h5>
              {editedOptions.Head.map((option: string, index: number) => (
                <div key={index} className="flex items-center my-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange("Head", index, e.target.value)}
                    className="mr-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  {editedOptions.Head.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption("Head", index)}
                      className="text-red-500 ml-2"
                    >
                      <MdDeleteOutline />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleAddOption("Head")}
                className="text-blue-500 mt-2 text-start"
              >
                Add Column
              </button>
            </div>

            <div>
              <h5>Body (Rows)</h5>
              {editedOptions.Body.map((option: string, index: number) => (
                <div key={index} className="flex items-center my-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange("Body", index, e.target.value)}
                    className="mr-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  {editedOptions.Body.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption("Body", index)}
                      className="text-red-500 ml-2"
                    >
                      <MdDeleteOutline />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleAddOption("Body")}
                className="text-blue-500 mt-2 text-start"
              >
                Add Row
              </button>
            </div>
          </div>
        )}

        {editedQuestionType !== "Matrix" && editedQuestionType !== "Comment" && (
          <div>
            {editedOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center my-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange("Head", index, e.target.value)}
                  className="mr-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
                {editedOptions.length > 1 && (
                  <button
                    onClick={() => handleRemoveOption("Head", index)}
                    className="text-red-500 ml-2"
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            ))}
            {editedQuestionType === "Multi-choice" && (
              <button
                onClick={() => handleAddOption("Head")}
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

export default MultiChoiceQuestionEdit;

