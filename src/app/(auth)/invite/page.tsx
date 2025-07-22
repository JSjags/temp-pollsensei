"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const InvitePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.push(`/invite/complete-setup?token=${token}`);
    } else {
      // If no token is provided, redirect to register page
      router.push("/register");
    }
  }, [router, searchParams]);

  return null;
};

export default InvitePage;
