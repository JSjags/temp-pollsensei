"use client";

import EarlyAccessMessage from "@/components/custom/EarlybedMessage";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, Star } from "lucide-react";
import { CurrentPlanCard } from "./subscription/CurrentPlanCard";
import { BillingHistoryCard } from "./subscription/BillingHistoryCard";
import { PricingCards } from "./subscription/PricingCards";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelSubscription } from "@/services/admin";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/slices/user.slice";
import { useUserProfileQuery } from "@/services/user.service";

const SubscriptionPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, refetch } = useUserProfileQuery({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const cancelSubscriptionMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success("Your current subscription has been cancelled.");
      setShowCancelDialog(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data ??
          error?.response?.data?.message ??
          "Your current subscription couldn't be cancelled due to an error. Please try again later"
      );
      setShowCancelDialog(true);
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto border-none shadow-none">
        <CardHeader className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Subscription
            </CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">
            Your current subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-[900px]">
          <div className="bg-background py-4 sm:py-6 lg:py-8">
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <CurrentPlanCard />
                <BillingHistoryCard />
              </div>
              <PricingCards />

              <div className="border-t pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-red-600">
                      Cancel Subscription
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Cancel your subscription and all associated services. This
                      action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              Cancel Subscription
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to cancel your subscription? This action
              cannot be undone and you will lose access to all premium features
              at the end of your billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setShowCancelDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
              onClick={() => cancelSubscriptionMutation.mutate()}
              disabled={cancelSubscriptionMutation.isPending}
            >
              {cancelSubscriptionMutation.isPending
                ? "Cancelling..."
                : "Yes, Cancel Subscription"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionPage;
