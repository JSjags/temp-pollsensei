"use client";

import { useIsLoggedIn } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import RegisterPage from "@/subpages/auth/RegisterPage";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn({ message: "" });
  const state = useSelector((state: RootState) => state.user);
  if (
    isLoggedIn ||
    state.user !== null ||
    state.access_token !== null ||
    state.token !== null
  ) {
    router.push("/dashboard");
  }
  return <RegisterPage />;
};

export default Page;
