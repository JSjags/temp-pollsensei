import React, { ReactNode } from "react";

interface BreadcrumsIconProps {
  color?: string;
  icon?: ReactNode;
}

const BreadcrumsIcon: React.FC<BreadcrumsIconProps> = ({ color, icon }) => {
  return (
    <div className="flex justify-between border items-center bg-[#fff] w-5 h-5 rounded-full">
      <div
        className="w-3 h-3 rounded-full mx-auto"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
    </div>
  );
};

export default BreadcrumsIcon;
