"use client";

import { getLatestSurveyMilestone } from "@/services/analysis";
import SurveysPage from "@/subpages/admin/SurveysPage";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  const latestMilestone = useQuery({
    queryKey: ["latest-milestone"],
    queryFn: () => getLatestSurveyMilestone(),
  });
  return latestMilestone.isSuccess ? <SurveysPage /> : null;
};

export default Page;
