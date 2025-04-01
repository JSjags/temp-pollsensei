"use client";

import { Suspense } from "react";
import { ProfileSkeleton } from "@/subpages/settings/ProfilePage";
import dynamicImport from "next/dynamic";

// Dynamically import the ProfilePage component with no SSR and no loading component
const ProfilePage = dynamicImport(
  () => import("@/subpages/settings/ProfilePage"),
  {
    loading: () => <ProfileSkeleton />,
  }
);

// Page config for dynamic rendering
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}
