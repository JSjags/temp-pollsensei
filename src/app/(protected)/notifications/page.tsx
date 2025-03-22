"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { BellOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export interface Notification {
  _id: string;
  content: string;
  type: string;
  read_status: "Read" | "Unread";
  createdAt: string;
}

interface ApiResponse {
  data: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 20;

const NotificationsPage = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notifications-data"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInstance.get<ApiResponse>(
          `/notification?page=${pageParam}&page_size=${PAGE_SIZE}`
        );
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // If we haven't reached the last page, return the next page number
        if (lastPage.page < lastPage.total) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="container space-y-4 py-8 bg-white">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  console.log(data);

  // Flatten all pages into a single array of notifications
  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const isEmpty = notifications.length === 0;

  return (
    <div className="container py-8 min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intersection observer target */}
        {!isEmpty && hasNextPage && <div ref={ref} className="h-20" />}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-lg"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <BellOff className="size-16 text-purple-500" />
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-gray-900">
              All Caught Up!
            </h3>
            <p className="mt-2 text-center text-gray-600 max-w-sm">
              You're all up to date. When you receive notifications, they'll
              appear here.
            </p>
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-700">
                We'll notify you when there's something important to see.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
