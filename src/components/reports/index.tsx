import React from "react";
import Onboarding from "./components/Onboarding";
import { useReportOnboardState } from "./queries/useOnboardState";
import { MyReports } from "./components/MyReports";

export default function ReportsPage() {
  const { data, isLoading, error } = useReportOnboardState();

  // Show loading only when actively fetching data
  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-[70vh]" />;
  }

  // If there's an error, you might want to handle it
  if (error) {
    return <div>Error loading onboard state</div>;
  }

const isOnboard = !!(data?.categories?.length);
  
  return <div>{isOnboard ? <MyReports /> : <Onboarding />}</div>;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  } as const;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-tertiary rounded-full animate-spin`}
      ></div>
    </div>
  );
};