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
      // Add success notification/redirect logic
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data ??
          error?.response?.data?.message ??
          "Your current subscription couldn't be cancelled due to an error. Please try again later"
      );
      setShowCancelDialog(true);
      // Add success notification/redirect logic
    },
  });

  console.log(data);

  return (
    <div className="p-8">
      <Card className="mx-auto border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Subscription
            </CardTitle>
          </div>
          <CardDescription className="text-sm md:text-base">
            Your current subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-[900px]">
          <div className="min-h-screen bg-background py-4 sm:py-8">
            <div className="container mx-auto space-y-6 sm:space-y-8 p-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <CurrentPlanCard />
                <BillingHistoryCard />
              </div>
              <PricingCards />

              <div className="border-t pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">
                      Cancel Subscription
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cancel your subscription and all associated services. This
                      action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? This action
              cannot be undone and you will lose access to all premium features
              at the end of your billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
