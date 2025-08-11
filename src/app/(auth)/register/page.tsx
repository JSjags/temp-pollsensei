"use client";

import { useIsLoggedIn } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import RegisterPage from "@/subpages/auth/RegisterPage";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirectUtils } from "@/utils/redirectUtils";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useIsLoggedIn({ message: "", dispatch: dispatch });
  const state = useSelector((state: RootState) => state.user);

  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  useEffect(() => {
    if (state.user) {
      const redirectRoute = redirectUtils.getRedirectAfterAuth(userRoles);
      router.push(redirectRoute);
    }
  }, [state.user, userRoles, router]);

  if (state.user) {
    return null;
  }

  return <RegisterPage />;
};

export default Page;
