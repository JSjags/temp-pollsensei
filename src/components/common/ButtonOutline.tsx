import React from "react";

interface ButtonOutlineProps {
  label: string;
  onclick?: () => void;
  disabled?: boolean;
}

const ButtonOutline: React.FC<ButtonOutlineProps> = ({
  label,
  onclick,
  disabled,
}) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className="flex items-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed justify-center text-[#333333] text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] border-[1px] border-[#333333]"
    >
      {label}
    </button>
  );
};

export default ButtonOutline;
