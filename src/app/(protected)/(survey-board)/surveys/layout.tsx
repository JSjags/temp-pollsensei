"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SurveyCreationNav from "@/components/navbar/SurveyCreationNav";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import homeIcon from "@/assets/images/home-none.png";
import homeActive from "@/assets/images/homeActive.png";
import pieChartLogo from "@/assets/images/pie-chart.png";
import pieChartActive from "@/assets/images/pie-chartActive.png";
import users from "@/assets/images/users.svg";
import usersActive from "@/assets/images/usersActive.svg";
import settings from "@/assets/images/settings.svg";
import settingsActive from "@/assets/images/settingsActive.svg";
import help from "@/assets/images/help.svg";
import helpActive from "@/assets/images/helpActive.svg";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user.user);
  const user2 = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div>
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
