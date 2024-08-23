import React from "react";

interface ButtonAutoProps {
  label: string;
  onClick?: () => void;
}

const ButtonAuto: React.FC<ButtonAutoProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-white text-[16px] rounded-[6px] px-[24px] py-[16px] h-[40px] bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
    >
      {label}
    </button>
  );
};

export default ButtonAuto;
