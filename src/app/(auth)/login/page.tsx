"use client";

import { useIsLoggedIn } from "@/lib/helpers";
import { RootState } from "@/redux/store";
import LoginPage from "@/subpages/auth/LoginPage";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn({ message: "" });
  const state = useSelector((state: RootState) => state.user);
  const userRoles = useSelector((state: RootState) => state.user.user?.roles[0].role || []);
  console.log(userRoles)
  console.log(state)
  if (
   ( isLoggedIn &&
    state.user !== null) &&
   ( state.access_token !== null ||
    state.token !== null)
  ) {
   if(userRoles.includes("Super Admin")) {
    router.push("/super-admin");
   }else if (userRoles.includes("Admin")){
    router.push("/dashboard");
   }else{
    return null
   }
  }
  return <LoginPage />;
};

export default Login;
