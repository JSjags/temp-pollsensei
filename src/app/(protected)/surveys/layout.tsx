"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SurveyCreationNav from "@/components/navbar/SurveyCreationNav";
import SenseiMaster from "@/components/sensei-master/SenseiMaster";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="">
      <SenseiMaster />
      <SurveyCreationNav />
      <div
        className={`px-0 ${
          pathname === "/surveys/edit-survey" ? "px-0" : "lg:px-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
