import React from "react";

interface ValidatePwdIconProps {
  color: string;
}

const ValidatePwdIcon: React.FC<ValidatePwdIconProps> = ({ color }) => {
  return (
    <div className="flex justify-between items-center bg-[#EEEEEE] w-5 h-5 rounded-full">
      <div
        className="w-3 h-3 rounded-full mx-auto"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default ValidatePwdIcon;
