"use client";
import React, { useEffect } from "react";
import { FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { TbChartBar, TbShieldHalf, TbStack } from "react-icons/tb";
// import { LuCreditCard } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { LuCreditCard } from "react-icons/lu";

interface MenuItem {
  label: string;
  path: string;
  icons: React.ReactNode;
}

const supportMenu: MenuItem[] = [
  {
    label: "Profile",
    path: "/settings/profile",
    icons: <FaRegUserCircle />,
  },
  {
    label: "Notifications",
    path: "/settings/notifications",
    icons: <FaRegBell />,
  },
  {
    label: "Account Security",
    path: "/settings/account-security",
    icons: <TbShieldHalf />,
  },
  {
    label: "Referral Reward",
    path: "/settings/referral-reward",
    icons: <LuCreditCard />,
  },
  // {
  //   label: "Payment",
  //   path: "/settings/payment",
  //   icons: <LuCreditCard />,
  // },
  {
    label: "Subscription",
    path: "/settings/subscription",
    icons: <TbStack />,
  },
  {
    label: "Resource Monitor",
    path: "/settings/resource-monitor",
    icons: <TbChartBar />,
  },
  {
    label: "Edit Respondent",
    path: "/settings/edit-respondent",
    icons: <FaRegEdit />,
  },
];

// const editRespondentMenuItem: MenuItem = ;

const SettingsSidebar = () => {
  const pathname = usePathname();

  const checkActive = (value: string): string => {
    return pathname?.includes(value) ? "support" : "";
  };

  const checkActiveIcon = (value: string): string => {
    return pathname?.includes(value) ? "icon-active" : "";
  };

  // const router = useRouter();
  const isBecomeRespondentSurveyCompleted = useSelector(
    (state: RootState) =>
      state.becomePaidRespondentSlice.isBecomeRespondentSurveyCompleted
  );

  // useEffect(() => {
  //   if (!isBecomeRespondentSurveyCompleted) {
  //     router.push("/settings/profile");
  //   }
  // }, [isBecomeRespondentSurveyCompleted, router]);

  return (
    <div className="relative max-w-[100vw]">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F4F4F4] to-transparent pointer-events-none z-10 lg:hidden"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F4F4F4] to-transparent pointer-events-none z-10 lg:hidden"></div>
      <nav className="flex overflow-x-auto lg:block lg:w-[13rem] lg:overflow-x-visible hide-scrollbar px-4">
        <div className="flex lg:flex-col w-max min-[767px]:w-[calc(100vw-18rem)] lg:w-full">
          {supportMenu.map((menu) => (
            <div
              key={menu.label}
              className="text-sm flex-shrink-0 lg:flex-shrink"
            >
              <Link
                className={`${checkActive(
                  menu.path
                )} items-center text-[#898989] gap-2 rounded mb-2 py-2 px-3 w-full whitespace-nowrap ${
                  isBecomeRespondentSurveyCompleted &&
                  menu.label !== "Edit Respondent"
                    ? "hidden"
                    : "flex"
                }`}
                href={menu.path}
              >
                <span
                  className={`${checkActiveIcon(menu.path)} x-small d-block`}
                  style={{ fontWeight: "400" }}
                >
                  {menu.icons}
                </span>
                <span className="bold small">{menu.label}</span>
              </Link>
            </div>
          ))}
          {/* {isBecomeRespondentSurveyCompleted && (
            <div
              key={editRespondentMenuItem.label}
              className="text-sm flex-shrink-0 lg:flex-shrink"
            >
              <Link
                className={`${checkActive(
                  editRespondentMenuItem.path
                )} flex items-center text-[#898989] gap-2 rounded mb-2 py-2 px-3 w-full whitespace-nowrap`}
                href={editRespondentMenuItem.path}
              >
                <span
                  className={`${checkActiveIcon(
                    editRespondentMenuItem.path
                  )} x-small d-block`}
                  style={{ fontWeight: "400" }}
                >
                  {editRespondentMenuItem.icons}
                </span>
                <span className="bold small">
                  {editRespondentMenuItem.label}
                </span>
              </Link>
            </div>
          )} */}
        </div>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
