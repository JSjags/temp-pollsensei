import React, { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import {
  useLazyDownloadAllResponseQuery,
  useLazyDownloadSingleResponseQuery,
} from "@/services/survey.service";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResponseActions from "./ResponseAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Crown } from "lucide-react";
import { showModal } from "@/redux/slices/modal.slice";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";

interface ResponseHeaderProps {
  data: any;
  tabs: any;
  surveyData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  curerentSurvey: number;
  valid_response?: number;
  invalid_response?: number;
  handleNext?: () => void;
  handlePrev?: () => void;
  deleteAResponse?: () => void;
  respondent_data?: any[];
  response_id?: string;
  isLoading: boolean;
  isDeletingResponse: boolean;
}

const ResponseHeader: React.FC<ResponseHeaderProps> = ({
  data,
  tabs,
  activeTab,
  setActiveTab,
  curerentSurvey,
  handleNext,
  handlePrev,
  respondent_data,
  valid_response,
  invalid_response,
  deleteAResponse,
  response_id,
  surveyData,
  isLoading,
  isDeletingResponse,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const user = useSelector((state: RootState) => state.user.user);

  const [triggerDownloadAll, { data: allDownloadData }] =
    useLazyDownloadAllResponseQuery();
  const [triggerDownloadSingle, { data: singleDownloadData }] =
    useLazyDownloadSingleResponseQuery();

  const handleDownload = async (
    type: "all" | "single",
    format: "pdf" | "csv" | "xlsx"
  ) => {
    if (
      user?.plan.name === "Basic Plan" &&
      (format === "csv" || format === "xlsx")
    ) {
      dispatch(showModal(format));
      return;
    }

    const id =
      type === "all"
        ? { survey_id: params.id, format }
        : { response_id: response_id, format };

    try {
      if (type === "all") {
        await triggerDownloadAll(id);
      } else {
        await triggerDownloadSingle(id);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <Card className="w-full border-none shadow-none p-0">
      <CardHeader className="p-3 sm:p-6">
        <div className="grid grid-cols-1 gap-4 items-center w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full animate-pulse" />
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full animate-pulse" />
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full animate-pulse" />
                  </>
                ) : (
                  respondent_data?.slice(0, 3).map((respondent, index) => {
                    const names = respondent.name.split(" ");
                    const initials = names
                      .map((name: string) => name[0])
                      .join("");
                    const gradients = [
                      "from-violet-500 to-fuchsia-500",
                      "from-cyan-500 to-blue-500",
                      "from-emerald-500 to-teal-500",
                      "from-rose-500 to-pink-500",
                      "from-amber-500 to-orange-500",
                    ];

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.15, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar
                          className={`bg-gradient-to-br ${
                            gradients[index % gradients.length]
                          } border-2 border-white relative group`}
                          title={respondent.name}
                        >
                          <motion.div
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            {respondent.name}
                          </motion.div>
                          <AvatarFallback className="group-hover:animate-pulse bg-gradient-to-br">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    );
                  })
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-20 sm:w-24" />
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs sm:text-sm font-medium hover:scale-105 transition-transform"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {data} Response{(respondent_data?.length ?? 0) > 1 && "s"}
                  </motion.span>
                </Badge>
              )}
            </div>

            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <FaDownload className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  {["pdf", "csv", "xlsx"].map((format) => (
                    <React.Fragment key={format}>
                      <DropdownMenuItem
                        onClick={() => handleDownload("all", format as any)}
                      >
                        <Link
                          href={allDownloadData?.data?.url || ""}
                          className="flex items-center w-full"
                          target="_blank"
                        >
                          <span className="flex-1">
                            Download all as {format.toUpperCase()}
                          </span>
                          {user?.plan.name === "Basic Plan" &&
                            format !== "pdf" && (
                              <Crown className="ml-2 h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDownload("single", format as any)}
                      >
                        <Link
                          href={singleDownloadData?.data?.url || ""}
                          className="flex items-center w-full"
                          target="_blank"
                        >
                          <span className="flex-1">
                            Download current as {format.toUpperCase()}
                          </span>
                          {user?.plan.name === "Basic Plan" &&
                            format !== "pdf" && (
                              <Crown className="ml-2 h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                        </Link>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 opacity-0 transition-opacity data-[show=true]:opacity-100" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 opacity-0 transition-opacity data-[show=true]:opacity-100" />

          <div className="max-w-full overflow-x-auto scrollbar-none">
            <div className="border-b border-gray-200">
              <div className="flex space-x-2 px-4 sm:px-6 w-[calc(100vw-80px)] sm:w-full">
                {tabs.map((tab: string) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-4 py-2.5
                      text-sm sm:text-base
                      relative whitespace-nowrap flex-shrink-0
                      transition-colors
                      ${
                        activeTab === tab
                          ? "text-purple-600 font-medium"
                          : "text-gray-500 hover:text-gray-700"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                        layoutId="activeTab"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Individual Responses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-3 sm:p-6"
            >
              <ResponseActions
                curerentSurvey={curerentSurvey}
                totalSurveys={data}
                handleNext={handleNext}
                handlePrev={handlePrev}
                respondent_data={respondent_data}
                valid_response={valid_response}
                invalid_response={invalid_response}
                deleteAResponse={deleteAResponse}
                surveyData={surveyData}
                isLoading={isLoading}
                isDeletingResponse={isDeletingResponse}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ResponseHeader;
