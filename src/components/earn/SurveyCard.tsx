"use client";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { pollsensei_icon } from "@/assets/images";
import {
  openSurveyFormDialog,
  closeSurveyTabs,
  setSurveyID,
  setScreenerSurvey,
} from "@/redux/slices/earnDialogSlice";
import stethoscope from "@/assets/images/stethoscope.jpg";
import {
  fetchSurveyById,
  fetchScreenerSurveyById,
} from "@/services/api/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";

interface Props {
  survey: any;
  activeTab: string;
}

const SurveyCard: FC<Props> = ({ survey, activeTab }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userAccessToken = useSelector(
    (state: RootState) => state.user.access_token
  );

  const getCorrectSurveyId = () => {
    if (activeTab === "available") return survey?.surveyId;
    if (activeTab === "applications") return survey?.surveyId?._id;
    return survey?._id;
  };

  const handleAvailableSurvey = async (id: string) => {
    try {
      const surveyData = await fetchSurveyById(userAccessToken, id);
      if (surveyData) {
        dispatch(openSurveyFormDialog(surveyData));
        dispatch(closeSurveyTabs());
        dispatch(setSurveyID(id));
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const handleApplySurvey = async (id: string) => {
    try {
      const response = await fetchScreenerSurveyById(userAccessToken, id);
      if (response) {
        dispatch(openSurveyFormDialog(response));
        dispatch(closeSurveyTabs());
        dispatch(setSurveyID(id));
        queryClient.invalidateQueries({
          queryKey: [...[APP_KEYS.APPLICATION_SURVEYS], userAccessToken],
        });
      }
    } catch (error) {
      console.error("Error fetching screener survey:", error);
    }
  };

  const handleStartNow = () => {
    const id = getCorrectSurveyId();

    if (!id) {
      console.error("No survey ID found");
      return;
    }

    if (activeTab === "available") {
      handleAvailableSurvey(id);
    } else if (activeTab === "apply") {
      handleApplySurvey(id);
    } else if (activeTab === "applications") {
      handleAvailableSurvey(id);
    }
  };

  const getStatusStyle = () => {
    if (survey?.survey?.status === "On going") {
      return "bg-[#E3FEF3] text-[#05BF43]";
    } else if (survey?.status === "approved") {
      return "bg-[#E3FEF3] text-[#05BF43]";
    }
    return "bg-[#FEE3F2] text-[#BF0558]";
  };

  const getButtonText = () => {
    if (activeTab === "available") {
      return survey?.alreadyApplied === false
        ? "Start Now"
        : "Survey Completed";
    } else if (activeTab === "apply") {
      return survey?.survey?.status === "On going" && "Apply Now";
    } else if (activeTab === "applications") {
      return survey?.status === "pending"
        ? "Pending"
        : survey?.status === "approved"
        ? "Start Now"
        : "Declined";
    } else {
      return "Not Qualified";
    }
  };

  return (
    <div className="bg-white h-auto w-full flex flex-col gap-1 lg:gap-3 rounded-2xl hover:scale-105 transition-all justify-between">
      <div className="relative h-[100px] lg:h-[150px] w-full border-b-2 border-[#08CE26] rounded-t-2xl">
        <Image
          src={stethoscope}
          alt="Activity image"
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>
      <div className="w-full h-auto flex flex-col gap-2 p-2">
        <div
          className={`${getStatusStyle()} rounded-full p-3 py-1 w-fit text-[8px] lg:text-[10px] block capitalize`}
        >
          {survey?.survey?.status || survey?.status}
        </div>
        <h3 className="text-[9px] lg:text-xs text-[#1C1C1C] font-bold">
          {survey?.survey?.topic?.length > 30 ||
          survey?.surveyId?.topic?.length > 30 ||
          survey?.title?.length > 30
            ? `${
                survey?.survey?.topic?.slice(0, 30) ||
                survey?.surveyId?.topic?.slice(0, 30) ||
                survey?.title?.slice(0, 30)
              }...`
            : survey?.survey?.topic || survey?.surveyId?.topic || survey?.title}
        </h3>
        <p className="text-[#AAAAAA] text-[10px]">
          {survey?.survey?.description?.length > 40 ||
          survey?.surveyId?.description?.length > 40 ||
          survey?.description?.length > 40
            ? `${
                survey?.survey?.description?.slice(0, 40) ||
                survey?.surveyId?.description?.slice(0, 40) ||
                survey?.description?.slice(0, 40)
              }...`
            : survey?.survey?.description ||
              survey?.surveyId?.description ||
              survey?.description}
        </p>
        <div className="w-full h-auto flex items-center gap-2">
          <div className="bg-[#E5ECF680] text-[#333333] text-[8px] lg:text-[10px] rounded-full py-1 px-3 flex items-center gap-1">
            <Image
              src={pollsensei_icon}
              width={10}
              height={10}
              alt="pollsensei_icon"
            />
            3 pollcoins
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] cursor-pointer text-white text-xs font-bold text-center rounded-none rounded-b-2xl capitalize"
        type="button"
        onClick={handleStartNow}
        disabled={
          survey?.alreadyApplied === true ||
          survey?.status === "pending" ||
          survey?.status === "rejected"
        }
      >
        {getButtonText()}
      </Button>
    </div>
  );
};
export default SurveyCard;
