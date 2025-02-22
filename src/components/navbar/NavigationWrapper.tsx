"use client";

import { usePathname } from "next/navigation";
import SurveyCreationNav from "./SurveyCreationNav";
import Navbar from "./Navbar";

export const NavigationWrapper = () => {
  const path = usePathname();

  return (
    <>
      <Navbar />
      {/* {!path.includes("survey-list") && <SurveyCreationNav />} */}
    </>
  );
};
