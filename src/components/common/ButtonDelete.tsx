import React from "react";

interface ButtonDeleteProps {
  label: string;
  onclick?: () => void;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ label, onclick }) => {
  return (
    <button
      onClick={onclick}
      className="flex items-center justify-center text-[#fff] text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] bg-[#FF513A]"
    >
      {label}
    </button>
  );
};

export default ButtonDelete;
