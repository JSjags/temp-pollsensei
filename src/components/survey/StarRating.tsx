import { FaStar } from "react-icons/fa";
import { useState } from "react";

const StarRating = ({
  question,
  options,
  handleAnswerChange,
  selectedValue,
  required,
}: {
  question: string;
  options: string[];
  handleAnswerChange: (key: string, value: any) => void;
  selectedValue: string;
  required: boolean;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleStarClick = (index: number) => {
    const selectedOption = options[index];
    handleAnswerChange(question, { scale_value: selectedOption });
  };

  return (
    <div className="flex space-x-2">
      {options.map((_, index) => (
        <FaStar
          key={index}
          size={24}
          className={`cursor-pointer transition-colors duration-150 ${
            index <=
            (hoveredIndex ?? options.findIndex((opt) => opt === selectedValue))
              ? "text-purple-600"
              : "text-gray-300 hover:text-purple-300"
          }`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-required={required}
        />
      ))}
    </div>
  );
};
export default StarRating;
