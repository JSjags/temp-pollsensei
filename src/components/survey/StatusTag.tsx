import React from "react";

export interface StatusTagProps {
  type: "close" | "on going" | "draft";
}

const StatusTag: React.FC<StatusTagProps> = ({ type }) => {
  let bg = "";
  let text = "";
  let color = "";

  if (type === "close") {
    text = "Closed";
    bg = "#FFE8D7";
    color = "#931222";
  } else if (type === "on going") {
    text = "On going";
    bg = "#E6FBD9";
    color = "#0F5B1D";
  } else if (type === "draft") {
    text = "Draft";
    bg = "#fafafa";
    color = "#242D35";
  }

  return (
    <div
      style={{ backgroundColor: bg, color }}
      className={`text-[12px] rounded-[12px] w-[69px] h-[24px] flex items-center justify-center px-[10px] pt-[5px] pb-[7px] whitespace-nowrap`}
    >
      {text}
    </div>
  );
};

export default StatusTag;
