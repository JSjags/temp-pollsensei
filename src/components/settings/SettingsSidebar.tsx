"use client";
import React, { useEffect, useMemo } from "react";
import { FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { TbChartBar, TbShieldHalf, TbStack } from "react-icons/tb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LuCreditCard } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { fetchPaidRespondentStatus } from "@/services/api/apiRequest";

interface MenuItem {
  label: string;
  path: string;
  icons: React.ReactNode;
}

const baseSupportMenu: MenuItem[] = [
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
  {
    label: "Subscription",
    path: "/settings/subscription",
    icons: <TbStack />,
  },
];

const editRespondentMenuItem: MenuItem = {
  label: "Edit Respondent",
  path: "/settings/edit-respondent",
  icons: <FaRegEdit />,
};

const SettingsSidebar = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user?.user);

  const { data: isPaidRespondent } = useQuery({
    queryKey: [...[APP_KEYS.IS_PAID_RESPONDENT]],
    queryFn: () => fetchPaidRespondentStatus(),
    enabled: !!user,
  });

  const isPaidRespondentStatus = isPaidRespondent?.isPaidRespondent;

  const supportMenu = useMemo(() => {
    const menu = [...baseSupportMenu];

    // Add Edit Respondent menu item for paid respondents
    if (isPaidRespondentStatus) {
      menu.splice(1, 0, editRespondentMenuItem); // Insert after Profile
    }

    return menu;
  }, [isPaidRespondentStatus]);

  const checkActive = (value: string): string => {
    return pathname?.includes(value) ? "support" : "";
  };

  const checkActiveIcon = (value: string): string => {
    return pathname?.includes(value) ? "icon-active" : "";
  };

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
                )} flex items-center text-[#898989] gap-2 rounded mb-2 py-2 px-3 w-full whitespace-nowrap`}
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
        </div>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
