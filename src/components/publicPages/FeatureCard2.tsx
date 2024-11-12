import Image from "next/image";
import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  bgColor: string;
}

const FeatureCard2: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  bgColor,
}) => {
  return (
    <div
      className={`flex flex-col items-center px-10 py-6 rounded-lg hover:scale-105 hover:shadow-2xl hover:border-2  transition-all cursor-pointer shadow-md text-center ${bgColor}`}
    >
      <Image src={icon} alt={title} className="w-32 h-48 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default FeatureCard2;
