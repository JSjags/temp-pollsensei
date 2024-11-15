// import { draggable } from "@/assets/images";
// import Image from "next/image";
// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { Button } from "../ui/button";
// import { stars } from "@/assets/images";
// import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
// import { BsExclamation } from "react-icons/bs";
// import { Check } from "lucide-react";
// import { Switch } from "../ui/switch";

// interface SliderQuestionProps {
//   question: string;
//   questionType: string;
//   min: number;
//   max: number;
//   step: number;
//   value?: number;
//   onChange?: (value: number) => void;
//   EditQuestion?: () => void;
//   DeleteQuestion?: () => void;
//   setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
//   onSave?: (
//     updatedQuestion: string,
//     updatedMin: number,
//     updatedMax: number,
//     updatedStep: number,
//     aiEditIndex?: number
//   ) => void;
//   index: number;
//   canUseAI?: boolean;
//   status?: string;
//   is_required?: boolean;
//   setIsRequired?: (value: boolean) => void;
// }

// const SliderQuestion: React.FC<SliderQuestionProps> = ({
//   question,
//   min,
//   max,
//   step,
//   value,
//   questionType,
//   EditQuestion,
//   DeleteQuestion,
//   setEditId,
//   index,
//   onChange,
//   onSave,
//   canUseAI = false,
//   status,
//   is_required,
//   setIsRequired,
// }) => {
//   const pathname = usePathname();
//   const questionText = useSelector((state: RootState) => state?.survey?.question_text);
//   const colorTheme = useSelector((state: RootState) => state?.survey?.color_theme);

//   // State to handle slider value
//   const [sliderValue, setSliderValue] = useState<number>(value || min);

//   // Handle slider change
//   const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = parseInt(e.target.value);
//     setSliderValue(newValue);
//     if (onChange) {
//       onChange(newValue);
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
//       className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded"
//       style={{
//         fontFamily: `${questionText?.name}`,
//         fontSize: `${questionText?.size}px`,
//       }}
//     >
//       <Image
//         src={draggable}
//         alt="draggable icon"
//         className={pathname === "/surveys/create-survey" ? "visible" : "invisible"}
//       />
//       <div className="w-full">
//         <div className="flex justify-between w-full items-center">
//           <h3 className="text-lg font-semibold text-start">
//             <div className="group flex justify-between gap-2 items-start">
//               <p>
//                 <span>{index}. </span> {question}
//                 {is_required && <span className="text-2xl ml-2 text-red-500">*</span>}
//               </p>
//               {!pathname.includes("survey-public-response") &&
//                 !pathname.includes("create-survey") && (
//                   <PollsenseiTriggerButton
//                     key={index}
//                     imageUrl={stars}
//                     tooltipText="Rephrase question"
//                     className={"group-hover:inline-block hidden"}
//                     triggerType="rephrase"
//                     question={question}
//                     optionType={questionType}
//                     options={[`${min}-${max}`]}
//                     setEditId={setEditId}
//                     onSave={() => onSave && onSave(question, min, max, step, index)}
//                     index={index}
//                   />
//                 )}
//             </div>
//           </h3>
//         </div>

//         {/* Slider Input */}
//         <div className="flex items-center gap-2 my-2">
//           <label htmlFor={`slider-${index}`} className="text-gray-700">
//             {min}
//           </label>
//           <input
//             type="range"
//             id={`slider-${index}`}
//             name={question}
//             min={min}
//             max={max}
//             step={step}
//             value={sliderValue}
//             onChange={handleSliderChange}
//             className="w-full accent-[#5B03B2]"
//           />
//           <label htmlFor={`slider-${index}`} className="text-gray-700">
//             {max}
//           </label>
//           <span className="ml-2">{sliderValue}</span>
//         </div>

//         {/* Edit and Delete Buttons */}
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

//         {/* Required Toggle */}
//         {pathname.includes("edit-survey") && (
//           <div className="flex items-center gap-4">
//             <span>Required</span>
//             <Switch
//               checked={is_required}
//               onCheckedChange={(checked) => setIsRequired && setIsRequired(checked)}
//               className="bg-[#9D50BB]"
//             />
//           </div>
//         )}
//       </div>

//       {/* Status Indicator */}
//       {pathname.includes("survey-response-upload") && status && (
//         <div>{getStatus(status)}</div>
//       )}
//     </div>
//   );
// };

// export default SliderQuestion;

// import { draggable } from "@/assets/images";
// import Image from "next/image";
// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { stars } from "@/assets/images";
// import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
// import { BsExclamation } from "react-icons/bs";
// import { Check } from "lucide-react";
// import { Switch } from "../ui/switch";

// interface SliderQuestionProps {
//   question: string;
//   questionType: string;
//   min?: number;
//   max?: number;
//   step: number;
//   options?: string[];
//   value?: number;
//   onChange?: (value: number) => void;
//   EditQuestion?: () => void;
//   DeleteQuestion?: () => void;
//   setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
//   onSave?: (
//     updatedQuestion: string,
//     updatedMin: number,
//     updatedMax: number,
//     updatedStep: number,
//     aiEditIndex?: number
//   ) => void;
//   index: number;
//   canUseAI?: boolean;
//   status?: string;
//   is_required?: boolean;
//   setIsRequired?: (value: boolean) => void;
// }

// const SliderQuestion: React.FC<SliderQuestionProps> = ({
//   question,
//   step,
//   options,
//   min = 0,
//   max = options?.length || 7,
//   value,
//   questionType,
//   EditQuestion,
//   DeleteQuestion,
//   setEditId,
//   index,
//   onChange,
//   onSave,
//   canUseAI = false,
//   status,
//   is_required,
//   setIsRequired,
// }) => {
//   const pathname = usePathname();
//   const questionText = useSelector((state: RootState) => state?.survey?.question_text);
//   const colorTheme = useSelector((state: RootState) => state?.survey?.color_theme);

//   // State to handle slider value
//   const [sliderValue, setSliderValue] = useState<number>(value || min);

//   // Handle slider change
//   const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = parseInt(e.target.value);
//     setSliderValue(newValue);
//     if (onChange) {
//       onChange(newValue);
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
//       className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded"
//       style={{
//         fontFamily: `${questionText?.name}`,
//         fontSize: `${questionText?.size}px`,
//       }}
//     >
//       <Image
//         src={draggable}
//         alt="draggable icon"
//         className={pathname === "/surveys/create-survey" ? "visible" : "invisible"}
//       />
//       <div className="w-full">
//         <div className="flex justify-between w-full items-center">
//           <h3 className="text-lg font-semibold text-start">
//             <div className="group flex justify-evenly gap-2 items-start">
//               <p>
//                 <span>{index}. </span> {question}
//                 {is_required && <span className="text-2xl ml-2 text-red-500">*</span>}
//               </p>
//               {!pathname.includes("survey-public-response") &&
//                 !pathname.includes("create-survey") && (
//                   <PollsenseiTriggerButton
//                     key={index}
//                     imageUrl={stars}
//                     tooltipText="Rephrase question"
//                     className={"group-hover:inline-block hidden"}
//                     triggerType="rephrase"
//                     question={question}
//                     optionType={questionType}
//                     options={options || []}
//                     setEditId={setEditId}
//                     onSave={() => onSave && onSave(question, min, max, step, index)}
//                     index={index}
//                   />
//                 )}
//             </div>
//           </h3>
//         </div>

//         {/* Slider Input */}
//         <div className="flex flex-col items-center my-4">
//           <input
//             type="range"
//             min={min}
//             max={max}
//             step={step}
//             value={sliderValue}
//             onChange={handleSliderChange}
//             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B03B2]"
//             style={{
//               background: `linear-gradient(to right, #5B03B2 0%, #5B03B2 ${
//                 ((sliderValue - min) / (max - min)) * 100
//               }%, #e5e7eb ${(sliderValue - min) / (max - min)}%, #e5e7eb 100%)`,
//             }}
//           />
//           <div
//             className=" w-full mt-4 flex justify-between text-sm text-black"
//             // style={{ color: colorTheme }}
//           >
//             {options && options.length === max - min + 1
//               ? options.map((option, i) => (
//                   <span key={i} className="text-center w-[20%]">
//                     {option}
//                   </span>
//                 ))
//               : Array.from({ length: max - min + 1 }, (_, i) => (
//                   <span key={i} className="text-center w-[20%]">
//                     {min + i}
//                   </span>
//                 ))}
//           </div>
//         </div>

//         {/* Edit and Delete Buttons */}
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

//         {/* Required Toggle */}
//         {pathname.includes("edit-survey") && (
//           <div className="flex items-center gap-4">
//             <span>Required</span>
//             <Switch
//               checked={is_required}
//               onCheckedChange={(checked) => setIsRequired && setIsRequired(checked)}
//               className="bg-[#9D50BB]"
//             />
//           </div>
//         )}
//       </div>

//       {/* Status Indicator */}
//       {pathname.includes("survey-response-upload") && status && (
//         <div>{getStatus(status)}</div>
//       )}
//     </div>
//   );
// };

// export default SliderQuestion;

import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { BsExclamation } from "react-icons/bs";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";

interface SliderQuestionProps {
  question: string;
  questionType: string;
  min?: number;
  max?: number;
  options?: string[];
  value?: number;
  onChange?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
  setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
  onSave?: (
    updatedQuestion: string,
    updatedMin: number,
    updatedMax: number,
    aiEditIndex?: number
  ) => void;
  index: number;
  canUseAI?: boolean;
  status?: string;
  is_required?: boolean;
  setIsRequired?: (value: boolean) => void;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  options,
  min,
  max,
  value,
  questionType,
  EditQuestion,
  DeleteQuestion,
  setEditId,
  index,
  onChange,
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

  // Set min, max, and step based on options count if options are provided
  const dynamicMin = options && options.length > 0 ? 0 : min || 0;
  const dynamicMax =
    options && options.length > 0 ? options.length - 1 : max || 5;
  const step =
    options && options.length > 1 ? 1 : (dynamicMax - dynamicMin) / 5;

  // State to handle slider value
  const [sliderValue, setSliderValue] = useState<number>(value || dynamicMin);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
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
      className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3 rounded"
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
          <h3 className="text-lg font-semibold text-start">
            <div className="group flex justify-between gap-2 items-start">
              <p>
                <span>{index}. </span> {question}
                {is_required && (
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
                    options={options || []}
                    setEditId={setEditId}
                    onSave={() =>
                      onSave && onSave(question, dynamicMin, dynamicMax, index)
                    }
                    index={index}
                  />
                )}
            </div>
          </h3>
        </div>

        {/* Slider Input */}
        <div className="flex flex-col items-center my-4">
          <input
            type="range"
            min={dynamicMin}
            max={dynamicMax}
            step={step}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B03B2]"
            style={{
              background: `linear-gradient(to right, #5B03B2 0%, #5B03B2 ${
                ((sliderValue - dynamicMin) / (dynamicMax - dynamicMin)) * 100
              }%, #e5e7eb ${
                (sliderValue - dynamicMin) / (dynamicMax - dynamicMin)
              }%, #e5e7eb 100%)`,
            }}
          />
          <div className="relative w-full mt-4 flex justify-between text-sm 0">
            {options && options.length > 0
              ? options.map((option, i) => (
                  <span key={i} className="text- border w-[20%]">
                    {option}
                  </span>
                ))
              : Array.from({ length: dynamicMax - dynamicMin + 1 }, (_, i) => (
                  <span key={i} className="text-center w-[20%]">
                    {dynamicMin + i}
                  </span>
                ))}
          </div>
        </div>

        {/* Edit and Delete Buttons */}
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

{pathname === "/surveys/add-question-m" && (
          <div className="flex justify-end gap-4">
            {/* <button
              className="bg-transparent border text-[#828282] border-[#828282]  px-5 py-1 rounded-full"
              onClick={EditQuestion}
            >
              Edit
            </button> */}
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
              onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}

        {/* Required Toggle */}
        {pathname.includes("edit-survey") && (
          <div className="flex items-center gap-4">
            <span>Required</span>
            <Switch
              checked={is_required}
              onCheckedChange={(checked) =>
                setIsRequired && setIsRequired(checked)
              }
              className="bg-[#9D50BB]"
            />
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default SliderQuestion;
