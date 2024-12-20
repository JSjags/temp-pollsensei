"use client";

import CreateSurveyPage from "@/subpages/survey/CreateSurveyPage";
import UnAuthCreateSurveyPage from "@/subpages/unauth-survey/UnAuthCreateSurveyPage";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return <UnAuthCreateSurveyPage />;
};

export default Page;
