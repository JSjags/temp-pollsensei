"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailCheck } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  content: string;
  type: string;
  read_status: "Read" | "Unread";
  createdAt: string;
}

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/notification");
      return response.data;
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/notification/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted successfully");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications?.data?.map((notification: Notification) => (
          <div
            key={notification._id}
            className={cn(
              "p-4 rounded-lg border",
              notification.read_status === "Unread"
                ? "bg-blue-50/50 border-blue-100"
                : "bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm mb-2">{notification.content}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{notification.type}</span>
                  <span>•</span>
                  <span>
                    {new Date(notification.createdAt).toLocaleDateString()}{" "}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => deleteNotification(notification._id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {notifications?.data?.length === 0 && (
          <div className="text-center py-8">
            <div className="mb-3">
              <Mail className="size-12 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-muted-foreground">
              You don't have any notifications at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
