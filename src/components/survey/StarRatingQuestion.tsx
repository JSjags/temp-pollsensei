import { draggable } from "@/assets/images";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaStar } from "react-icons/fa";

interface StarRatingQuestionProps {
  question: string;
  questionType: string;
  maxRating: number; 
  currentRating?: number; 
  onRate?: (value: number) => void;
  EditQuestion?: () => void;
  DeleteQuestion?: () => void;
}

const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
  question,
  questionType,
  maxRating,
  currentRating = 0,
  onRate,
  EditQuestion,
  DeleteQuestion
}) => {
  const pathname = usePathname();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleRate = (rating: number) => {
    if (onRate) {
      onRate(rating);
    }
  };

  return (
    <div className="mb-4 bg-[#FAFAFA] flex items-center w-full p-3 gap-3">
      <Image src={draggable} alt="draggable icon" />
      <div className="w-full">
        <div className="flex justify-between w-full items-center">
          <h3 className="text-lg font-semibold text-start">{question}</h3>
          {pathname === "/surveys/edit-survey" ? "" : <p>{questionType}</p>}
        </div>
        <div className="flex items-center my-2">
          {Array.from({ length: maxRating }, (_, index) => (
            <FaStar
              key={index}
              size={24}
              className={`mr-1 cursor-pointer ${
                (hoveredRating !== null ? hoveredRating : currentRating) > index
                  ? "text-[#5B03B2]"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(index + 1)}
              onMouseLeave={() => setHoveredRating(null)}
              onClick={() => handleRate(index + 1)}
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
            <button className="text-red-500 bg-white px-5 border border-red-500 py-1 rounded-full"
            onClick={DeleteQuestion}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarRatingQuestion;
