"use client";
import { ComingSoon } from "@/components/reusable/coming-soon";
import Shop from "@/components/shop";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useShopStore } from "@/components/shop/store/useShopStore";

export default function Page() {
  const searchParams = useSearchParams();
  const { setPollDialogOpen, setPollStep } = useShopStore();

  useEffect(() => {
    const bundle = searchParams.get("bundle");
    const custom = searchParams.get("custom");

    if (bundle === "true") {
      // Auto-open the PollCoin purchase dialog at checkout step
      setPollDialogOpen(true);
      setPollStep("checkout");

      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    } else if (custom === "true") {
      // Auto-open the PollCoin purchase dialog at buy step
      setPollDialogOpen(true);
      setPollStep("buy");

      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, setPollDialogOpen, setPollStep]);

  return (
    // <ComingSoon
    //   title="Shop"
    //   description="Shop for exclusive rewards and merchandise using your earned points. Browse our curated collection of items, redeem your rewards, and enjoy the benefits of your participation."
    //   eta="Q2 2025"
    //   backUrl="/dashboard"
    // />
    <div className="md:px-10 pb-16 py-8 max-md:w-screen">
      <Shop />
    </div>
  );
}
