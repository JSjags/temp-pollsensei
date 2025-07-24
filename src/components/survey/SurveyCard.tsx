"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  Cog,
  Check,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

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
  useShareSurveyQuery,
} from "@/services/survey.service";
import { Button } from "../ui/button";
import { Spinner } from "../loaders/page-loaders/AnalysisPageLoader";

interface SurveyCardProps {
  topic: string;
  createdAt: string;
  status: string;
  number_of_responses: number;
  _id: string;
  index: number;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  topic,
  createdAt,
  status,
  number_of_responses,
  _id,
  index,
}) => {
  const [modalStates, setModalStates] = useState({
    delete: false,
    close: false,
    open: false,
    rename: false,
    duplicate: false,
    share: false,
  });

  const [surveyName, setSurveyName] = useState<string>(topic);

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
  const { data: shareData } = useShareSurveyQuery(_id);

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
        link: () => router.push(`/surveys/${_id}/settings`),
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
      <div className="bg-white relative rounded-[12px] border-[1px] w-full max-w-[720px] h-auto sm:h-fit transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-purple-400">
        <div className="">
          <div
            style={{
              backgroundColor: statusStyles?.bg,
              color: statusStyles?.color,
            }}
            className="text-[12px] rounded-br-[12px] rounded-tl-[12px] w-[69px] h-[24px] flex items-center justify-center px-[10px] pt-[5px] pb-[7px] whitespace-nowrap transition-all duration-200 hover:scale-105"
          >
            {statusStyles?.text.split(" ").join("")}
          </div>
        </div>
        <div className="p-3 sm:p-4">
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
                      label: "Settings",
                      icon: Cog,
                      action: "link",
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

        <div className="mt-6 sm:mt-10 flex justify-between items-center px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="text-[24px] sm:text-[32px] transition-all duration-200 hover:text-purple-600">
              {number_of_responses.toLocaleString()}
            </span>
            <p className="text-[#333333] text-[14px] sm:text-[16px]">
              {number_of_responses > 1 ? "responses" : "response"}
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

        <div className="mt-6 px-3 sm:px-4">
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 sm:gap-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 !gap-x-1 w-full sm:w-auto">
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
              {/* {isDataCollector && ( */}
              <div className="relative flex items-center gap-2 gap-x-0">
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
              {/* )} */}
            </div>
            {isAdmin && (
              <div className="w-full sm:w-auto flex justify-end sm:justify-normal mt-2 sm:mt-0">
                <Switch
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#5B03B2] data-[state=checked]:to-[#9D50BB] data-[state=unchecked]:bg-gray-400 transition-colors duration-200"
                  checked={status === "On going"}
                  onCheckedChange={() => {
                    handleSelectOption(
                      status === "On going" ? "close" : "open"
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <WhatsAppShareAndCopy
          _id={_id}
          whatsappUrl={shareData?.data?.whatsapp_link}
        />
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

const WhatsAppShareAndCopy: React.FC<{
  _id: string;
  whatsappUrl: string | undefined;
}> = ({ _id, whatsappUrl }) => {
  const { data: share, isLoading } = useShareSurveyQuery(_id);
  const [copied, setCopied] = useState(false);
  const shareLink = whatsappUrl;

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  return (
    <>
      <div
        className="relative p-3 sm:py-2 rounded-b-lg overflow-hidden h-full"
        style={{ background: "#103113" }}
      >
        <svg
          width="413"
          height="80"
          viewBox="0 0 413 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="none"
        >
          <g clipPath="url(#clip0_15964_58331)">
            <rect width="413" height="80" fill="#103113" />
            <g opacity="0.2">
              <mask
                id="mask0_15964_58331"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="297"
                y="31"
                width="131"
                height="84"
              >
                <path
                  d="M297.277 115L297.262 50.2978C297.26 43.7192 297.259 40.43 298.539 37.917C299.664 35.7066 301.461 33.9092 303.671 32.7825C306.183 31.5016 309.472 31.5008 316.051 31.4992L408.956 31.4765C415.535 31.4749 418.824 31.4741 421.337 32.7537C423.548 33.8793 425.345 35.6758 426.472 37.8857C427.752 40.3981 427.753 43.6873 427.755 50.2658L427.771 114.968L297.277 115Z"
                  fill="#6746F6"
                />
              </mask>
              <g mask="url(#mask0_15964_58331)">
                {/* ... SVG paths omitted for brevity, paste all the <path> elements here ... */}
                {/* For brevity, you can paste all the <path> elements from your SVG here */}
              </g>
            </g>
            <g opacity="0.2">
              <mask
                id="mask1_15964_58331"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="-56"
                width="131"
                height="84"
              >
                <path
                  d="M0.0214844 28L0.00565731 -36.7022C0.00404812 -43.2808 0.00324352 -46.57 1.28289 -49.083C2.4085 -51.2934 4.205 -53.0908 6.41492 -54.2175C8.92726 -55.4984 12.2165 -55.4992 18.795 -55.5008L111.7 -55.5235C118.279 -55.5251 121.568 -55.5259 124.081 -54.2463C126.292 -53.1207 128.089 -51.3242 129.216 -49.1143C130.497 -46.6019 130.497 -43.3127 130.499 -36.7342L130.515 27.9681L0.0214844 28Z"
                  fill="#6746F6"
                />
              </mask>
              <g mask="url(#mask1_15964_58331)">
                {/* ... SVG paths omitted for brevity, paste all the <path> elements here ... */}
                {/* For brevity, you can paste all the <path> elements from your SVG here */}
              </g>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_15964_58331">
              <rect width="413" height="80" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <svg
          width="131"
          height="28"
          viewBox="0 0 131 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 -translate-y-1/4 pointer-events-none"
        >
          <g opacity="0.2">
            <mask
              id="mask0_15964_58574"
              mask-type="alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="-56"
              width="131"
              height="84"
            >
              <path
                d="M0.0214844 28L0.00565731 -36.7022C0.00404812 -43.2808 0.00324352 -46.57 1.28289 -49.083C2.4085 -51.2934 4.205 -53.0908 6.41492 -54.2175C8.92726 -55.4984 12.2165 -55.4992 18.795 -55.5008L111.7 -55.5235C118.279 -55.5251 121.568 -55.5259 124.081 -54.2463C126.292 -53.1207 128.089 -51.3242 129.216 -49.1143C130.497 -46.6019 130.497 -43.3127 130.499 -36.7342L130.515 27.9681L0.0214844 28Z"
                fill="#6746F6"
              />
            </mask>
            <g mask="url(#mask0_15964_58574)">
              <path
                d="M3.68695 -32.6921L33.2327 -2.36327L28.8573 2.13243L24.4867 6.62813L20.1114 11.119L15.7361 15.6147L3.6956 3.24534L-8.34364 15.6207L-25.8442 -2.3486L3.68695 -32.6921Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-21.472 2.14602L-12.7217 11.1282L-8.34423 15.6217L3.69029 3.24643L15.7355 15.6158L20.1108 11.1201L28.8568 2.13351L3.6838 -23.7067L-21.472 2.14602Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-17.094 6.64063L-12.7212 11.1293L-8.34369 15.6228L3.69083 3.24752L15.736 15.6168L20.1114 11.1211L24.482 6.6303L3.68177 -14.7212L-17.094 6.64063Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-12.7198 11.1304L-8.34234 15.6239L3.69219 3.24861L15.7374 15.6179L20.1127 11.1222L3.69002 -5.73576L-12.7198 11.1304Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M3.69448 3.25036L15.735 15.6197L11.3644 20.1105L3.70043 27.9853L-8.34477 15.6257L3.69448 3.25036Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M3.69336 3.24609L3.6912 -5.73828L3.68903 -14.7226L3.68687 -23.707L3.6847 -32.6914"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-25.8538 -2.33757L-21.4762 2.15112L-12.726 11.1333L-8.34844 15.6269L3.69209 27.9914L-55.3848 28.0059L-47.7162 20.1263L-43.3456 15.6355L-38.9703 11.1398L-25.8538 -2.33757Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M33.2284 -2.35526L37.6059 2.13341L41.9834 6.62694L46.3561 11.1156L50.7336 15.6091L62.7741 27.9736L3.69727 27.9883L15.7365 15.6178L20.1118 11.1221L33.2284 -2.35526Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M12.4453 27.9883L54.0354 27.9779L33.2352 6.62643L12.4453 27.9883Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M21.1914 27.9883L45.2948 27.9823L33.2496 15.613L21.1914 27.9883Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M29.9336 27.9785L36.5502 27.9769L33.2411 24.58L29.9336 27.9785Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M33.2271 -2.35769L33.2292 6.62183L33.2314 15.6062L33.2336 24.5906L33.2344 27.9785"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7612 -32.7058L92.3069 -2.37694L87.9316 2.11876L83.5562 6.61446L79.1856 11.1053L74.8103 15.601L62.7698 3.23167L50.7306 15.607L33.23 -2.36226L62.7612 -32.7058Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M37.6042 2.12844L41.9817 6.62196L46.3544 11.1106L50.7319 15.6042L62.7665 3.22885L74.8117 15.5982L79.187 11.1025L87.9329 2.11594L62.76 -23.7243L37.6042 2.12844Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M41.9822 6.62305L46.355 11.1117L50.7325 15.6052L62.767 3.22994L74.8122 15.5993L79.1875 11.1036L83.5582 6.61272L62.7579 -14.7388L41.9822 6.62305Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M46.3544 11.1128L50.7319 15.6063L62.7664 3.23103L74.8116 15.6004L79.1869 11.1047L62.7642 -5.75334L46.3544 11.1128Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7707 3.23279L74.8111 15.6021L70.4405 20.093L62.7766 27.9677L50.7314 15.6081L62.7707 3.23279Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7715 3.23438L62.7693 -5.74999L62.7672 -14.7344L62.765 -23.7187L62.7628 -32.7031"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.841 -32.7195L151.387 -2.39062L147.012 2.10508L142.636 6.60078L138.266 11.0916L133.89 15.5873L121.85 3.218L109.811 15.5933L92.3101 -2.37594L121.841 -32.7195Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M96.6843 2.11477L101.062 6.60829L105.435 11.097L109.812 15.5905L121.847 3.21518L133.892 15.5845L138.267 11.0888L147.013 2.10226L121.84 -23.7379L96.6843 2.11477Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M101.06 6.60938L105.433 11.0981L109.811 15.5916L121.845 3.21627L133.89 15.5856L138.266 11.0899L142.636 6.59905L121.836 -14.7525L101.06 6.60938Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M105.433 11.0991L109.81 15.5927L121.845 3.21736L133.89 15.5867L138.265 11.091L121.842 -5.76701L105.433 11.0991Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.847 3.21521L133.887 15.5845L129.517 20.0754L121.853 27.9501L109.808 15.5905L121.847 3.21521Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.848 3.2168L121.845 -5.76757L121.843 -14.7519L121.841 -23.7363L121.839 -32.7207"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M92.3026 -2.37284L96.6801 2.11583L101.058 6.60936L105.43 11.098L109.808 15.5916L121.848 27.956L62.7715 27.9707L74.8107 15.6002L79.1861 11.1046L92.3026 -2.37284Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M71.5195 27.9707L113.11 27.9604L92.3094 6.60885L71.5195 27.9707Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M80.2695 27.9668L104.373 27.9608L92.3277 15.5915L80.2695 27.9668Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M89.0117 27.9668L95.6283 27.9652L92.3192 24.5683L89.0117 27.9668Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M92.3032 -2.37917L92.3054 6.60035L92.3076 15.5847L92.3097 24.5691L92.3105 27.957"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M151.381 -2.39041L155.758 2.09826L160.136 6.59178L164.509 11.0805L168.886 15.574L180.926 27.9384L121.85 27.9531L133.889 15.5827L138.264 11.087L151.381 -2.39041Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M130.598 27.9531L172.188 27.9428L151.388 6.59127L130.598 27.9531Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-55.4441 -214.684L-55.3848 28.0059L180.923 27.948L180.863 -214.742L-55.4441 -214.684Z"
                stroke="white"
                stroke-width="0.592671"
                stroke-miterlimit="10"
              />
            </g>
          </g>
        </svg>
        <svg
          width="131"
          height="28"
          viewBox="0 0 131 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0 bottom-0 pointer-events-none"
        >
          <g opacity="0.2">
            <mask
              id="mask0_15964_58574"
              mask-type="alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="-56"
              width="131"
              height="84"
            >
              <path
                d="M0.0214844 28L0.00565731 -36.7022C0.00404812 -43.2808 0.00324352 -46.57 1.28289 -49.083C2.4085 -51.2934 4.205 -53.0908 6.41492 -54.2175C8.92726 -55.4984 12.2165 -55.4992 18.795 -55.5008L111.7 -55.5235C118.279 -55.5251 121.568 -55.5259 124.081 -54.2463C126.292 -53.1207 128.089 -51.3242 129.216 -49.1143C130.497 -46.6019 130.497 -43.3127 130.499 -36.7342L130.515 27.9681L0.0214844 28Z"
                fill="#6746F6"
              />
            </mask>
            <g mask="url(#mask0_15964_58574)">
              <path
                d="M3.68695 -32.6921L33.2327 -2.36327L28.8573 2.13243L24.4867 6.62813L20.1114 11.119L15.7361 15.6147L3.6956 3.24534L-8.34364 15.6207L-25.8442 -2.3486L3.68695 -32.6921Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-21.472 2.14602L-12.7217 11.1282L-8.34423 15.6217L3.69029 3.24643L15.7355 15.6158L20.1108 11.1201L28.8568 2.13351L3.6838 -23.7067L-21.472 2.14602Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-17.094 6.64063L-12.7212 11.1293L-8.34369 15.6228L3.69083 3.24752L15.736 15.6168L20.1114 11.1211L24.482 6.6303L3.68177 -14.7212L-17.094 6.64063Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-12.7198 11.1304L-8.34234 15.6239L3.69219 3.24861L15.7374 15.6179L20.1127 11.1222L3.69002 -5.73576L-12.7198 11.1304Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M3.69448 3.25036L15.735 15.6197L11.3644 20.1105L3.70043 27.9853L-8.34477 15.6257L3.69448 3.25036Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M3.69336 3.24609L3.6912 -5.73828L3.68903 -14.7226L3.68687 -23.707L3.6847 -32.6914"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-25.8538 -2.33757L-21.4762 2.15112L-12.726 11.1333L-8.34844 15.6269L3.69209 27.9914L-55.3848 28.0059L-47.7162 20.1263L-43.3456 15.6355L-38.9703 11.1398L-25.8538 -2.33757Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M33.2284 -2.35526L37.6059 2.13341L41.9834 6.62694L46.3561 11.1156L50.7336 15.6091L62.7741 27.9736L3.69727 27.9883L15.7365 15.6178L20.1118 11.1221L33.2284 -2.35526Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M12.4453 27.9883L54.0354 27.9779L33.2352 6.62643L12.4453 27.9883Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M21.1914 27.9883L45.2948 27.9823L33.2496 15.613L21.1914 27.9883Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M29.9336 27.9785L36.5502 27.9769L33.2411 24.58L29.9336 27.9785Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M33.2271 -2.35769L33.2292 6.62183L33.2314 15.6062L33.2336 24.5906L33.2344 27.9785"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7612 -32.7058L92.3069 -2.37694L87.9316 2.11876L83.5562 6.61446L79.1856 11.1053L74.8103 15.601L62.7698 3.23167L50.7306 15.607L33.23 -2.36226L62.7612 -32.7058Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M37.6042 2.12844L41.9817 6.62196L46.3544 11.1106L50.7319 15.6042L62.7665 3.22885L74.8117 15.5982L79.187 11.1025L87.9329 2.11594L62.76 -23.7243L37.6042 2.12844Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M41.9822 6.62305L46.355 11.1117L50.7325 15.6052L62.767 3.22994L74.8122 15.5993L79.1875 11.1036L83.5582 6.61272L62.7579 -14.7388L41.9822 6.62305Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M46.3544 11.1128L50.7319 15.6063L62.7664 3.23103L74.8116 15.6004L79.1869 11.1047L62.7642 -5.75334L46.3544 11.1128Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7707 3.23279L74.8111 15.6021L70.4405 20.093L62.7766 27.9677L50.7314 15.6081L62.7707 3.23279Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M62.7715 3.23438L62.7693 -5.74999L62.7672 -14.7344L62.765 -23.7187L62.7628 -32.7031"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.841 -32.7195L151.387 -2.39062L147.012 2.10508L142.636 6.60078L138.266 11.0916L133.89 15.5873L121.85 3.218L109.811 15.5933L92.3101 -2.37594L121.841 -32.7195Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M96.6843 2.11477L101.062 6.60829L105.435 11.097L109.812 15.5905L121.847 3.21518L133.892 15.5845L138.267 11.0888L147.013 2.10226L121.84 -23.7379L96.6843 2.11477Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M101.06 6.60938L105.433 11.0981L109.811 15.5916L121.845 3.21627L133.89 15.5856L138.266 11.0899L142.636 6.59905L121.836 -14.7525L101.06 6.60938Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M105.433 11.0991L109.81 15.5927L121.845 3.21736L133.89 15.5867L138.265 11.091L121.842 -5.76701L105.433 11.0991Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.847 3.21521L133.887 15.5845L129.517 20.0754L121.853 27.9501L109.808 15.5905L121.847 3.21521Z"
                fill="white"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M121.848 3.2168L121.845 -5.76757L121.843 -14.7519L121.841 -23.7363L121.839 -32.7207"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M92.3026 -2.37284L96.6801 2.11583L101.058 6.60936L105.43 11.098L109.808 15.5916L121.848 27.956L62.7715 27.9707L74.8107 15.6002L79.1861 11.1046L92.3026 -2.37284Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M71.5195 27.9707L113.11 27.9604L92.3094 6.60885L71.5195 27.9707Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M80.2695 27.9668L104.373 27.9608L92.3277 15.5915L80.2695 27.9668Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M89.0117 27.9668L95.6283 27.9652L92.3192 24.5683L89.0117 27.9668Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M92.3032 -2.37917L92.3054 6.60035L92.3076 15.5847L92.3097 24.5691L92.3105 27.957"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M151.381 -2.39041L155.758 2.09826L160.136 6.59178L164.509 11.0805L168.886 15.574L180.926 27.9384L121.85 27.9531L133.889 15.5827L138.264 11.087L151.381 -2.39041Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M130.598 27.9531L172.188 27.9428L151.388 6.59127L130.598 27.9531Z"
                stroke="white"
                stroke-width="0.320042"
                stroke-miterlimit="10"
              />
              <path
                d="M-55.4441 -214.684L-55.3848 28.0059L180.923 27.948L180.863 -214.742L-55.4441 -214.684Z"
                stroke="white"
                stroke-width="0.592671"
                stroke-miterlimit="10"
              />
            </g>
          </g>
        </svg>

        <div className="relative z-10 flex items-center gap-2 h-full">
          <div className="flex items-center justify-center h-full">
            <svg
              width="67"
              height="65"
              viewBox="0 0 67 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="31" cy="31" r="31" fill="#2CB742" />
              <circle cx="55" cy="53" r="12" fill="#353848" />
              <g clip-path="url(#clip0_15964_58816)">
                <path
                  opacity="0.971"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M54.7773 47.3401C56.9341 47.3225 58.6021 48.2053 59.7812 49.9885C60.63 51.4347 60.8253 52.9659 60.3672 54.5823C59.7345 56.4494 58.4806 57.6876 56.6055 58.2971C55.126 58.706 53.7081 58.5536 52.3516 57.8401C51.3811 58.1032 50.4084 58.361 49.4336 58.6135C49.418 58.6057 49.4023 58.5979 49.3867 58.5901C49.6523 57.637 49.918 56.6839 50.1836 55.7307C49.3005 54.1059 49.2029 52.434 49.8906 50.7151C50.8768 48.6629 52.5058 47.5379 54.7773 47.3401ZM54.9414 48.301C56.7473 48.35 58.1184 49.1391 59.0547 50.6682C59.8515 52.1762 59.8515 53.684 59.0547 55.1917C58.2668 56.5176 57.1067 57.2949 55.5742 57.5237C54.4625 57.6412 53.4351 57.4029 52.4922 56.8089C51.92 56.9665 51.3458 57.115 50.7695 57.2542C50.9142 56.6989 51.0626 56.1442 51.2148 55.5901C50.2883 54.1264 50.1594 52.5951 50.8281 50.9964C51.6872 49.3216 53.0582 48.4232 54.9414 48.301Z"
                  fill="#2CB742"
                />
                <path
                  opacity="0.974"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M52.9721 50.3393C53.1453 50.3335 53.3171 50.3453 53.4877 50.3745C53.5827 50.4617 53.6491 50.5672 53.687 50.6909C53.8133 51.0139 53.9461 51.3342 54.0854 51.6518C54.1054 51.7485 54.0976 51.8423 54.062 51.9331C53.9381 52.1116 53.8053 52.2835 53.6635 52.4487C53.6479 52.5034 53.6479 52.5581 53.6635 52.6128C54.1187 53.4037 54.771 53.9701 55.6206 54.312C55.6863 54.3297 55.7488 54.3219 55.8081 54.2885C55.9849 54.0883 56.1529 53.8813 56.312 53.6675C56.3523 53.6219 56.4031 53.5985 56.4643 53.5971C56.596 53.62 56.721 53.663 56.8393 53.726C57.1739 53.8914 57.5059 54.0593 57.8354 54.23C57.8818 54.5067 57.8427 54.7723 57.7182 55.0268C57.3208 55.5136 56.8091 55.705 56.1831 55.601C55.0587 55.3457 54.1173 54.7871 53.3588 53.9253C53.0427 53.5544 52.7536 53.1638 52.4917 52.7534C52.2294 52.3173 52.1357 51.8486 52.2104 51.3471C52.2847 50.9992 52.4527 50.7062 52.7143 50.4682C52.7961 50.4117 52.882 50.3687 52.9721 50.3393Z"
                  fill="#2CB742"
                />
              </g>
              <g clip-path="url(#clip1_15964_58816)">
                <path
                  opacity="0.972"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.2216 10.5564C32.2714 10.3241 33.5702 11.19 34.1181 13.154C34.2864 15.0262 33.4823 16.2632 31.706 16.865C31.6318 17.9276 31.6071 18.9914 31.6318 20.0564C31.1865 20.0564 30.7411 20.0564 30.2958 20.0564C30.3205 18.9914 30.2958 17.9276 30.2216 16.865C28.1965 16.1053 27.442 14.6704 27.9579 12.5603C28.4029 11.5335 29.1575 10.8655 30.2216 10.5564Z"
                  fill="white"
                />
                <path
                  opacity="0.991"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.791 21.3191C26.9057 21.3067 35.0202 21.3191 43.1348 21.3562C44.7635 21.7727 45.7655 22.7994 46.1406 24.4363C46.1901 29.5327 46.1901 34.629 46.1406 39.7254C45.69 41.5862 44.5148 42.6376 42.6152 42.8797C37.6921 42.9044 32.7689 42.9292 27.8457 42.9539C25.6456 44.351 23.4686 45.7859 21.3145 47.2586C20.7753 47.5144 20.3918 47.3783 20.1641 46.8504C20.1393 45.6381 20.1146 44.4259 20.0898 43.2136C20.0032 43.127 19.9167 43.0405 19.8301 42.9539C17.6635 42.8891 16.3152 41.8129 15.7852 39.7254C15.7357 34.629 15.7357 29.5327 15.7852 24.4363C16.174 22.7983 17.1759 21.7592 18.791 21.3191ZM23.0957 27.0339C25.1254 27.1216 26.2634 28.1731 26.5098 30.1882C26.2997 32.0807 25.2482 33.1321 23.3555 33.3425C21.4624 33.1318 20.411 32.0803 20.2012 30.1882C20.386 28.4082 21.3508 27.3567 23.0957 27.0339ZM38.3106 27.0339C40.34 27.1213 41.478 28.1728 41.7246 30.1882C41.5142 32.0809 40.4628 33.1324 38.5703 33.3425C36.6776 33.1321 35.6261 32.0807 35.416 30.1882C35.6011 28.4079 36.566 27.3564 38.3106 27.0339ZM27.5488 34.6785C27.7581 34.6598 27.956 34.6969 28.1426 34.7898C28.9001 35.5995 29.8403 35.9829 30.9629 35.9402C31.5754 35.9255 32.1692 35.8142 32.7441 35.6062C33.182 35.3664 33.5778 35.0695 33.9316 34.7156C34.3523 34.6396 34.6244 34.8127 34.7481 35.2351C34.3957 35.9335 33.8514 36.4283 33.1152 36.7195C31.3342 37.3737 29.6272 37.2252 27.9941 36.2742C27.6421 36.0017 27.37 35.6677 27.1777 35.2722C27.2424 35.035 27.3661 34.8371 27.5488 34.6785Z"
                  fill="white"
                />
                <path
                  opacity="0.956"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.9629 34.53C11.9629 32.8972 11.9629 31.2643 11.9629 29.6315C12.4636 28.5271 13.3295 28.0571 14.5605 28.2214C14.5605 30.7943 14.5605 33.3672 14.5605 35.9401C13.3259 36.1028 12.46 35.6328 11.9629 34.53Z"
                  fill="white"
                />
                <path
                  opacity="0.957"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23.2437 28.2207C24.503 28.2802 25.1957 28.9358 25.3218 30.1875C25.2114 31.3865 24.5558 32.0421 23.355 32.1543C21.6234 31.7836 21.079 30.7692 21.7222 29.1113C22.1094 28.5905 22.6166 28.2937 23.2437 28.2207Z"
                  fill="white"
                />
                <path
                  opacity="0.957"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M38.4586 28.2207C39.96 28.3988 40.6155 29.24 40.4254 30.7441C39.9157 31.9453 39.0374 32.3535 37.7906 31.9688C36.8177 31.445 36.459 30.641 36.7145 29.5566C37.0476 28.7787 37.629 28.3334 38.4586 28.2207Z"
                  fill="white"
                />
                <path
                  opacity="0.956"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.9629 29.6311C49.9629 31.2639 49.9629 32.8967 49.9629 34.5295C49.4658 35.6323 48.5999 36.1024 47.3652 35.9397C47.3652 33.3667 47.3652 30.7939 47.3652 28.2209C48.5992 28.0579 49.4651 28.528 49.9629 29.6311Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_15964_58816">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(49 47)"
                  />
                </clipPath>
                <clipPath id="clip1_15964_58816">
                  <rect
                    width="38"
                    height="38"
                    fill="white"
                    transform="translate(12 10)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div
            className="flex flex-1 flex-col items-center gap-2 bg-[#FFFAEF] rounded-2xl px-2 py-2 h-full hover:shadow transition-all"
            // style={{ marginLeft: 8 }}
          >
            <p className="text-gray-600 font-medium text-[10px]">
              Use WhatsApp bot to receive responses for this survey
            </p>
            <div>
              <div className="flex gap-2">
                <Button
                  className="h-6 bg-transparent gap-1 border-none text-black/90 hover:text-black hover:bg-transparent p-2 rounded transition-colors px-2"
                  disabled={
                    typeof window === "undefined" ||
                    !navigator.share ||
                    !shareLink
                  }
                  onClick={async () => {
                    if (navigator.share && shareLink) {
                      try {
                        await navigator.share({
                          title: "Share Survey",
                          text: "Check out this survey!",
                          url: shareLink,
                        });
                        toast.success("Link shared!");
                      } catch (err) {
                        toast.error("Share cancelled or failed");
                      }
                    }
                  }}
                  title={
                    typeof window === "undefined" || !navigator.share
                      ? "Sharing not supported on this device"
                      : ""
                  }
                >
                  <Share2 size={14} />
                  <span className="text-xs">Share link</span>
                </Button>
                <CopyToClipboard
                  text={shareLink || ""}
                  onCopy={() => {
                    toast.success("Whatsapp link copied to clipboard");
                    setCopied(true);
                  }}
                >
                  {!whatsappUrl ? (
                    <Loader2 className="size-4 ml-2 animate-spin" />
                  ) : (
                    <Button
                      className="h-6 bg-transparent gap-1 border-none text-black/90 hover:text-black hover:bg-transparent p-2 rounded transition-colors px-2"
                      onMouseLeave={() => setCopied(false)}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span className="text-xs">
                        {copied ? "Link copied" : "Copy link"}
                      </span>
                    </Button>
                  )}
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyCard;
