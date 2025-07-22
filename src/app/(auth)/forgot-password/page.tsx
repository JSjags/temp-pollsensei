"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ForgotPasswordPage = dynamic(
  () => import("@/subpages/auth/ForgotPasswordPage"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
