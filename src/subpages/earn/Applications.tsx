"use client";
import React, { FC } from "react";
import SurveyCard from "@/components/earn/SurveyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  applicationSurveys: any;
  isLoading: boolean;
  activeTab: string;
}

const Applications: FC<Props> = ({
  applicationSurveys,
  isLoading,
  activeTab,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] lg:h-[250px] w-full" />
        ))}
      </div>
    );
  }

  if (!applicationSurveys || applicationSurveys?.data?.length === 0) {
    return (
      <div className="w-full h-[100px] lg:h-[150px] flex items-center justify-center">
        <p className="text-[#333333] text-sm">
          You&apos;re yet to apply for a survey
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
      {applicationSurveys?.data?.map((survey: any, index: any) => (
        <SurveyCard key={index} survey={survey} activeTab={activeTab} />
      ))}
    </div>
  );
};
export default Applications;
