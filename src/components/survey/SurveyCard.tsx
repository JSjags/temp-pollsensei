import React, { useState } from "react";
import Image from "next/image";
import StatusTag, { StatusTagProps } from "./StatusTag";
import ellipses from "../../assets/images/ellipsisVertical.svg";
import eyes from "../../assets/images/eyes.svg";
import share from "../../assets/images/share.svg";
import RenameSurvey from "./RenameSurvey";
import DeleteSurvey from "./DeleteSurvey";
import DuplicateSurvey from "./DuplicateSurvey";
import { Switch } from "../ui/switch";
import { formatDate } from "@/lib/helpers";
import Button from "../common/Button";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";

interface SurveyCardProps {
  topic: string;
  createdAt: string;
  status: StatusTagProps;
  number_of_responses: number;
  _id: string;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  topic,
  createdAt,
  status,
  number_of_responses,
  _id,
}) => {
  const options = [
    "Rename",
    "Edit Survey",
    "Preview",
    "Share",
    "Make a copy",
    "Close survey",
    "Delete",
  ];
  const [viewOptions, setViewOptions] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleViewOption = () => {
    setViewOptions(!viewOptions);
  };

  const handleSelectOption = (option: string) => {
    setViewOptions(false);
    const choice = option.toLowerCase();

    if (choice.includes("rename")) {
      setShowRename(true);
    }
    if (choice.includes("copy")) {
      setShowDuplicate(true);
    }
    if (choice.includes("delete")) {
      setShowDelete(true);
    }
  };

  const handleCloseAll = () => {
    setShowDelete(false);
    setShowDuplicate(false);
    setShowRename(false);
  };

  const handleSetToggle = () => {
    setToggle(!toggle);
  };

  // const 

  return (
    <div className="relative rounded-[12px] p-4 sm:p-5 border-[1px] w-full max-w-[413px] h-auto sm:h-[314px]">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[16px] sm:text-[20px] text-[#333333] truncate">
            {topic}
          </h3>
          <div onClick={handleViewOption} className="cursor-pointer">
            <Image src={ellipses} alt="Options" width={24} height={24} />
          </div>
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#838383]">
          Created: {formatDate(createdAt)}
        </p>
      </div>

      <div className="mt-3 sm:mt-4">
        <StatusTag type={status.type} />
      </div>

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[24px] sm:text-[32px]">
            {number_of_responses}
          </span>
          <p className="text-[#333333] text-[14px] sm:text-[16px]">responses</p>
        </div>
        <div>
          <Link href={`/surveys/${_id}`}>
            <button className="flex items-center justify-center gap-4 text-white text-[1rem] rounded-md px-[3rem] py-3  bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]">
              View
              <IoEyeOutline size={30} />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6 sm:mt-[42px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              className="cursor-pointer"
              src={eyes}
              alt="View"
              width={24}
              height={24}
            />
            <Image
              className="cursor-pointer"
              src={share}
              alt="Share"
              width={24}
              height={24}
            />
          </div>
          <div>
            <Switch checked={toggle} onCheckedChange={handleSetToggle} />
          </div>
        </div>
      </div>
      {viewOptions && (
        <div className="absolute right-4 sm:right-8 top-12 sm:top-16 z-50 w-[180px] sm:w-[210px] rounded-[8px] py-[20px] sm:py-[24px] px-[30px] sm:px-[40px] bg-white shadow-sm">
          <div className="flex flex-col justify-between h-full">
            {options.map((op, id) => (
              <p
                key={id}
                onClick={() => handleSelectOption(op)}
                className={`${
                  op.toLowerCase() === "delete"
                    ? "text-[#FF3E3E]"
                    : "text-[#333333]"
                } text-[14px] sm:text-[16px] cursor-pointer mb-2 sm:mb-3`}
              >
                {op}
              </p>
            ))}
          </div>
        </div>
      )}
      {showDelete && (
        <DeleteSurvey openModal={showDelete} onClose={handleCloseAll} />
      )}
      {showRename && (
        <RenameSurvey openModal={showRename} onClose={handleCloseAll} />
      )}
      {showDuplicate && (
        <DuplicateSurvey openModal={showDuplicate} onClose={handleCloseAll} />
      )}
    </div>
  );
};

export default SurveyCard;
