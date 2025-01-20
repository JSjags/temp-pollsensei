import React from "react";

interface ButtonAutoProps {
  label: string;
  onClick?: () => void;
}

const ButtonAuto: React.FC<ButtonAutoProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-white text-base rounded-lg px-[24px] h-10 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
    >
      {label}
    </button>
  );
};

export default ButtonAuto;
