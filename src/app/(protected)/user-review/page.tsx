"use client";

import dynamic from "next/dynamic";
import Loading from "@/components/ui/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";

const UserReview = dynamic(() => import("@/subpages/survey/UserReview"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  return (
    <ErrorBoundary>
      <UserReview />
    </ErrorBoundary>
  );
}
