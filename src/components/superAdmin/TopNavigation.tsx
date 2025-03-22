import React, { useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BellIcon, BellOffIcon, RefreshCcwIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Mail, MailCheckIcon } from "lucide-react";
import axiosInstance from "@/lib/axios-instance";
import notification from "../../assets/images/notification.svg";

interface TopNavigationProps {
  onClick: () => void;
}

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

interface NotificationResponse {
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

const TopNavigation: React.FC<TopNavigationProps> = ({ onClick }) => {
  const { open, toggleSidebar } = useSidebar();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData<NotificationResponse>([
        "notifications",
      ]);

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
      queryClient.setQueryData(["notifications"], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Convert pathname to breadcrumb items
  const getBreadcrumbItems = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;

      // Format the path: remove hyphens/underscores and capitalize each word
      const formattedPath = path
        .split(/[-_]/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      // If it's the last item, render it as the current page
      if (index === paths.length - 1) {
        return (
          <BreadcrumbItem key={path}>
            <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      }

      return (
        <BreadcrumbItem key={path}>
          <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
      );
    });
  };

  const handleRefresh = async () => {
    try {
      // Invalidate and refetch all queries
      router.refresh();
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  const handleNotification = () => {
    router.push("/notifications");
  };

  return (
    <div className="flex justify-between items-center shadow-xl rounded-b-none border-b border-gray-100 bg-white px-4 py-2 rounded-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {open ? (
          <Image
            src={"/assets/sidebar/open.svg"}
            alt="Close sidebar"
            width={24}
            height={24}
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        ) : (
          <Image
            src={"/assets/sidebar/close.svg"}
            alt="Open sidebar"
            width={24}
            height={24}
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        )}

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {getBreadcrumbItems()}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCcwIcon className="size-5 text-gray-800" />
        </button>

        <DropdownMenu
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
        >
          <DropdownMenuTrigger asChild>
            <div className="size-10 p-2 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer relative">
              <Image
                className="object-contain size-10"
                width={24}
                height={24}
                src={notification}
                alt="Notification"
              />
              {notifications?.data.some((n) => n.read_status === "Unread") && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96" align="end" forceMount>
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {notifications?.data.some((n) => n.read_status === "Unread") && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-auto">
              {isLoadingNotifications ? (
                <DropdownMenuItem>Loading notifications...</DropdownMenuItem>
              ) : notifications?.data.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="mb-3">
                    <BellOffIcon className="size-16 mx-auto text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're all caught up! No new notifications.
                  </p>
                </div>
              ) : (
                <>
                  {notifications?.data
                    .filter(
                      (notification) => notification.read_status === "Unread"
                    )
                    .slice(0, 5)
                    .map((notification) => (
                      <DropdownMenuItem
                        key={notification._id}
                        className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div
                          className="flex flex-col gap-1 py-2 w-full group"
                          onClick={() => router.push("/notifications")}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm flex-1 line-clamp-2 font-medium group-hover:text-primary transition-colors">
                                {notification.content}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                  {notification.type}
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
                            {notification.read_status === "Unread" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="size-6 flex items-center justify-center text-red-500 hover:text-green-900 hover:bg-green-50 rounded-full group"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the parent click
                                        markAsRead(notification._id);
                                      }}
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
                        </div>
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex justify-center items-center text-primary hover:text-primary"
                    onSelect={() => router.push("/notifications")}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
