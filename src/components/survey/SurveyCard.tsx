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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Edit2,
  Eye,
  Share2,
  Copy,
  XCircle,
  Trash2,
  MoreVertical,
  Edit,
} from "lucide-react";
import OpenSurvey from "./OpenSurvey";

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
  const [showDelete, setShowDelete] = useState(false);
  const [closeSurvey, setCloseSurvey] = useState(false);
  const [openSurvey, setOpenSurvey] = useState(false);
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
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  const handleSelectOption = (choice: string) => {
    if (choice === "rename") {
      setShowRename(true);
    }
    if (choice === "copy") {
      setShowDuplicate(true);
    }
    if (choice === "delete") {
      setShowDelete(true);
    }
    if (choice === "edit") {
      router.push(`/surveys/edit-submitted-survey/${_id}`);
    }
    if (choice === "share") {
      setShareSurvey(true);
    }
    if (choice === "close") {
      setCloseSurvey(true);
    }
    if (choice === "open") {
      setOpenSurvey(true);
    }
    if (choice === "preview") {
      router.push(`/surveys/question/${_id}`);
    }
  };

  const handleCloseAll = () => {
    setShowDelete(false);
    setShowDuplicate(false);
    setShowRename(false);
    setCloseSurvey(false);
    setOpenSurvey(false);
    setShareSurvey(false);
  };

  const handleSetToggle = (op: any) => {
    handleSelectOption(op);
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

  const handleOpenSurvey = async (id: string) => {
    try {
      const result = await closeSurveyStatus({
        id: id,
        body: { status: "On going" },
      }).unwrap();
      toast.success("Survey opened successfully");
      handleCloseAll();
      refetch();
      console.log("Success:", result);
      setToggle(!toggle);
    } catch (err) {
      toast.error("Failed to open survey");
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
    <div className="bg-white relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-auto sm:h-[314px] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-400">
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <h3 className="text-[16px] sm:text-[20px] text-[#333333] truncate">
            {topic}
          </h3>
          {userRoles.some((role) =>
            ["Admin", "Data Editor"].includes(role)
          ) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreVertical className="h-5 w-5 text-gray-500 hover:text-purple-600 transition-colors duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleSelectOption("rename")}
                  className="gap-2 cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("edit")}
                  className="gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Survey</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("preview")}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("share")}
                  className="gap-2 cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("copy")}
                  className="gap-2 cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  <span>Make a copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("close")}
                  className="gap-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Close survey</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectOption("delete")}
                  className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#838383]">
          Created: {formatDate(createdAt)}
        </p>
      </div>

      <div className="mt-3 sm:mt-4">
        <div
          style={{ backgroundColor: bg, color }}
          className={`text-[12px] rounded-[12px] w-[69px] h-[24px] flex items-center justify-center px-[10px] pt-[5px] pb-[7px] whitespace-nowrap transition-all duration-200 hover:scale-105`}
        >
          {text.split(" ").join("")}
        </div>
      </div>

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[24px] sm:text-[32px] transition-all duration-200 hover:text-purple-600">
            {number_of_responses.toLocaleString()}
          </span>
          <p className="text-[#333333] text-[14px] sm:text-[16px]">responses</p>
        </div>
        <div>
          <Link href={`/surveys/${_id}`}>
            <button className="flex items-center justify-center gap-2 text-white text-[1rem] rounded-md px-6 h-[42px] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] transition-all duration-300 hover:shadow-lg hover:scale-[1-2%] hover:from-[#5B03B2] hover:to-[#9D50BB] active:scale-95">
              View
              <Eye
                size={30}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:rotate-12"
              />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-6 sm:mt-[42px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            {!userRoles.includes("Editor") && (
              <Link href={`/surveys/question/${_id}`}>
                <Image
                  className="cursor-pointer transition-all duration-200 hover:scale-110"
                  src={eyes}
                  alt="View"
                  width={24}
                  height={24}
                />
              </Link>
            )}
            {userRoles.some((role) =>
              ["Admin", "Data Collector"].includes(role)
            ) && (
              <div className="relative">
                <Image
                  className="cursor-pointer shrink-0 size-10 transition-all duration-200 hover:scale-110"
                  src={share}
                  alt="Share"
                  width={24}
                  height={24}
                  onClick={() => setShareSurvey((prev) => !prev)}
                />
                {shareSurvey && <div className="absolute right-0 z-50"></div>}
              </div>
            )}
          </div>
          <div>
            {userRoles.some((role) =>
              ["Admin", "Data Editor"].includes(role)
            ) && (
              <Switch
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#5B03B2] data-[state=checked]:to-[#9D50BB] data-[state=unchecked]:bg-gray-400 transition-colors duration-200"
                checked={status === "On going" && true}
                onCheckedChange={() => {
                  if (status === "On going") {
                    handleSetToggle("close");
                  }
                  if (status === "Closed") {
                    handleSetToggle("open");
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      <DeleteSurvey
        openModal={showDelete}
        onClose={handleCloseAll}
        onDelete={() => handleDeleteSurvey(_id)}
      />
      <ChangeSurveyStatus
        openModal={closeSurvey}
        onClose={handleCloseAll}
        isClosing={isClosing}
        onCloseSurvey={() => {
          handleCloseSurvey(_id);
        }}
      />
      <OpenSurvey
        openModal={openSurvey}
        onClose={handleCloseAll}
        isOpening={isClosing}
        onOpenSurvey={() => {
          handleOpenSurvey(_id);
        }}
      />
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
      <DuplicateSurvey
        openModal={showDuplicate}
        onClose={handleCloseAll}
        isDuplicating={isDuplicating}
        onDuplicatingSurvey={() => handleDuplicate(_id)}
      />
      <ShareSurveyModal
        openModal={shareSurvey}
        onClose={handleCloseAll}
        _id={_id}
      />
    </div>
  );
};

export default SurveyCard;
