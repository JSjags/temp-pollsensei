"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/user.slice";
import { RootState } from "@/redux/store";
import logo from "../../assets/images/pollsensei-logo.png";
import hamburger from "../../assets/images/hamburger-menu.png";
import notification from "../../assets/images/notification.svg";
import mobileNotification from "../../assets/images/mobile-notification.png";
import mobileUserIcon from "../../assets/images/mobile-user.png";
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
import { cn, generateInitials } from "@/lib/utils";
import { pollsensei_new_logo } from "@/assets/images";
import MilestoneCTA from "@/subpages/milestone/MilestoneCTA";
import DesktopNavigation from "./DesktopNavigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { HelpCircle, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const user2 = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  console.log(user);
  console.log(user2);

  useEffect(() => {
    if (path && path.includes("/surveys")) {
      handleSetActiveTab("surveys");
    } else if (path && path.includes("/team-members")) {
      handleSetActiveTab("team-members");
    } else if (path && path.includes("/settings")) {
      handleSetActiveTab("settings");
    } else if (path && path.includes("/help-centre")) {
      handleSetActiveTab("help-centre");
    } else {
      handleSetActiveTab("dashboard");
    }
  }, [path]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={cn(
        "w-full bg-white sticky top-0 z-[1000]",
        isSidebarOpen && "h-screen lg:h-auto",
        path.includes("survey") ? "" : "shadow-md shadow-black/5"
      )}
    >
      <div className="border-b-[0.5px]">
        <header className="container flex items-center justify-between py-5 px-5">
          <div className="hidden lg:flex items-center gap-2 cursor-pointer">
            <Image src={pollsensei_new_logo} alt="Logo" />
            {/* <h2 className="text-xl text-[#5B03B2]">PollSensei</h2> */}
            {path.includes("/surveys") && (
              <div className="hidden lg:flex items-center gap-2 space-x-1 text-xs mt-[10px] font-semibold ml-2">
                <Link href={"/dashboard"}>Dashboard</Link>
                <Link href={"/dashboard"}>Pricing</Link>
                <Link href={"/dashboard"}>Upgrade to pro</Link>
              </div>
            )}
          </div>
          <div
            className="lg:hidden flex items-center gap-2 cursor-pointer"
            onClick={toggleSidebar}
          >
            <Image src={hamburger} alt="Menu" className="size-4" />
          </div>
          <div className="lg:hidden flex items-center gap-2 cursor-pointer">
            <Image src={logo} alt="Logo" className="h-8 w-auto" />
            <h2 className="text-lg text-[#5B03B2]">PollSensei</h2>
          </div>

          <div className="flex gap-4">
            <div
              // onClick={() => {
              //   alert("Clicked");
              // }}
              className="h-[48px] w-[48px] rounded-full hover:bg-muted flex items-center justify-center cursor-pointer p-[12px]"
            >
              <Image
                className="object-contain"
                width={24}
                height={24}
                src={notification}
                alt="Notification"
              />
            </div>

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar className="size-12">
                  <AvatarImage
                    src={(user as any)?.photo_url ?? ""}
                    alt="@johndoe"
                  />
                  <AvatarFallback className="font-semibold">
                    {generateInitials((user as any)?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 z-[10000000]"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {(user as any)?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {(user as any)?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Admin
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/settings/profile");
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/settings/account-security");
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/help-centre");
                    }}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                    {/* <DropdownMenuShortcut>⌘H</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    dispatch(logoutUser());
                    router.push("/");
                  }}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* <div className="lg:hidden flex items-center gap-3">
            <div
              // onClick={() => {
              //   alert("Clicked");
              // }}
              className="lg:hidden size-8 rounded-full bg-[#fafafa] flex items-center justify-center cursor-pointer"
            >
              <Image
                className="object-contain"
                width={24}
                height={24}
                src={mobileNotification}
                alt="Mobile Notification"
              />
            </div>
            <div
              // onClick={() => {
              //   alert("Clicked");
              // }}
              className="lg:hidden font-semibold size-8 rounded-full bg-[#fafafa] flex items-center justify-center cursor-pointer"
            >
              {generateInitials((user as any)?.name ?? "")}
            </div>
          </div> */}
        </header>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Logo" />
            <h2 className="text-xl text-[#5B03B2]">PollSensei</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="mt-4 bg-white">
          <ul className="space-y-2">
            {[
              {
                name: "Dashboard",
                href: "/dashboard",
                icon: activeTab === "dashboard" ? homeActive : homeIcon,
              },
              {
                name: "Surveys",
                href: "/surveys",
                icon: activeTab === "surveys" ? pieChartActive : pieChartLogo,
              },
              {
                name: "Team members",
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
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    onClick={() => handleSetActiveTab(item.name.toLowerCase())}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === item.name.toLowerCase()
                        ? "text-[#9D50BB] bg-purple-100"
                        : "text-[#4F5B67]"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={`${item.name} Icon`}
                      className="mr-3 w-5 h-5"
                    />
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:block shadow-md shadow-black/0">
        <DesktopNavigation />
        <div className="flex justify-end items-center px-5">
          <MilestoneCTA />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
