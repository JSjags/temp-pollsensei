"use client";
import React, { FC } from "react";
import SurveyCard from "@/components/earn/SurveyCard";
import stethoscope from "@/assets/images/stethoscope.jpg";

interface Props {
  applicationSurveys: any;
}

const Applications: FC<Props> = ({ applicationSurveys }) => {
  if (!applicationSurveys || applicationSurveys?.data?.length === 0) {
    return (
      <div className="w-full h-[100px] lg:h-[150px] flex items-center justify-center">
        <p className="text-[#333333] text-sm">
          You&apos;re yet to apply for a survey
        </p>
      </div>
    );
  }

  // console.log({ applicationSurveys });

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
      {applicationSurveys?.data?.map((survey: any, index: any) => (
        <SurveyCard key={index} {...survey} />
      ))}
    </div>
  );
};
export default Applications;
