"use client";

import { useIsLoggedIn } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import LoginPage from "@/subpages/auth/LoginPage";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirectUtils } from "@/utils/redirectUtils";

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useIsLoggedIn({ message: "", dispatch: dispatch });
  const state = useSelector((state: RootState) => state.user);

  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  const searchParams = useSearchParams();
  const ed = searchParams.get("ed");

  useEffect(() => {
    if (
      isLoggedIn &&
      state.user !== null &&
      (state.access_token !== null || state.token !== null)
    ) {
      const redirectRoute = redirectUtils.getRedirectAfterAuth(userRoles, ed);
      router.push(redirectRoute);
    }
  }, [
    isLoggedIn,
    state.user,
    state.access_token,
    state.token,
    userRoles,
    ed,
    router,
  ]);

  if (
    isLoggedIn &&
    state.user !== null &&
    (state.access_token !== null || state.token !== null)
  ) {
    return null;
  }

  return <LoginPage />;
};

export default Login;
