import React from "react";
import Onboarding from "./components/Onboarding";
import { useReportOnboardState } from "./queries/useOnboardState";
import { MyReports } from "./components/MyReports";

export default function ReportsPage() {
  const { data, isLoading, error } = useReportOnboardState();

  const isOnboard = !!data;
  // const isOnboard = false;

  // if (isLoading) {
  //   return <div>Loading onboarding state...</div>;
  // }

  // if (error) {
  //   return <div>Failed to load onboarding state</div>;
  // }

  return <div>{isOnboard ? <MyReports /> : <Onboarding />}</div>;
}
