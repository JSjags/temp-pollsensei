"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import Loading from "@/components/ui/Loading";
import dynamic from "next/dynamic";

const Tutorials = dynamic(() => import("@/components/resource-hub/tutorials"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function Page() {
  return (
    <ErrorBoundary>
      <section className="mt-2 min-h-[50vh]">
        <Tutorials />
      </section>
    </ErrorBoundary>
  );
}
