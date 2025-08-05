"use client";

import React, { FC, useEffect, useState } from "react";
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  LogOut,
  Search,
  Settings,
  User,
  Check,
  Mail,
  MailCheckIcon,
  BellOffIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { persistStore } from "redux-persist";
import { useSidebar } from "../ui/sidebar";
import { Input } from "@/components/ui/shadcn-input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuMenu } from "react-icons/lu";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import { fetchPaidRespondentStatus } from "@/services/api/apiRequest";
import { APP_KEYS } from "@/constants";
import { FiUser } from "react-icons/fi";
import ReportHighlight from "@/components/blog/ReportHighlight";
import CategoryNav from "@/components/blog/CategoryNav";
import { FaSearch, FaPlus, FaFileAlt, FaRegEdit } from "react-icons/fa";
import { MdMail, MdMailOutline, MdNotificationsOff } from "react-icons/md";
import BlogSearchBar from "@/components/navbar/BlogSearchBar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  showReportsHeader?: boolean;
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

const categories = ["Explore All", "Categories", "Interests"];

const Navbar: FC<NavbarProps> = ({
  searchTerm = "",
  onSearchChange,
  selectedCategory = "Explore All",
  onCategorySelect,
  showReportsHeader = false,
}) => {
  const user = useSelector((state: RootState) => state.user?.user);
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
    enabled: !!user,
  });

  const { data: isPaidRespondent, isSuccess } = useQuery({
    queryKey: [...[APP_KEYS.IS_PAID_RESPONDENT]],
    queryFn: () => fetchPaidRespondentStatus(),
    enabled: !!user,
  });

  const isPaidRespondentStatus = isPaidRespondent?.isPaidRespondent;

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

  // console.log(notifications?.data);

  const handleLogout = () => {
    dispatch(logoutUser());
    clearPersistedState();
    localStorage.removeItem("persist:root");
    router.push("/login");
  };

  return (
    <div
      className={cn("w-full bg-white", isSidebarOpen && "h-screen lg:h-auto")}
    >
      {/* Main Header */}
      <header className="w-full px-6 py-4 flex flex-col gap-3 overflow-x-auto">
        <div
          className={`flex items-center mx-auto w-full
            ${path.includes("/blog") ? "justify-between" : "justify-end"}`}
        >
          {/* Left Section - Stats or Back Button */}
          {path.includes("/blog/") && (
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600"
            >
              ← Back
            </Button>
          )}
          {/* Right Section */}
          <div
            className={`flex items-center gap-4 w-full justify-end ${
              path.includes("/blog") && "justify-between"
            }`}
          >
            {/* Search Bar */}
            {path.includes("/blog") && <BlogSearchBar />}

            <div className="flex items-center ">
              {path.includes("/blog") && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push("/reports")}
                    className="text-[#3D3D3D] text-sm text-center bg-[#CB85FD1A] hover:bg-[#CB85FD1A] border-none px-4 py-2"
                  >
                    My Reports
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/blog")}
                    className="bg-transparent hover:bg-[#CB85FD1A] border-none outline-none text-[#3D3D3D] hover:text-[#3D3D3D] text-sm flex items-center gap-2"
                  >
                    {path.includes("/blog") && (
                      <FaRegEdit className="text-base text-[#5B03B2]" />
                    )}
                    <span className="">Publish</span>
                  </Button>
                </>
              )}
              {/* Notifications Dropdown */}
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
                  className="w-96 z-[10000000] relative"
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
                          <BellOffIcon className="size-16 mx-auto text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          You&apos;re all caught up! No new notifications.
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

              {/* User Avatar Dropdown */}
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
                      <div className="w-full flex items-center justify-between">
                        <p className="text-xs leading-none text-muted-foreground">
                          Admin
                        </p>
                        {isSuccess && (
                          <div className="flex items-center gap-1">
                            <p className="text-xs leading-none text-muted-foreground">
                              Paid Respondent
                            </p>
                            {isSuccess && !isPaidRespondentStatus ? (
                              <RxCrossCircled className="text-lg text-[red]" />
                            ) : (
                              <RxCheckCircled className="text-lg text-[green]" />
                            )}
                          </div>
                        )}
                      </div>
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
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/settings/account-security");
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/help-centre");
                      }}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {path.includes("/blog") && <ReportHighlight />}

        {path.includes("/blog") && (
          <ScrollArea className="h-auto max-w-[90%] rounded-md border-none p-0">
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect ?? (() => {})}
            />
          </ScrollArea>
        )}

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
              <>
                <Image
                  src={"/assets/sidebar/close.svg"}
                  alt="Open sidebar"
                  width={24}
                  height={24}
                  onClick={toogleMainSidebar}
                  className="hidden lg:inline-block"
                />
                <LuMenu
                  onClick={toogleMainSidebar}
                  className="text-black text-xl inline-block lg:hidden"
                />
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
