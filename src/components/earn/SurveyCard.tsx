"use client";
import React, { FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoGold from "@/assets/images/logo-gold.png";
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
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";

interface Props {
  survey: any;
  activeTab: string;
  applicationSurveys?: any;
}

const SurveyCard: FC<Props> = ({ survey, activeTab, applicationSurveys }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Check if current survey has already been applied to
  const hasAlreadyApplied = useMemo(() => {
    if (activeTab !== "apply" || !applicationSurveys?.data) return false;

    const currentSurveyId = survey?.survey?._id;
    if (!currentSurveyId) return false;

    return applicationSurveys.data.some(
      (app: any) => app.surveyId?._id === currentSurveyId
    );
  }, [activeTab, survey, applicationSurveys]);

  const getCorrectSurveyId = () => {
    if (activeTab === "available") return survey?.surveyId;
    if (activeTab === "applications") return survey?.surveyId?._id;
    return survey?._id;
  };

  const handleAvailableSurvey = async (id: string) => {
    try {
      const surveyData = await fetchSurveyById(id);
      if (surveyData) {
        dispatch(openSurveyFormDialog(surveyData));
        queryClient.invalidateQueries({
          queryKey: [...[APP_KEYS.UNRESTRICTED_BALANCE]],
        });
        dispatch(closeSurveyTabs());
        dispatch(setSurveyID(id));
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const handleApplySurvey = async (id: string) => {
    try {
      const response = await fetchScreenerSurveyById(id);
      if (response) {
        dispatch(openSurveyFormDialog(response));
        queryClient.invalidateQueries({
          queryKey: [...[APP_KEYS.APPLICATION_SURVEYS]],
        });
        dispatch(closeSurveyTabs());
        dispatch(setSurveyID(id));
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
      if (hasAlreadyApplied) {
        return "Already Applied";
      }
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

  const isButtonDisabled = () => {
    if (activeTab === "apply" && hasAlreadyApplied) {
      return true;
    }

    return (
      survey?.alreadyApplied === true ||
      survey?.status === "pending" ||
      survey?.status === "rejected"
    );
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
            <Image src={logoGold} width={10} height={10} alt="logoGold" />3
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] cursor-pointer text-white text-xs font-bold text-center rounded-none rounded-b-2xl capitalize"
        type="button"
        onClick={handleStartNow}
        disabled={isButtonDisabled()}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};
export default SurveyCard;
