"use client";

import { Suspense } from "react";
import ReferralRewardPage from "@/subpages/settings/ReferralRewardPage";
import dynamicImport from "next/dynamic";

// Page config for dynamic rendering
export const dynamic = "force-dynamic";

export default function Page() {
  return <ReferralRewardPage />;
}
