import { FaStar } from "react-icons/fa";

const StarRating = ({
  question,
  options,
  handleAnswerChange,
  selectedValue,
  required
}: {
  question: string;
  options: string[];
  handleAnswerChange: (key: string, value: any) => void;
  selectedValue: string;
  required: boolean;
}) => {
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
          className={`cursor-pointer ${
            options[index] === selectedValue
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => handleStarClick(index)}
          aria-required={required}
        />
      ))}
    </div>
  );
};
export default StarRating;