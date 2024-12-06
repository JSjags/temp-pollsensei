"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import homeIcon from "../../assets/images/home-none.png";
import homeActive from "../../assets/images/homeActive.png";
import pieChartLogo from "../../assets/images/pie-chart.png";
import pieChartActive from "../../assets/images/pie-chartActive.png";
import users from "../../assets/images/users.svg";
import usersActive from "../../assets/images/usersActive.svg";
import settings from "../../assets/images/settings.svg";
import settingsActive from "../../assets/images/settingsActive.svg";
import help from "../../assets/images/help.svg";
import helpActive from "../../assets/images/helpActive.svg";
import "./styles.css";

const DesktopNavigation = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [activeTab, setActiveTab] = useState("dashboard");
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isExactSurveyPath = path === "/surveys";
  const isSurveySubpath = path.startsWith("/surveys") && !isExactSurveyPath;

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    if (isSurveySubpath) {
      // Here, handle any specific logic for survey subpaths
      return; // Effectively do nothing or add specific logic for subpath
    }
    if (path.includes("/surveys")) {
      handleSetActiveTab("surveys");
    } else if (path.includes("/team-members")) {
      handleSetActiveTab("team-members");
    } else if (path.includes("/settings")) {
      handleSetActiveTab("settings");
    } else if (path.includes("/help-centre")) {
      handleSetActiveTab("help-centre");
    }else if(path.includes("/user-review")){
      handleSetActiveTab("user-review");
    }else {
      handleSetActiveTab("dashboard");
    }
  }, [path]);

  if (isSurveySubpath) {
    return null;
  }


  return (
    <nav className="container pt-5 px-5">
      <ul className="flex items-center gap-10">
        <Link href="/dashboard">
          <li
            onClick={() => handleSetActiveTab("dashboard")}
            className={`flex flex-col items-center cursor-pointer ${
              activeTab == "dashboard"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "dashboard" ? homeActive : homeIcon}
                alt="Dashboard Icon"
              />
              <p className={`lg:text-[16px] text-[14px] `}>Dashboard</p>
            </div>
            <div
              className={`${
                activeTab == "dashboard" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
        <Link href="/surveys">
          <li
            onClick={() => handleSetActiveTab("surveys")}
            className={`flex flex-col items-center cursor-pointer ${
              activeTab == "surveys"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "surveys" ? pieChartActive : pieChartLogo}
                alt="Survey Icon"
              />
              <p className="lg:text-[16px] text-[14px]">Surveys</p>
            </div>
            <div
              className={`${
                activeTab == "surveys" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
        <Link href="/team-members">
          <li
            onClick={() => handleSetActiveTab("team-members")}
            className={`flex items-center flex-col cursor-pointer ${
              activeTab == "team-members"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "team-members" ? usersActive : users}
                alt="Team Icon"
              />
              <p className="lg:text-[16px] text-[14px]">Team members</p>
            </div>
            <div
              className={`${
                activeTab == "team-members" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
        <Link href="/settings/profile">
          <li
            onClick={() => handleSetActiveTab("settings")}
            className={`flex items-center flex-col cursor-pointer ${
              activeTab == "settings"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "settings" ? settingsActive : settings}
                alt="Settings Icon"
              />
              <p className="lg:text-[16px] text-[14px]">Settings</p>
            </div>
            <div
              className={`${
                activeTab == "settings" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
        <Link href="/help-centre">
          <li
            onClick={() => handleSetActiveTab("help-centre")}
            className={`flex flex-col items-center cursor-pointer ${
              activeTab == "help-centre"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "help-centre" ? helpActive : help}
                alt="Help Icon"
              />
              <p className="lg:text-[16px] text-[14px]">Help Centre</p>
            </div>
            <div
              className={`${
                activeTab == "help-centre" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
        <Link href="/user-review">
          <li
            onClick={() => handleSetActiveTab("user-review")}
            className={`flex flex-col items-center cursor-pointer ${
              activeTab == "user-review"
                ? "text-[#9D50BB]"
                : "text-[#4F5B67] pb-[17px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={activeTab == "user-review" ? helpActive : help}
                alt="Help Icon"
              />
              <p className="lg:text-[16px] text-[14px]">Review</p>
            </div>
            <div
              className={`${
                activeTab == "user-review" ? "block" : "hidden"
              } w-[50%] border-b-[3px] border-[#9D50BB] rounded-lg mt-[14px]`}
            />
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
