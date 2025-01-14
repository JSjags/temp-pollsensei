import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface ButtonProps {
  label: string | ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center text-white text-[16px] min-w-[188px] rounded-[6px] px-[24px] py-[16px] max-h-[52px] !bg-gradient-to-r !from-[#5B03B2] !to-[#9D50BB]",
        className
      )}
    >
      {label}
    </button>
  );
};

export default Button;
