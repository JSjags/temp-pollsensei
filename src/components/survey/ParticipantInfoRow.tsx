"use client";
import React, { FC } from "react";

interface InfoRowProps {
  label: string;
  value: string | string[];
}

const ParticipantInfoRow: FC<InfoRowProps> = ({ label, value }) => {
  const renderArrayValue = (arr: string[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-[#F7F3FC] rounded-lg text-[#333333] text-xs capitalize"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderCommaSeparated = (arr: string[]) => {
    return arr.join(", ");
  };

  return (
    <div className="flex-1 flex justify-between items-center">
      <p className="text-[#A3A3A3] text-xs capitalize">{label}</p>
      <p className="text-[#3A3D5B] text-xs capitalize lg:max-w-1/2 flex items-center flex-wrap">
        {value === undefined || value === null ? (
          "---"
        ) : Array.isArray(value) ? (
          label.toLowerCase() === "gadgets" ||
          label.toLowerCase() === "social media platforms" ? (
            renderArrayValue(value)
          ) : (
            renderCommaSeparated(value)
          )
        ) : typeof value === "string" ? (
          <>
            {label === "income range" && "$"}
            {value.replace(/_/g, " ")}
            {label === "Age Group" && "yrs"}
            {label === "Average Hours of sleep per night" && "hours"}
          </>
        ) : (
          value
        )}
      </p>
    </div>
  );
};

export default ParticipantInfoRow;
