"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InvitePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return null;
};

export default InvitePage;
