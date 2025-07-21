"use client";

import AnalysisPage from "@/components/analysis/AnalysisTests";
import ErrorBoundary from "@/components/ErrorBoundary";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <ErrorBoundary>
      <AnalysisPage />
    </ErrorBoundary>
  );
};

export default page;
