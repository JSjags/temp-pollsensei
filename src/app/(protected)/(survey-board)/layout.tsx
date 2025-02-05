"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SurveyCreationNav from "@/components/navbar/SurveyCreationNav";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import overview from "@/assets/images/overview.svg";
import overviewActive from "@/assets/images/overview-active.svg";
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
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSetActiveTab = (tab: string, index: number) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    const activeElement = tabRefs.current[index];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorStyle({
        left: offsetLeft + offsetWidth / 2 - 40, // 40 is half of indicator width (w-20)
        width: 80, // w-20 in pixels
      });
    }
  };

  useEffect(() => {
    // Set initial indicator position
    const initialIndex = navigationItems.findIndex(
      (item) => item.name.toLowerCase() === activeTab
    );
    if (initialIndex >= 0) {
      const activeElement = tabRefs.current[initialIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({
          left: offsetLeft + offsetWidth / 2 - 40,
          width: 80,
        });
      }
    }
  }, []);

  const navigationItems = [
    {
      name: "Overview",
      href: "/surveys",
      icon: activeTab === "surveys" ? overviewActive : overview,
    },
    {
      name: "Surveys",
      href: "/surveys/survey-list",
      icon: activeTab === "surveys/survey-list" ? pieChartActive : pieChartLogo,
    },
    {
      name: "Team Members",
      href: "/team-members",
      icon: activeTab === "team-members" ? usersActive : users,
    },
    {
      name: "Settings",
      href: "/settings/profile",
      icon: activeTab === "settings" ? settingsActive : settings,
    },
    {
      name: "Help Centre",
      href: "/help-centre",
      icon: activeTab === "help-centre" ? helpActive : help,
    },
  ];

  // Set active tab based on current path

  console.log(path);

  useEffect(() => {
    if (path === "/surveys") {
      setActiveTab("surveys");
    } else if (path.includes("/surveys/survey-list")) {
      setActiveTab("surveys/survey-list");
    } else if (path.includes("/team-members")) {
      setActiveTab("team-members");
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
    } else if (path.includes("/help-centre")) {
      setActiveTab("help-centre");
    } else {
      setActiveTab("dashboard");
    }
  }, [path]);

  return (
    <div className="w-full">
      <nav className="bg-white py-4 md:w-full w-screen relative border-b border-border">
        <div className="absolute right-0 top-0 h-full w-4 md:w-10 bg-gradient-to-l from-white via-white to-transparent z-10"></div>
        <div className="absolute left-0 top-0 h-full w-4 md:w-10 bg-gradient-to-r from-white via-white to-transparent z-10"></div>
        <div className="w-full px-0 md:px-4 overflow-x-auto hide-scrollbar">
          <div>
            <ul className="flex md:justify-between lg:justify-center whitespace-nowrap gap-4 md:gap-0 lg:gap-4 relative px-2">
              <div
                className="absolute bottom-0 h-0.5 w-20 bg-[#9D50BB] transition-all duration-300 ease-in-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />
              {navigationItems.map((item, index) => (
                <li key={item.name} className="flex-shrink-1">
                  <Link href={item.href}>
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        tabRefs.current[index] = el;
                      }}
                      onClick={() =>
                        handleSetActiveTab(item.name.toLowerCase(), index)
                      }
                      className={`flex items-center justify-center px-4 md:px-2 lg:px-4 py-2 text-xs sm:text-sm ${
                        item.href.toLowerCase() === activeTab ||
                        (item.href.toLowerCase() === "/surveys" &&
                          activeTab === "surveys") ||
                        (activeTab !== "surveys" &&
                          item.href.toLowerCase().includes(activeTab))
                          ? "text-[#9D50BB]"
                          : "text-[#4F5B67]"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt={`${item.name} Icon`}
                        className="mr-2 size-4 sm:size-5 md:size-4 lg:size-5 flex-shrink-0"
                      />
                      <span className="text-center md:text-xs lg:text-sm lg:inline">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
