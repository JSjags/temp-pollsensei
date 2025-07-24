"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import SubscriptionPage with SSR disabled to avoid prerender errors
const SubscriptionPage = dynamic(
  () => import("@/subpages/settings/SubscriptionPage"),
  { ssr: false }
);

const Page = () => {
  return <SubscriptionPage />;
};

export default Page;
