import React from "react";
import { ClipLoader } from "react-spinners";

interface ButtonDeleteProps {
  label: string;
  onclick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({
  label,
  onclick,
  disabled,
  isLoading,
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      onClick={onclick}
      className="flex transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed items-center justify-center text-[#fff] text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] bg-[#FF513A]"
    >
      {isLoading ? <ClipLoader size={20} /> : label}
    </button>
  );
};

export default ButtonDelete;
