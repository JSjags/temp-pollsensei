import React from "react";

interface ButtonOutlineProps {
  label: string;
  onclick?: () => void;
}

const ButtonOutline: React.FC<ButtonOutlineProps> = ({ label, onclick }) => {
  return (
    <button
      onClick={onclick}
      className="flex items-center justify-center text-[#333333] text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] border-[1px] border-[#333333]"
    >
      {label}
    </button>
  );
};

export default ButtonOutline;
