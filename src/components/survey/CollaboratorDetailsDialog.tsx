import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CalendarDays, Mail, Bell, Activity } from "lucide-react";

export interface Collaborator {
  _id: string;
  name: string;
  email: string;
  status: Array<{
    organization: string;
    status: string;
    _id: string;
  }>;
  collaborator_roles: Array<{
    organization: string;
    role: string[];
    _id: string;
  }>;
  notifications: Array<{
    email_notification: {
      news_and_updates: boolean;
      tips_and_tutorials: boolean;
      offers_and_promotions: boolean;
    };
    more_activity: {
      all_reminders_and_activities: boolean;
      activities_only: boolean;
      important_reminder_only: boolean;
    };
    organization: string;
    _id: string;
  }>;
  visit_count: number;
  createdAt: string;
  updatedAt: string;
}

interface CollaboratorDetailsDialogProps {
  collaborator: Collaborator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollaboratorDetailsDialog({
  collaborator,
  open,
  onOpenChange,
}: CollaboratorDetailsDialogProps) {
  if (!collaborator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto z-[100000]"
        overlayClassName="z-[100000]"
      >
        <DialogHeader>
          <DialogTitle>Collaborator Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="text-lg">
                {collaborator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <h2 className="text-xl font-semibold break-words">
                {collaborator.name}
              </h2>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 mt-1" />
                <span className="truncate">{collaborator.email}</span>
              </div>
            </div>
          </div>

          {/* Status and Roles */}
          <div className="grid gap-6 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Status</h3>
              <div className="flex flex-wrap gap-2">
                {collaborator.status.map((s) => (
                  <Badge
                    key={s._id}
                    variant="outline"
                    className={
                      s.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }
                  >
                    {s.status}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {collaborator.collaborator_roles[0]?.role.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Dates and Activity */}
          <div className="grid gap-6 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium flex items-start gap-2">
                <CalendarDays className="h-4 w-4 flex-shrink-0 mt-1" />
                Important Dates
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Joined: </span>
                  {format(new Date(collaborator.createdAt), "PPP")}
                </p>
                <p>
                  <span className="text-muted-foreground">Last Updated: </span>
                  {format(new Date(collaborator.updatedAt), "PPP")}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-start gap-2">
                <Activity className="h-4 w-4 flex-shrink-0 mt-1" />
                Activity
              </h3>
              <p className="text-sm">
                <span className="text-muted-foreground">Visit Count: </span>
                {collaborator.visit_count}
              </p>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-start gap-2">
              <Bell className="h-4 w-4 flex-shrink-0 mt-1" />
              Notification Preferences
            </h3>
            <div className="grid gap-6 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(
                    collaborator.notifications[0]?.email_notification || {}
                  ).map(([key, value]) => (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          value ? "bg-green-50" : "bg-gray-50"
                        } flex-shrink-0`}
                      >
                        {value ? "On" : "Off"}
                      </Badge>
                      <span className="capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Activity Preferences</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(
                    collaborator.notifications[0]?.more_activity || {}
                  ).map(([key, value]) => (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          value ? "bg-green-50" : "bg-gray-50"
                        } flex-shrink-0`}
                      >
                        {value ? "On" : "Off"}
                      </Badge>
                      <span className="capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
