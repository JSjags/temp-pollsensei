"use client";
import React, { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { IoEyeOutline } from "react-icons/io5";
import ParticipantReview from "@/components/survey/ParticipantReview";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  fetchScreenerSurveyBySurveyId,
  fetchScreenerParticipants,
} from "@/services/api/apiRequest";
import Image from "next/image";
import emptyNotification from "@/assets/images/EmptyNotification.png";
import { Skeleton } from "@/components/ui/skeleton";
import { IoIosClose } from "react-icons/io";
import { submitReviewedParticipant } from "@/services/api/apiRequest";
import BooleanQuestion from "./BooleanQuestion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  setIsReviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  surveyId: string;
}

const ReviewDialog: FC<Props> = ({ setIsReviewDialogOpen, surveyId }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isParticipantReview, setIsParticipantReview] =
    useState<boolean>(false);
  const [applicationID, setApplicationID] = useState<string>("");
  const [participantID, setParticipantID] = useState<string>("");
  const [participantResponses, setParticipantResponses] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [response, setResponse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [actionType, setActionType] = useState<"approved" | "rejected">(
    "approved"
  );
  const itemsPerPage = 20;

  const { data: screenerSuveyBySurveyId, isLoading: loadingScreenerSurvey } =
    useQuery({
      queryKey: [...[APP_KEYS.SCREENER_SURVEY_BY_SURVEY_ID], surveyId],
      queryFn: () => fetchScreenerSurveyBySurveyId(surveyId),
      enabled: !!surveyId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const screenerSurveyID = screenerSuveyBySurveyId?.[0]?._id;

  const {
    data: participants,
    isLoading: loadingParticipants,
    refetch: refetchParticipants,
  } = useQuery({
    queryKey: [...[APP_KEYS.PARTICIPANTS], screenerSuveyBySurveyId],
    queryFn: () => fetchScreenerParticipants(surveyId, screenerSurveyID),
    enabled: !!screenerSuveyBySurveyId,
  });

  const allItems = participants?.data || [];
  // console.log({ participants, allItems });
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleReviewParticipant = async (
    applicationIds: string[],
    status: string
  ) => {
    try {
      setIsLoading(true);
      const response = await submitReviewedParticipant(applicationIds, status);
      await refetchParticipants();
      resetSelected();
      setResponse(response?.success);
      setIsLoading(false);
      queryClient.invalidateQueries({
        queryKey: [...[APP_KEYS.APPLICATION_SURVEYS]],
      });
      return response?.success;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    const selectedApplicationIds = selected.map(() => applicationID);
    await handleReviewParticipant(selectedApplicationIds, actionType);
    setConfirmationDialogOpen(false);
  };

  const openConfirmationDialog = (type: "approved" | "rejected") => {
    setActionType(type);
    setConfirmationDialogOpen(true);
  };

  const handleCheckboxChange = (participantID: string) => {
    setSelected((prev) => {
      if (prev.includes(participantID)) {
        return prev.filter((id) => id !== participantID);
      } else {
        return [...prev, participantID];
      }
    });
  };

  const resetSelected = () => {
    setSelected([]);
  };

  const getStatus = (respondentId: string) => {
    const participant = allItems.find(
      (item: any) => item.respondent._id === respondentId
    );
    return participant?.status || "pending";
  };

  return (
    <>
      {!isParticipantReview ? (
        <div className="flex flex-col gap-4 h-full">
          <h2 className="font-bold text-xl">Participant review</h2>
          <div className="w-full flex-1 flex flex-col shadow-[-2px_2px_2px_2px_#563BFF42] rounded-lg overflow-hidden">
            <Table className="w-full h-full flex-1 flex flex-col overflow-hidden">
              <TableCaption className="sticky top-0 bg-white z-10 w-full flex justify-between items-center gap-5 mb-10 px-3">
                <div className="border-b-2 border-[#E1E1E1] px-2 pb-2 w-full flex justify-between items-center">
                  <span className="text-base text-left">Participant List</span>
                  {currentItems.length !== 0 && (
                    <div className="w-auto flex items-center gap-2 capitalize text-[#5B03B2] text-base">
                      <IoIosClose
                        className="cursor-pointer text-2xl text-[#5B03B2]"
                        onClick={resetSelected}
                      />
                      {selected.length} selected
                    </div>
                  )}
                </div>
                {currentItems.length !== 0 && (
                  <div className="w-auto h-[20px] flex items-center justify-start gap-5 px-10 lg:px-0">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-[100px] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
                      type="button"
                      onClick={() => openConfirmationDialog("approved")}
                      disabled={selected.length === 0 || isLoading}
                    >
                      {isLoading ? "Loading..." : "Accept"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[100px] bg-transparent border border-[#E50300] hover:bg-transparent rounded-md text-xs md:text-sm p-4 text-[#E50300] hover:scale-x-105 transition-all"
                      type="button"
                      onClick={() => openConfirmationDialog("rejected")}
                      disabled={selected.length === 0 || isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCaption>
              <TableHeader className="sticky top-[57px] bg-white z-10 w-full">
                <TableRow className="w-full flex items-center bg-transaprent border-0">
                  <TableHead className="w-[35%]">User Name</TableHead>
                  <TableHead className="w-[15%]">Gender</TableHead>
                  <TableHead className="w-[15%]">Age Group</TableHead>
                  <TableHead className="w-[35%]">Email Address</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                className={`overflow-y-auto w-full py-5 ${
                  currentItems.length === 0
                    ? "h-[calc(100vh-300px)]"
                    : "h-[calc(100vh-400px)]"
                }`}
              >
                {(loadingScreenerSurvey || loadingParticipants) && (
                  <div className="w-full h-auto flex flex-col gap-3 items-center">
                    {Array.from({ length: 20 }).map((_, index) => (
                      <Skeleton key={index} className="h-[30px] w-full px-3" />
                    ))}
                  </div>
                )}
                {!loadingScreenerSurvey &&
                !loadingParticipants &&
                currentItems.length === 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={emptyNotification}
                      width={200}
                      height={200}
                      alt="emptyNotification"
                    />
                    <p className="text-center text-[#666666] text-base">
                      You have not received any applications to your survey yet
                    </p>
                  </div>
                ) : (
                  currentItems.map((data: any, index: any) => (
                    <TableRow
                      key={data?.respondent?._id}
                      className={`w-full border-b-2 border-white flex items-center ${
                        index % 2 !== 0 ? "bg-[#FEF5FED6]" : "bg-[#F7EEFED9]"
                      }`}
                    >
                      <TableCell className="capitalize w-[35%] flex items-center gap-2">
                        <Checkbox
                          className="cursor-pointer"
                          checked={selected.includes(data?.respondent?._id)}
                          onCheckedChange={() => {
                            setApplicationID(data?.applicationId);
                            setParticipantID(data?.respondent?._id);
                            handleCheckboxChange(data?.respondent?._id);
                          }}
                          disabled={
                            getStatus(data?.respondent?._id) !== "pending"
                          }
                        />
                        {data?.respondent?.name}
                      </TableCell>
                      <TableCell className="capitalize w-[15%]">
                        {data?.respondent?.gender}
                      </TableCell>
                      <TableCell className="capitalize w-[15%]">
                        {data?.respondent?.age}
                      </TableCell>
                      <TableCell className="w-[35%]">
                        {data?.respondent?.email}
                      </TableCell>
                      <TableCell
                        className={`capitalize w-[15%] ${
                          getStatus(data?.respondent?._id) === "pending"
                            ? "text-[#F29109]"
                            : getStatus(data?.respondent?._id) === "approved"
                            ? "text-[#009E10]"
                            : "text-[#E50300]"
                        }`}
                      >
                        {getStatus(data?.respondent?._id)}
                      </TableCell>
                      <TableCell
                        className="capitalize w-[15%] flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setApplicationID(data?.applicationId);
                          setParticipantID(data?.respondent?._id);
                          setParticipantResponses(data);
                          setIsParticipantReview(true);
                        }}
                      >
                        <p>view</p>
                        <IoEyeOutline className="text-lg text-[#5B03B2] cursor-pointer" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {currentItems.length !== 0 && (
              <div className="ml-auto w-auto flex items-center justify-center gap-2 py-2 px-5">
                <Button
                  size="sm"
                  variant="default"
                  className={`bg-[#FCFCFC] flex items-center gap-1 justify-center border-0 outline-none hover:text-white active:text-white hover:bg-[#FCFCFC] active:bg-[#FCFCFC] ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IoMdArrowDropleft className="text-[#333333] text-base" />
                  <span className="text-[#333333] text-xs">Prev</span>
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-[#F0EFFD] hover:bg-[#F0EFFD] text-[#333333] text-sm"
                >
                  {currentPage}
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className={`bg-[#F0EFFD] hover:bg-[#F0EFFD] active:bg-[#FCFCFC] hover:text-white active:text-white text-[#333333] text-sm
              ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="text-[#333333] text-xs">Next</span>
                  <IoMdArrowDropright className="text-[#333333] text-base" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ParticipantReview
          participantID={participantID}
          applicationID={applicationID}
          participantResponses={participantResponses}
          setIsParticipantReview={setIsParticipantReview}
          setIsReviewDialogOpen={setIsReviewDialogOpen}
          refetchParticipants={refetchParticipants}
          onReviewParticipant={handleReviewParticipant}
          response={response}
          getStatus={getStatus}
        />
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
      >
        <AlertDialogContent className="z-[1000000]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approved"
                ? "Accept Participants"
                : "Reject Participants"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {actionType === "approved" ? "accept" : "reject"}{" "}
              {selected.length} participant{selected.length !== 1 ? "s" : ""}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                actionType === "approved"
                  ? "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            >
              {actionType === "approved" ? "Accept" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewDialog;
