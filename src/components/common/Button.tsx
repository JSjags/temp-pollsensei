import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-white text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
    >
      {label}
    </button>
  );
};

export default Button;
