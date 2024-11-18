"use client";

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
import ShareSurvey from "./ShareSurvey";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams, useRouter } from "next/navigation";
import {
  useCloseSurveyStatusMutation,
  useDeleteSurveyMutation,
  useDuplicateSurveyMutation,
  useEditSurveyMutation,
  useFetchSurveysQuery,
  useShareSurveyQuery,
} from "@/services/survey.service";
import ShareSurveyModal from "./ShareSurveyModal";
import ChangeSurveyStatus from "./ChangeSurveyStatus";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SurveyCardProps {
  topic: string;
  createdAt: string;
  status: string;
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
  const [closeSurvey, setCloseSurvey] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareSurvey, setShareSurvey] = useState(false);
  const params = useParams();
  const [deleteSurvey] = useDeleteSurveyMutation();
  const [closeSurveyStatus, { isLoading: isClosing }] =
    useCloseSurveyStatusMutation();
  const [editSurvey, { isLoading: isEditing }] = useEditSurveyMutation();
  const [duplicateSurvey, { isLoading: isDuplicating }] =
    useDuplicateSurveyMutation();
  const { refetch } = useFetchSurveysQuery(1);
  const [surveyName, setSurveyName] = useState<string>("");

  const router = useRouter();
  const { data, isSuccess: shareSuccess } = useShareSurveyQuery(params.id);
  const shareLink = data?.data?.link;
  const userRoles = useSelector((state: RootState) => state.user.user?.roles[0].role || []);

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
    if (choice.includes("edit")) {
      router.push(`/surveys/edit-submitted-survey/${_id}`);
    }
    if (choice.includes("share")) {
      setShareSurvey(true);
    }
    if (choice.includes("close")) {
      setCloseSurvey(true);
    }
    if (choice.includes("preview")) {
      router.push(`/surveys/question/${_id}`);
    }
  };

  const handleCloseAll = () => {
    setShowDelete(false);
    setShowDuplicate(false);
    setShowRename(false);
    setCloseSurvey(false);
    setShareSurvey(false)
  };

  const handleSetToggle = (op: any) => {
    handleSelectOption(op);
    // setToggle(!toggle);
  };

  const handleDeleteSurvey = async (id: any) => {
    try {
      await deleteSurvey(id).unwrap();
      toast.success("Survey deleted successfully");
      handleCloseAll();
      refetch();
    } catch (e) {
      console.log(e);
      toast.error("Error deleting survey");
    }
  };
  const handleCloseSurvey = async (id: string) => {
    try {
      const result = await closeSurveyStatus({
        id: id,
        body: { status: "Closed" },
      }).unwrap();
      toast.success("Survey closed successfully");
      handleCloseAll();
      refetch();
      console.log("Success:", result);
      setToggle(!toggle);
    } catch (err) {
      toast.error("Failed to close survey");
      console.error("Error:", err);
    }
  };

  const handleRename = async (id: string) => {
    try {
      const result = await editSurvey({
        id: id,
        body: { topic: surveyName },
      }).unwrap();
      toast.success("Survey renamed successfully");
      refetch();
      handleCloseAll();
      console.log("Success:", result);
    } catch (err) {
      toast.error("Failed to rename survey");
      console.error("Error:", err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateSurvey({
        survey_id: id,
      }).unwrap();
      toast.success("Survey duplicated successfully");
      refetch();
      handleCloseAll();
      console.log("Success:", result);
    } catch (err) {
      toast.error("Failed to duplicate survey");
      console.error("Error:", err);
    }
  };

  // console.log(status)

  let bg = "";
  let text = "";
  let color = "";

  if (status === "Closed") {
    text = "Closed";
    bg = "#FFE8D7";
    color = "#931222";
  } else if (status === "On going") {
    text = "On going";
    bg = "#E6FBD9";
    color = "#0F5B1D";
  } else if (status === "Draft") {
    text = "Draft";
    bg = "#fafafa";
    color = "#242D35";
  }

  return (
    <div className="relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-auto sm:h-[314px]">
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <h3 className="text-[16px] sm:text-[20px] text-[#333333] truncate">
            {topic}
          </h3>
          <div
            role="button"
            onClick={handleViewOption}
            className="cursor-pointer shrink-0 hover:bg-gray-100 p-1 flex justify-center items-center rounded-md"
          >
            {
              userRoles.includes("Admin") && 
              <Image
                src={ellipses}
                alt="Options"
                width={24}
                height={24}
                className="shrink-0"
              />
            }
          </div>
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#838383]">
          Created: {formatDate(createdAt)}
        </p>
      </div>

      <div className="mt-3 sm:mt-4">
        <div
          style={{ backgroundColor: bg, color }}
          className={`text-[12px] rounded-[12px] w-[69px] h-[24px] flex items-center justify-center px-[10px] pt-[5px] pb-[7px] whitespace-nowrap`}
        >
          {text}
        </div>
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
            <Link href={`/surveys/question/${_id}`}>
              <Image
                className="cursor-pointer"
                src={eyes}
                alt="View"
                width={24}
                height={24}
              />
            </Link>
            <div className="relative">
              <Image
                className="cursor-pointer shrink-0 size-10"
                src={share}
                alt="Share"
                width={24}
                height={24}
                onClick={() => setShareSurvey((prev) => !prev)}
              />
              {shareSurvey && (
                <div className="absolute right-0 z-50">
                  {/* <ShareSurvey onClick={()=>setShareSurvey((prev)=>!prev)} /> */}
                </div>
              )}
            </div>
          </div>
          <div>
            {
              userRoles.includes("Admin") && 
            <Switch
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-400"
              checked={status === "On going" && true}
              onCheckedChange={() => handleSetToggle("Close")}
            />
            }
          </div>
        </div>
      </div>
      {viewOptions && (
        <div className="absolute right-4 sm:right-8 top-12 sm:top-16 z-50 w-[180px] sm:w-[210px] rounded-[8px] py-[20px] sm:py-[24px] px-[30px] sm:px-[40px] border border-border/50 bg-white shadow-lg">
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
        <DeleteSurvey
          openModal={showDelete}
          onClose={handleCloseAll}
          onDelete={() => handleDeleteSurvey(_id)}
        />
      )}
      {closeSurvey && (
        <ChangeSurveyStatus
          openModal={closeSurvey}
          onClose={handleCloseAll}
          isClosing={isClosing}
          onCloseSurvey={() => {
            handleCloseSurvey(_id);
          }}
        />
      )}
      {showRename && (
        <RenameSurvey
          openModal={showRename}
          onClose={handleCloseAll}
          isEditing={isEditing}
          onRenameSurvey={() => {
            handleRename(_id);
          }}
          surveyName={surveyName}
          setSurveyName={(e) => setSurveyName(e.target.value)}
        />
      )}
      {showDuplicate && (
        <DuplicateSurvey
          openModal={showDuplicate}
          onClose={handleCloseAll}
          isDuplicating={isDuplicating}
          onDuplicatingSurvey={() => handleDuplicate(_id)}
        />
      )}
      {shareSurvey && (
        <ShareSurveyModal
          openModal={shareSurvey}
          onClose={handleCloseAll}
          _id={_id}
        />
      )}
    </div>
  );
};

export default SurveyCard;
