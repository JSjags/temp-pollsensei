"use client";

import { useIsLoggedIn } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import LoginPage from "@/subpages/auth/LoginPage";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

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

  console.log(userRoles);
  console.log(state);
  if (
    isLoggedIn &&
    state.user !== null &&
    (state.access_token !== null || state.token !== null)
  ) {
    if (userRoles.includes("Super Admin")) {
      router.push("/super-admin");
    } else if (userRoles.includes("Admin")) {
      if (state.user) {
      }
      router.push(
        `${
          ed
            ? ed === "2"
              ? "/surveys/edit-survey"
              : ed === "3"
              ? "/surveys/manual-survey-create"
              : "/dashboard"
            : "/dashboard"
        }`
      );
    } else {
      return null;
    }
  }
  return <LoginPage />;
};

export default Login;
