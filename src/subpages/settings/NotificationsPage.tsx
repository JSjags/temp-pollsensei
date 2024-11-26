"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RootState } from "@/redux/store";
import { updateNotification } from "@/services/admin";
import { useUserProfileQuery } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Component() {
  const user = useSelector((state: RootState) => state.user.user);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [activityEnabled, setActivityEnabled] = useState(true);
  const { data, refetch } = useUserProfileQuery({});
  const [settings, setSettings] = useState({
    news_and_updates: (data?.data as any)?.notifications.news_and_updates,
    tips_and_tutorials: (data?.data as any)?.notifications.tips_and_tutorials,
    offers_and_promotions: (data?.data as any)?.notifications
      .offers_and_promotions,
    all_reminders_and_activities: (data?.data as any)?.notifications
      .all_reminders_and_activities,
    activities_only: (data?.data as any)?.notifications?.activities_only,
    important_reminder_only: (data?.data as any)?.notifications
      .important_reminder_only,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleUpdateNotifications = () => {
    updateNotificationMutation.mutate(settings);
  };

  const updateNotificationMutation = useMutation({
    mutationKey: ["update-notification"],
    mutationFn: (data: {
      news_and_updates: boolean;
      tips_and_tutorials: boolean;
      offers_and_promotions: boolean;
      all_reminders_and_activities: boolean;
      activities_only: boolean;
      important_reminder_only: boolean;
    }) => updateNotification(data),
    onSuccess: () => {
      refetch();
      toast.success("Notifications updated successfully");
    },
    onError: (error: any) => {
      toast.success(
        error?.response?.data?.message ??
          "Error encountered while updating notifications, please try again later."
      );
    },
  });

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);

      setSettings({
        news_and_updates: (data?.data as any)?.notifications[0]
          ?.email_notification?.news_and_updates,
        tips_and_tutorials: (data?.data as any)?.notifications[0]
          ?.email_notification?.tips_and_tutorials,
        offers_and_promotions: (data?.data as any)?.notifications[0]
          ?.email_notification?.offers_and_promotions,
        all_reminders_and_activities: (data?.data as any)?.notifications[0]
          ?.more_activity?.all_reminders_and_activities,
        activities_only: (data?.data as any)?.notifications[0]?.more_activity
          ?.activities_only,
        important_reminder_only: (data?.data as any)?.notifications[0]
          ?.more_activity?.important_reminder_only,
      });
    }
  }, [data]);

  return data?.data ? (
    <div className="p-8">
      <Card className="border-none w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Notifications
          </CardTitle>
          <CardDescription>
            Be the first to get the scoop on everything happening here. Turn it
            off anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notification</Label>
                <p className="text-sm text-muted-foreground">
                  Get email notifications on what's happening right now. You can
                  turn it off at any time
                </p>
              </div>
              {/* <Switch
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
                className="data-[state=checked]:bg-purple-600"
              /> */}
            </div>
            <div className="space-y-4 ml-1">
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.news_and_updates}
                  onCheckedChange={() =>
                    handleSettingChange("news_and_updates")
                  }
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>News and Update settings</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about cool, new features and sleek updates on
                    PollSensei
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.tips_and_tutorials}
                  onCheckedChange={() =>
                    handleSettingChange("tips_and_tutorials")
                  }
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>Tips and Tutorials</Label>
                  <p className="text-sm text-muted-foreground">
                    Level up your survey game with expertly curated tips and
                    tutorials made just for you
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.offers_and_promotions}
                  onCheckedChange={() =>
                    handleSettingChange("offers_and_promotions")
                  }
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>Offers and Promotions</Label>
                  <p className="text-sm text-muted-foreground">
                    Everyone loves a good deal. Stay on top of juicy offers and
                    promotions on PollSensei
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">More Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Never miss another direct message! Receive real time email
                  notifications from PollSensei
                </p>
              </div>
              {/* <Switch
                checked={activityEnabled}
                onCheckedChange={setActivityEnabled}
                className="data-[state=checked]:bg-purple-600"
              /> */}
            </div>
            <div className="space-y-4 ml-1">
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.all_reminders_and_activities}
                  onCheckedChange={() =>
                    handleSettingChange("all_reminders_and_activities")
                  }
                  disabled={!activityEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>All Reminders and Activities</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify me about all recent system activities and reminders
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.activities_only}
                  onCheckedChange={() => handleSettingChange("activities_only")}
                  disabled={!activityEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>Activities only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only notify me about latest activity updates
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Switch
                  checked={settings.important_reminder_only}
                  onCheckedChange={() =>
                    handleSettingChange("important_reminder_only")
                  }
                  disabled={!activityEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1">
                  <Label>Important Reminder Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only notify me about high priority activities and reminders
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full auth-btn max-w-sm"
            onClick={handleUpdateNotifications}
            disabled={updateNotificationMutation.isPending}
          >
            {updateNotificationMutation.isPending
              ? "Hang on..."
              : "Update Notifications"}
          </Button>
        </CardContent>
      </Card>
    </div>
  ) : null;
}
