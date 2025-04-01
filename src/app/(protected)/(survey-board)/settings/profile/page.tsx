"use client";

import { ProfileSkeleton } from "@/subpages/settings/ProfilePage";
import dynamic from "next/dynamic";

// Dynamically import the ProfilePage component with no SSR and no loading component
const ProfilePage = dynamic(
  () => import("@/subpages/settings/ProfilePage").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <ProfileSkeleton />,
  }
);

export default function Page() {
  // Remove the Suspense wrapper since we're already handling loading state in dynamic import
  return <ProfilePage />;
}
