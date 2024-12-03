"use client";

import EarlyAccessMessage from "@/components/custom/EarlybedMessage";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";
import { CurrentPlanCard } from "./subscription/CurrentPlanCard";
import { BillingHistoryCard } from "./subscription/BillingHistoryCard";
import { PricingCards } from "./subscription/PricingCards";

const SubscriptionPage: React.FC = () => {
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
