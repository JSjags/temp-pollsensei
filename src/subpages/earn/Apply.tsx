"use client";
import React from "react";
import SurveyCard from "@/components/earn/SurveyCard";
import stethoscope from "@/assets/images/stethoscope.jpg";

const Apply = () => {
  const appliedSurveys = [
    {
      title: "Health and Wellness Checkup",
      description: "Lorem ipsum dolor sit ametHealth and Wellness Checkup",
      image: stethoscope,
      poll_coins: 20,
      time: 10,
      isApplied: true,
    },
    {
      title: "Health and Wellness Checkup",
      description: "Lorem ipsum dolor sit ametHealth and Wellness Checkup",
      image: stethoscope,
      poll_coins: 20,
      time: 4,
      isApplied: false,
    },
    {
      title: "Health and Wellness Checkup",
      description: "Lorem ipsum dolor sit ametHealth and Wellness Checkup",
      image: stethoscope,
      poll_coins: 20,
      time: 2,
      isApplied: true,
    },
    {
      title: "Health and Wellness Checkup",
      description: "Lorem ipsum dolor sit ametHealth and Wellness Checkup",
      image: stethoscope,
      poll_coins: 20,
      time: 10,
      isApplied: false,
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
      {appliedSurveys.map((survey, index) => (
        <SurveyCard key={index} {...survey} />
      ))}
    </div>
  );
};
export default Apply;
