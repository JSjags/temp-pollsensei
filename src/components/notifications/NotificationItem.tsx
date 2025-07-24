import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { Trash2, Mail, MailCheck } from "lucide-react";
import { Notification } from "@/app/(protected)/notifications/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { NotificationResponse } from "../navbar/Navbar";

interface NotificationItemProps {
  notification: Notification;
}

const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosInstance.patch(
    `/notification/${notificationId}`,
    {
      read_status: "Read",
    }
  );
  return response.data;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: deleteNotification, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/notification/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted successfully");
    },
  });

  const { mutate: markAsRead, isPending: isUpdating } = useMutation({
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

  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-lg ${
        notification.read_status === "Read" ? "bg-white" : "bg-blue-50"
      }`}
    >
      <div className="flex-1">
        <p className="text-sm text-gray-900">{notification.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="flex gap-2">
        {notification.read_status === "Unread" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAsRead(notification._id)}
            disabled={isUpdating}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <MailCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Mail className="h-4 w-4 text-purple-500" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteNotification(notification._id)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
