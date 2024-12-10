// import Image from "next/image";
// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import { FaStar } from "react-icons/fa";
// import { draggable, stars } from "@/assets/images";
// import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";

// interface StarRatingQuestionProps {
//   question: string;
//   questionType: string;
//   maxRating?: number;
//   currentRating?: number;
//   onRate?: (value: number) => void;
//   EditQuestion?: () => void;
//   DeleteQuestion?: () => void;
//   index?: number;
//   options?: string[];
//   setEditId?: React.Dispatch<React.SetStateAction<number | null>>;
//   onSave?: (
//     updatedQuestion: string,
//     updatedOptions: string[],
//     updatedQuestionType: string,
//     aiEditIndex?: number
//   ) => void;
// }

// const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
//   question,
//   questionType,
//   maxRating = 5,
//   currentRating = 0,
//   onRate,
//   EditQuestion,
//   DeleteQuestion,
//   index,
//   setEditId,
//   options,
//   onSave,
// }) => {
//   const pathname = usePathname();
//   const [hoveredRating, setHoveredRating] = useState<number | null>(null);
//   const [selectedRating, setSelectedRating] = useState<number>(currentRating);

//   // Handle rating selection
//   const handleRate = (rating: number) => {
//     setSelectedRating(rating);
//     if (onRate) {
//       onRate(rating);
//     }
//   };

//   return (
//     <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
//       <Image
//         src={draggable}
//         alt="draggable icon"
//         className={
//           pathname === "/surveys/edit-survey" ||
//           pathname === "surveys/preview-survey"
//             ? "invisible"
//             : "visible"
//         }
//       />
//       <div className="w-full">
//         <div className="flex justify-between w-full items-center">
//           <h3 className="group text-lg font-semibold text-start">
//             {question}{" "}
//             <PollsenseiTriggerButton
//               key={index}
//               imageUrl={stars}
//               tooltipText="Rephrase question"
//               className={"group-hover:inline-block hidden"}
//               triggerType="rephrase"
//               question={question}
//               optionType={questionType!}
//               options={options}
//               setEditId={setEditId}
//               onSave={onSave!}
//               index={index!}
//             />
//           </h3>
//           {pathname === "/surveys/edit-survey" ||
//           pathname.includes("surveys/question") ? (
//             ""
//           ) : (
//             <p>{questionType}</p>
//           )}
//         </div>
//         <div className="flex items-center my-2">
//           {Array.from({ length: maxRating }, (_, index) => (
//             <FaStar
//               key={index}
//               size={24}
//               className={`mr-1 cursor-pointer ${
//                 (hoveredRating !== null ? hoveredRating : selectedRating) >
//                 index
//                   ? "text-[#5B03B2]"
//                   : "text-gray-300"
//               }`}
//               onMouseEnter={() => setHoveredRating(index + 1)}
//               onMouseLeave={() => setHoveredRating(null)}
//               onClick={() => handleRate(index + 1)}
//             />
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
//       </div>
//     </div>
//   );
// };

// export default StarRatingQuestion;

import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { draggable, stars } from "@/assets/images";
import PollsenseiTriggerButton from "../ui/pollsensei-trigger-button";
import { Check } from "lucide-react";
import { BsExclamation } from "react-icons/bs";
import { Switch } from "../ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface StarRatingQuestionProps {
  question: string;
  questionType: string;
  options?: string[];
  currentRating?: number;
  onRate?: (value: number) => void;
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

const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
  question,
  options = ["1 star", "2 star", "3 star", "4 star", "5 star"],
  questionType,
  currentRating = 0,
  onRate,
  EditQuestion,
  DeleteQuestion,
  index,
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
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(currentRating);

  // Handle rating selection
  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    if (onRate) {
      onRate(rating);
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
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3"
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
          <h3 className="group text-lg font-semibold text-start">
            <p>
              <span>{index}. </span> {question}
              {is_required === true && (
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
                optionType={questionType}
                options={options}
                setEditId={setEditId}
                onSave={onSave!}
                index={index!}
              />
            )}
          </h3>
     
        </div>
        <div className="flex items-center my-2">
          {options.map((_, idx) => (
            <FaStar
              key={idx}
              size={24}
              className={`mr-1 cursor-pointer ${
                (hoveredRating !== null ? hoveredRating : selectedRating) > idx
                  ? "text-[#5B03B2]"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(idx + 1)}
              onMouseLeave={() => setHoveredRating(null)}
              onClick={() => handleRate(idx + 1)}
            />
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
                {pathname === "/surveys/add-question-m" && (
          <div className="flex justify-end gap-4">
          
            <button
              className="text-red-500 bg-whte px-5 border border-red-500 py-1 rounded-full"
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
            <p>{questionType === "star_rating" ? "Star Rating" : ""}</p>
          )}
        </div>
      </div>
      {pathname.includes("survey-response-upload") && status && (
        <div>{getStatus(status)}</div>
      )}
    </div>
  );
};

export default StarRatingQuestion;

// import { draggable } from "@/assets/images";
// import Image from "next/image";
// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import { FaStar } from "react-icons/fa";

// interface StarRatingQuestionProps {
//   question: string;
//   questionType: string;
//   maxRating: number; // Max value, still 5 (whole stars)
//   currentRating?: number; // Current rating (default 0)
//   onRate?: (value: number) => void; // Function to handle rating
//   EditQuestion?: () => void; // Edit callback
//   DeleteQuestion?: () => void; // Delete callback
// }

// const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
//   question,
//   questionType,
//   maxRating,
//   currentRating = 0,
//   onRate,
//   EditQuestion,
//   DeleteQuestion
// }) => {
//   const pathname = usePathname();
//   const [hoveredRating, setHoveredRating] = useState<number | null>(null);

//   const handleRate = (rating: number) => {
//     if (onRate) {
//       onRate(rating); // Call the onRate callback when a star is clicked
//     }
//   };

//   // Function to determine the color of the stars, including half-stars
//   const getStarColor = (index: number) => {
//     const ratingToCompare = hoveredRating !== null ? hoveredRating : currentRating;
//     if (ratingToCompare >= index + 1) {
//       return "text-[#5B03B2]"; // Full star
//     } else if (ratingToCompare >= index + 0.5) {
//       return "text-[#5B03B2]"; // Half star
//     }
//     return "text-gray-300"; // Empty star
//   };

//   return (
//     <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
//       <Image src={draggable} alt="draggable icon" className={pathname === "/surveys/edit-survey" || pathname === 'surveys/preview-survey' ? "invisible" : "visible"} />
//       <div className="w-full">
//         <div className="flex justify-between w-full items-center">
//           <h3 className="text-lg font-semibold text-start">{question}</h3>
//           {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
//         </div>
//         <div className="flex items-center my-2">
//           {/* Render stars with support for half-stars */}
//           {Array.from({ length: maxRating * 2 }, (_, index) => (
//             <FaStar
//               key={index}
//               size={24}
//               className={`mr-1 cursor-pointer ${getStarColor(index / 2)}`}
//               onMouseEnter={() => setHoveredRating((index + 1) / 2)} // Half-step hover
//               onMouseLeave={() => setHoveredRating(null)}
//               onClick={() => handleRate((index + 1) / 2)} // Half-step selection
//             />
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
//       </div>
//     </div>
//   );
// };

// export default StarRatingQuestion;
