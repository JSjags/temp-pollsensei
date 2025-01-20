"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Pencil,
  Edit,
  Eye,
  Share2,
  Copy,
  XCircle,
  Trash2,
  MoreVertical,
  PlayCircle,
} from "lucide-react";

import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import eyes from "../../assets/images/eyes.svg";
import share from "../../assets/images/share.svg";

import RenameSurvey from "./RenameSurvey";
import DeleteSurvey from "./DeleteSurvey";
import DuplicateSurvey from "./DuplicateSurvey";
import ShareSurveyModal from "./ShareSurveyModal";
import ChangeSurveyStatus from "./ChangeSurveyStatus";
import OpenSurvey from "./OpenSurvey";

import { formatDate } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import {
  useCloseSurveyStatusMutation,
  useDeleteSurveyMutation,
  useDuplicateSurveyMutation,
  useEditSurveyMutation,
  useFetchSurveysQuery,
} from "@/services/survey.service";

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
  const [modalStates, setModalStates] = useState({
    delete: false,
    close: false,
    open: false,
    rename: false,
    duplicate: false,
    share: false,
  });

  const [surveyName, setSurveyName] = useState<string>("");

  const router = useRouter();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  const { refetch } = useFetchSurveysQuery(1);
  const [deleteSurvey] = useDeleteSurveyMutation();
  const [closeSurveyStatus, { isLoading: isClosing }] =
    useCloseSurveyStatusMutation();
  const [editSurvey, { isLoading: isEditing }] = useEditSurveyMutation();
  const [duplicateSurvey, { isLoading: isDuplicating }] =
    useDuplicateSurveyMutation();

  const handleCloseAll = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.pointerEvents = "all";

    setModalStates({
      delete: false,
      close: false,
      open: false,
      rename: false,
      duplicate: false,
      share: false,
    });
  }, []);

  const handleSelectOption = useCallback(
    (choice: string) => {
      const actions: Record<string, () => void> = {
        rename: () => setModalStates((prev) => ({ ...prev, rename: true })),
        copy: () => setModalStates((prev) => ({ ...prev, duplicate: true })),
        delete: () => setModalStates((prev) => ({ ...prev, delete: true })),
        edit: () => router.push(`/surveys/edit-submitted-survey/${_id}`),
        share: () => setModalStates((prev) => ({ ...prev, share: true })),
        close: () => setModalStates((prev) => ({ ...prev, close: true })),
        open: () => setModalStates((prev) => ({ ...prev, open: true })),
        preview: () => router.push(`/surveys/question/${_id}`),
      };

      actions[choice]?.();
    },
    [_id, router]
  );

  const handleStatusChange = useCallback(
    async (newStatus: "Closed" | "On going") => {
      try {
        await closeSurveyStatus({
          id: _id,
          body: { status: newStatus },
        }).unwrap();

        toast.success(`Survey ${newStatus.toLowerCase()} successfully`);
        handleCloseAll();
        refetch();
      } catch (err) {
        toast.error(`Failed to ${newStatus.toLowerCase()} survey`);
        console.error("Error:", err);
      }
    },
    [_id, closeSurveyStatus, handleCloseAll, refetch]
  );

  const handleRename = useCallback(async () => {
    try {
      await editSurvey({
        id: _id,
        body: { topic: surveyName },
      }).unwrap();

      toast.success("Survey renamed successfully");
      handleCloseAll();
      refetch();
    } catch (err) {
      toast.error("Failed to rename survey");
      console.error("Error:", err);
    }
  }, [_id, surveyName, editSurvey, handleCloseAll, refetch]);

  const handleDuplicate = useCallback(async () => {
    try {
      await duplicateSurvey({
        survey_id: _id,
      }).unwrap();

      toast.success("Survey duplicated successfully");
      handleCloseAll();
      refetch();
    } catch (err) {
      toast.error("Failed to duplicate survey");
      console.error("Error:", err);
    }
  }, [_id, duplicateSurvey, handleCloseAll, refetch]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteSurvey(_id).unwrap();
      toast.success("Survey deleted successfully");
      handleCloseAll();
      refetch();
    } catch (err) {
      toast.error("Error deleting survey");
      console.error(err);
    }
  }, [_id, deleteSurvey, handleCloseAll, refetch]);

  const statusStyles = {
    Closed: {
      text: "Closed",
      bg: "#FFE8D7",
      color: "#931222",
    },
    "On going": {
      text: "On going",
      bg: "#E6FBD9",
      color: "#0F5B1D",
    },
    Draft: {
      text: "Draft",
      bg: "#fafafa",
      color: "#242D35",
    },
  }[status];

  const isAdmin = userRoles.some((role) =>
    ["Admin", "Data Editor"].includes(role)
  );
  const isDataCollector = userRoles.some((role) =>
    ["Admin", "Data Collector"].includes(role)
  );
  const isEditor = userRoles.includes("Editor");

  return (
    <>
      <div className="bg-white relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-auto sm:h-[314px] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-400">
        <div>
          <div className="flex justify-between items-center mb-1 gap-2">
            <h3 className="text-[16px] sm:text-[20px] text-[#333333] truncate">
              {topic}
            </h3>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <MoreVertical className="h-5 w-5 text-gray-500 hover:text-purple-600 transition-colors duration-200" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {[
                    { label: "Rename", icon: Pencil, action: "rename" },
                    { label: "Edit Survey", icon: Edit, action: "edit" },
                    { label: "Preview", icon: Eye, action: "preview" },
                    { label: "Share", icon: Share2, action: "share" },
                    { label: "Make a copy", icon: Copy, action: "copy" },
                    status === "On going"
                      ? {
                          label: "Close survey",
                          icon: XCircle,
                          action: "close",
                        }
                      : {
                          label: "Open survey",
                          icon: PlayCircle,
                          action: "open",
                        },
                    {
                      label: "Delete",
                      icon: Trash2,
                      action: "delete",
                      className:
                        "text-red-600 focus:text-red-600 focus:bg-red-50",
                    },
                  ].map(({ label, icon: Icon, action, className }) => (
                    <DropdownMenuItem
                      key={action}
                      onClick={() => handleSelectOption(action)}
                      className={`gap-2 cursor-pointer ${className || ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </DropdownMenuItem>
                  ))}
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
            style={{
              backgroundColor: statusStyles?.bg,
              color: statusStyles?.color,
            }}
            className="text-[12px] rounded-[12px] w-[69px] h-[24px] flex items-center justify-center px-[10px] pt-[5px] pb-[7px] whitespace-nowrap transition-all duration-200 hover:scale-105"
          >
            {statusStyles?.text.split(" ").join("")}
          </div>
        </div>

        <div className="mt-6 sm:mt-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[24px] sm:text-[32px] transition-all duration-200 hover:text-purple-600">
              {number_of_responses.toLocaleString()}
            </span>
            <p className="text-[#333333] text-[14px] sm:text-[16px]">
              responses
            </p>
          </div>
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

        <div className="mt-6 sm:mt-[42px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              {!isEditor && (
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
              {isDataCollector && (
                <div className="relative">
                  <Image
                    className="cursor-pointer shrink-0 size-10 transition-all duration-200 hover:scale-110"
                    src={share}
                    alt="Share"
                    width={24}
                    height={24}
                    onClick={() =>
                      setModalStates((prev) => ({ ...prev, share: true }))
                    }
                  />
                </div>
              )}
            </div>
            {isAdmin && (
              <Switch
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#5B03B2] data-[state=checked]:to-[#9D50BB] data-[state=unchecked]:bg-gray-400 transition-colors duration-200"
                checked={status === "On going"}
                onCheckedChange={() => {
                  handleSelectOption(status === "On going" ? "close" : "open");
                }}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteSurvey
        openModal={modalStates.delete}
        onClose={handleCloseAll}
        onDelete={handleDelete}
      />
      <ChangeSurveyStatus
        openModal={modalStates.close}
        onClose={handleCloseAll}
        isClosing={isClosing}
        onCloseSurvey={() => handleStatusChange("Closed")}
      />
      <OpenSurvey
        openModal={modalStates.open}
        onClose={handleCloseAll}
        isOpening={isClosing}
        onOpenSurvey={() => handleStatusChange("On going")}
      />
      <RenameSurvey
        openModal={modalStates.rename}
        onClose={handleCloseAll}
        isEditing={isEditing}
        onRenameSurvey={handleRename}
        surveyName={surveyName}
        setSurveyName={(e) => setSurveyName(e.target.value)}
      />
      <DuplicateSurvey
        openModal={modalStates.duplicate}
        onClose={handleCloseAll}
        isDuplicating={isDuplicating}
        onDuplicatingSurvey={handleDuplicate}
      />
      <ShareSurveyModal
        openModal={modalStates.share}
        onClose={handleCloseAll}
        _id={_id}
      />
    </>
  );
};

export default SurveyCard;
