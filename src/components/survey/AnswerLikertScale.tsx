// import { draggable, stars } from "@/assets/images";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
// import { Check } from "lucide-react";
// import { BsExclamation } from "react-icons/bs";
// import { Switch } from "../ui/switch";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// interface LikertScaleQuestionProps {
//   question: string;
//   options: string[];
//   questionType?: string;
//   scale_value?: number; // The selected scale value
//   onChange?: (value: string) => void;
//   EditQuestion?: () => void;
//   DeleteQuestion?: () => void;
//   index?: number;
//   canUseAI?: boolean;
//   status?: string;
//   is_required?: boolean;
//   setIsRequired?: (value: boolean) => void;
//   setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
//   onSave?: (
//     updatedQuestion: string,
//     updatedOptions: string[],
//     updatedQuestionType: string,
//     aiEditIndex?: number
//   ) => void;
// }

// const LikertScaleQuestion: React.FC<LikertScaleQuestionProps> = ({
//   question,
//   options,
//   questionType,
//   scale_value,
//   EditQuestion,
//   onChange,
//   index,
//   DeleteQuestion,
//   setEditId,
//   onSave,
//   canUseAI = false,
//   status,
//   is_required,
//   setIsRequired,
// }) => {
//   const pathname = usePathname();
//   const questionText = useSelector(
//     (state: RootState) => state?.survey?.question_text
//   );
//   const colorTheme = useSelector(
//     (state: RootState) => state?.survey?.color_theme
//   );

//   // State for selected option
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);

//   // Set initial selected option based on scale_value
//   useEffect(() => {
//     if (scale_value && Array.isArray(scale_value) && scale_value[0]) {
//       setSelectedOption(scale_value[0]); // Use the first value in the array
//     }
//   }, [scale_value, options]);

//   // Handle scale change
//   const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedValue = e.target.value;
//     setSelectedOption(selectedValue);
//     if (onChange) {
//       onChange(selectedValue);
//     }
//   };

//   const getStatus = (status: string) => {
//     switch (status) {
//       case "passed":
//         return (
//           <div className="bg-green-500 rounded-full p-1 mr-3">
//             <Check strokeWidth={1} className="text-xs text-white" />
//           </div>
//         );
//       case "failed":
//         return (
//           <div className="bg-red-500 rounded-full text-white p-2 mr-3">
//             <BsExclamation />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3"
//       style={{
//         fontFamily: `${questionText?.name}`,
//         fontSize: `${questionText?.size}px`,
//       }}
//     >
//       <Image
//         src={draggable}
//         alt="draggable icon"
//         className={
//           pathname === "/surveys/create-survey" ? "visible" : "invisible"
//         }
//       />
//       <div className="w-full">
//         <div className="flex justify-between w-full items-center">
//           <h3 className="group flex text-lg font-semibold text-start">
//             <p>
//               <span>{index}. </span> {question}
//               {is_required === true && (
//                 <span className="text-2xl ml-2 text-red-500">*</span>
//               )}
//             </p>
//             {!pathname.includes("survey-public-response") && (
//               <PollsenseiTriggerButton
//                 key={index}
//                 imageUrl={stars}
//                 tooltipText="Rephrase question"
//                 className={"group-hover:inline-block hidden"}
//                 triggerType="rephrase"
//                 question={question}
//                 optionType={questionType!}
//                 options={options}
//                 setEditId={setEditId}
//                 onSave={onSave!}
//                 index={index!}
//               />
//             )}
//           </h3>
//         </div>
//         <div className="flex justify-between gap-5 my-2">
//           {options?.map((option, idx) => (
//             <div key={idx} className="flex flex-col items-center">
//               <input
//                 type="radio"
//                 id={`likert-${idx}`}
//                 name={question}
//                 className="text-[#5B03B2]"
//                 onChange={handleScaleChange}
//                 checked={selectedOption === option}
//                 value={option}
//                 required={is_required}
//               />
//               <label htmlFor={`likert-${idx}`} className="mt-1">
//                 {option}
//               </label>
//             </div>
//           ))}
//         </div>
//         {pathname === "/surveys/edit-survey" && (
//           <div className="flex justify-end gap-4">
//             <button
//               className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
//               onClick={EditQuestion}
//             >
//               Edit
//             </button>
//             <button
//               className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
//               onClick={DeleteQuestion}
//             >
//               Delete
//             </button>
//           </div>
//         )}

//         {pathname.includes("/edit-submitted-survey") && (
//           <div className="flex justify-end gap-4">
//             <button
//               className="bg-transparent border text-[#828282] border-[#828282] px-5 py-1 rounded-full"
//               onClick={EditQuestion}
//             >
//               Edit
//             </button>
//             <button
//               className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
//               onClick={DeleteQuestion}
//             >
//               Delete
//             </button>
//           </div>
//         )}
//         {pathname.includes("edit-survey") && (
//           <div className="flex items-center gap-4">
//             <span>Required</span>
//             <Switch
//               checked={is_required}
//               onCheckedChange={
//                 setIsRequired
//                   ? (checked: boolean) => setIsRequired(checked)
//                   : undefined
//               }
//               className="bg-[#9D50BB] "
//             />
//           </div>
//         )}
//         <div className="flex justify-end">
//           {pathname === "/surveys/edit-survey" ||
//           pathname.includes("surveys/question") ? (
//             ""
//           ) : (
//             <p>{questionType === "likert_scale" ? "Likert Scale" : ""}</p>
//           )}
//         </div>
//       </div>
//       {pathname.includes("survey-response-upload") && status && (
//         <div>{getStatus(status)}</div>
//       )}
//     </div>
//   );
// };

// export default LikertScaleQuestion;


import { draggable, stars } from "@/assets/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Check } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface LikertScaleQuestionProps {
  question: string;
  options: string[];
  questionType?: string;
  scale_value?: string[]; // Ensure it's an array
  onChange?: (value: string) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  index?: number;
  canUseAI?: boolean;
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

const LikertScaleQuestion: React.FC<LikertScaleQuestionProps> = ({
  question,
  options,
  questionType,
  scale_value,
  EditQuestion,
  onChange,
  index,
  DeleteQuestion,
  setEditId,
  onSave,
  canUseAI = false,
  status,
  is_required,
  setIsRequired,
}) => {
  const pathname = usePathname();
  const questionText = useSelector(
    (state: RootState) => state?.survey?.question_text
  );
  const colorTheme = useSelector(
    (state: RootState) => state?.survey?.color_theme
  );

  // State for selected option
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Set initial selected option based on scale_value
  useEffect(() => {
    if (scale_value && scale_value.length > 0) {
      const selectedValue = scale_value[0]; // Use the first value from scale_value
      if (options.includes(selectedValue)) {
        setSelectedOption(selectedValue); // Preselect the value if it exists in options
      }
    }
  }, [scale_value, options]);

  // Handle scale change
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

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
      className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3"
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
          <h3 className="group flex text-lg font-semibold text-start">
            <p>
              <span>{index}. </span> {question}
              {is_required && (
                <span className="text-2xl ml-2 text-red-500">*</span>
              )}
            </p>
            {!pathname.includes("survey-public-response") && (
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
            )}
          </h3>
        </div>
        <div className="flex justify-between gap-5 my-2">
          {options?.map((option, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <input
                type="radio"
                id={`likert-${idx}`}
                name={question}
                className="text-[#5B03B2]"
                onChange={handleScaleChange}
                checked={selectedOption === option}
                value={option}
                required={is_required}
              />
              <label htmlFor={`likert-${idx}`} className="mt-1">
                {option}
              </label>
            </div>
          ))}
        </div>
        {pathname === "/surveys/edit-survey" && (
          <div className="flex justify-end gap-4">
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
        {pathname.includes("/edit-submitted-survey") && (
          <div className="flex justify-end gap-4">
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
        {pathname.includes("edit-survey") && (
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
        )}
        <div className="flex justify-end">
          {pathname === "/surveys/edit-survey" ||
          pathname.includes("surveys/question") ? (
            ""
          ) : (
            <p>{questionType === "likert_scale" ? "Likert Scale" : ""}</p>
          )}
        </div>
      </div>
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default LikertScaleQuestion;

