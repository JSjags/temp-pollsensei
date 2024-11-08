"use client";

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

const SubscriptionPage: React.FC = () => {
  return (
    <div className="p-8">
      <Card className="mx-auto border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Subscription
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              Early Bird
            </Badge>
          </div>
          <CardDescription className="text-base md:text-lg">
            Your current subscription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-6">
            <Sparkles className="h-16 w-16 text-yellow-400" />
            <h2 className="text-xl md:text-2xl font-semibold">
              You're part of our Early Bird Program!
            </h2>
            <p className="text-muted-foreground max-w-md">
              As an early supporter, you currently don't have an active
              subscription. Enjoy full access to our platform while we're in
              this phase!
            </p>
            <div className="flex items-center space-x-2 text-yellow-500"></div>
            <p className="text-sm text-muted-foreground">
              We'll notify you when subscription options become available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
