"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/user.slice";
import store, { RootState } from "@/redux/store";
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
import {
  HelpCircle,
  LogOut,
  Search,
  Settings,
  User,
  Check,
  Mail,
  MailCheckIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { persistStore } from "redux-persist";
import { useSidebar } from "../ui/sidebar";
import { Input } from "../ui/shadcn-input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Notification {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    username: string;
  };
  organization_id: string;
  content: string;
  type: "Survey Response" | string;
  read_status: "Read" | "Unread";
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  data: Notification[];
  total: number;
  page: number;
  page_size: number;
}

const fetchNotifications = async () => {
  const response = await axiosInstance.get<NotificationResponse>(
    "/notification",
    {
      params: {
        page: 1,
        page_size: 10,
      },
    }
  );
  return response.data;
};

const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosInstance.patch(
    `/notification/${notificationId}`,
    {
      read_status: "Read",
    }
  );
  return response.data;
};

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const user2 = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const persistor = persistStore(store);

  const queryClient = useQueryClient();

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<NotificationResponse>([
        "notifications",
      ]);

      // Optimistically update the notifications
      queryClient.setQueryData<NotificationResponse>(
        ["notifications"],
        (old) => ({
          ...old!,
          data: old!.data.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read_status: "Read" }
              : notification
          ),
        })
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      // Rollback on error
      queryClient.setQueryData(["notifications"], context?.previousData);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Function to clear persisted state
  const clearPersistedState = () => {
    persistor.purge(); // Clear persisted storage
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

  const { open: isOpen, toggleSidebar: toogleMainSidebar } = useSidebar();

  console.log(notifications?.data);

  return (
    <div
      className={cn(
        "w-full bg-transparent",
        isSidebarOpen && "h-screen lg:h-auto"
        // path.includes("survey") ? "" : "shadow-md shadow-black/5"
      )}
    >
      <div className="sticky top-0 z-50 bg-[#F7F8FB]">
        <header className="container flex items-center justify-between py-2 pt-2 px-2 sm:px-5 sticky top-0 bg-[#F7F8FB99] backdrop-blur-md">
          <div className="hidden lg:flex items-center gap-2 cursor-pointer">
            <div className="flex gap-4 items-center h-10">
              {isOpen ? (
                <Image
                  src={"/assets/sidebar/open.svg"}
                  alt="Close sidebar"
                  width={24}
                  height={24}
                  onClick={toogleMainSidebar}
                />
              ) : (
                <Image
                  src={"/assets/sidebar/close.svg"}
                  alt="Open sidebar"
                  width={24}
                  height={24}
                  onClick={toogleMainSidebar}
                />
              )}
              {/* <div className="h-10 bg-white relative rounded-lg w-52">
                <Search className="size-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-2" />
                <Input
                  className="border-none h-10 pl-8 rounded-lg"
                  placeholder="Search anything"
                />
              </div> */}
            </div>
          </div>
          {/* mobile */}
          <div className="lg:hidden flex items-center gap-2 cursor-pointer">
            <div className="flex gap-4 items-center h-10">
              {isOpen ? (
                <Image
                  src={"/assets/sidebar/open.svg"}
                  alt="Close sidebar"
                  width={24}
                  height={24}
                  onClick={toogleMainSidebar}
                />
              ) : (
                <Image
                  src={"/assets/sidebar/close.svg"}
                  alt="Open sidebar"
                  width={24}
                  height={24}
                  onClick={toogleMainSidebar}
                />
              )}
              {/* <div className="h-10 bg-white relative rounded-lg w-52">
                <Search className="size-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-2" />
                <Input
                  className="border-none h-10 pl-8 rounded-lg"
                  placeholder="Search anything"
                />
              </div> */}
            </div>
          </div>
          <div className="lg:hidden flex items-center gap-2 cursor-pointer">
            <Link href="/dashboard" className="w-full">
              <Image src={pollsensei_new_logo} alt="Logo" className="w-[60%]" />
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <DropdownMenu
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <DropdownMenuTrigger asChild className="z-[1000000] relative">
                <div className="size-12 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer p-[12px] relative">
                  <Image
                    className="object-contain size-8"
                    width={24}
                    height={24}
                    src={notification}
                    alt="Notification"
                  />
                  {notifications?.data.some(
                    (n) => n.read_status === "Unread"
                  ) && (
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-96 z-[1000000] relative"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {notifications?.data.some(
                    (n) => n.read_status === "Unread"
                  ) && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[400px] overflow-auto">
                  {isLoadingNotifications ? (
                    <DropdownMenuItem>
                      Loading notifications...
                    </DropdownMenuItem>
                  ) : notifications?.data.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="mb-3">
                        <Image
                          src="/assets/empty-notifications.svg"
                          alt="No notifications"
                          width={64}
                          height={64}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        You're all caught up! No new notifications.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/notifications")}
                        className="w-full"
                      >
                        View notification history
                      </Button>
                    </div>
                  ) : (
                    <>
                      {notifications?.data
                        .filter(
                          (notification) =>
                            notification.read_status === "Unread"
                        )
                        .slice(0, 5)
                        .map((notification) => (
                          <DropdownMenuItem
                            key={notification._id}
                            className="cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="flex flex-col gap-1 py-2 w-full">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm flex-1 line-clamp-2">
                                  {notification.content}
                                </p>
                                {notification.read_status === "Unread" && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          className="size-6 flex items-center justify-center text-red-500 hover:text-green-900 hover:bg-green-50 rounded-full group"
                                          onClick={() =>
                                            markAsRead(notification._id)
                                          }
                                        >
                                          <Mail className="size-4 group-hover:hidden" />
                                          <MailCheckIcon className="size-4 hidden group-hover:block" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Mark as read</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {notification.type === "Survery Response"
                                    ? "Survey Response"
                                    : notification.type}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleDateString()}{" "}
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}

                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer flex justify-center items-center text-primary hover:text-primary"
                          onSelect={(e) => {
                            router.push("/notifications");
                          }}
                        >
                          View all notifications
                        </DropdownMenuItem>
                      </>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer flex justify-center items-center size-12">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={(user as any)?.photo_url ?? ""}
                      alt="@johndoe"
                      className="size-8"
                    />
                    <AvatarFallback className="font-semibold">
                      {generateInitials((user as any)?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
                    clearPersistedState();
                    localStorage.removeItem("persist:root");
                    router.push("/login");
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
        {/* <DesktopNavigation /> */}
        <div className="flex justify-end items-center px-5">
          <MilestoneCTA />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
