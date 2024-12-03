"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionTiers } from "@/services/admin";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  bgColor: string;
  textColor: string;
  features: string[];
  cta: {
    text: "Current plan" | "Downgrade plan" | "Upgrade plan";
    variant: "default" | "outline" | "secondary";
  };
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Basic",
    price: "FREE",
    period: "",
    bgColor: "bg-[#ffffff]",
    textColor: "",
    features: [
      "Unlimited access",
      "1 Account",
      "200 monthly responses",
      "AI survey/Poll generation",
      "Data Export (pdf)",
    ],
    cta: {
      text: "Downgrade plan",
      variant: "outline",
    },
  },
  {
    name: "Pro",
    price: "£20",
    period: "per month",
    bgColor: "bg-[#5B03B2]",
    textColor: "text-white",
    features: [
      "Everything in Basic",
      "Add Contributors (Up to 4)",
      "Unlimited Polls and Surveys",
      "10,000 monthly responses",
      "Account Customization",
      "Offline data collection and analytics",
      "AI survey assistant",
      "Automatic AI survey reporting",
      "Speech to text feature",
      "Data Export (xls, pdf, ppt)",
      "Priority Email support",
    ],
    cta: {
      text: "Upgrade plan",
      variant: "secondary",
    },
    popular: true,
  },
  {
    name: "Business",
    price: "£99.99",
    period: "per month",
    bgColor: "bg-[#ffffff]",
    textColor: "",
    features: [
      "Everything in Pro",
      "Multiple accounts",
      "Unlimited contributors",
      "Unlimited responses",
      "A/B testing & randomization",
      "Skip Logic",
      "Multilingual Survey",
      "Advanced Data Export (xls, pdf, ppt, Power BI)",
      "Dedicated customer success manager",
    ],
    cta: {
      text: "Upgrade plan",
      variant: "default",
    },
  },
];

const generateButton = (tier: (typeof tiers)[0]) => {
  if (tier.cta.text === "Current plan") {
    return (
      <Button
        className={cn(
          "w-full text-xs sm:text-sm bg-transparent border-0 hover:bg-transparent",
          tier.popular ? "text-white" : ""
        )}
        variant={tier.cta.variant}
      >
        {tier.cta.text}
      </Button>
    );
  }

  if (tier.cta.text === "Upgrade plan") {
    return (
      <Button
        className={cn(
          "w-full text-xs sm:text-sm border-0",
          tier.popular
            ? "bg-gradient-to-r from-[#5B03B2] to-black hover:from-[#5B03B2]/90 hover:to-black/90 text-white"
            : "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] hover:from-[#5B03B2]/90 hover:to-[#9D50BB]/90"
        )}
        variant={tier.cta.variant}
      >
        {tier.cta.text}
      </Button>
    );
  }

  if (tier.cta.text === "Downgrade plan") {
    return (
      <Button
        className={cn(
          "w-full text-xs sm:text-sm bg-transparent",
          tier.popular
            ? "border-white text-white hover:bg-white/10"
            : "border border-[#5B03B2] text-gray-700 hover:bg-gray-100"
        )}
        variant={tier.cta.variant}
      >
        {tier.cta.text}
      </Button>
    );
  }

  return (
    <Button className="w-full text-xs sm:text-sm" variant={tier.cta.variant}>
      {tier.cta.text}
    </Button>
  );
};

export function PricingCards() {
  const tiersData = useQuery({
    queryKey: ["tiers"],
    queryFn: getSubscriptionTiers,
  });

  console.log(tiersData);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={cn(
            "relative rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 overflow-hidden border",
            tier.popular ? "border-[#EDEDED]" : "border-[#9D50BB21]",
            tier.bgColor && tier.bgColor,
            tier.textColor && tier.textColor
          )}
        >
          {tier.popular && (
            <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-[#F7AC0A] to-[#BE6C07] px-3 py-2 text-xs sm:text-sm font-medium text-white">
              Most Popular
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium">{tier.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-bold tracking-tight text-purple-600",
                    tier.textColor && tier.textColor
                  )}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span
                    className={cn(
                      "ml-1 text-xs sm:text-sm text-muted-foreground",
                      tier.textColor && tier.textColor
                    )}
                  >
                    {tier.period}
                  </span>
                )}
              </div>
            </div>
            <div className="my-6 h-[1px] bg-gray-500/30" />
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium">
                What you will get
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex justify-start items-center">
                    <CheckCircle2Icon
                      className={cn(
                        "mr-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-600",
                        tier.textColor && tier.textColor
                      )}
                    />
                    <span
                      className={cn(
                        "text-left",
                        tier.textColor && tier.textColor
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="py-3"></div>
            {generateButton(tier)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
