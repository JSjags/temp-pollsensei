"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import LoadRedirect from "../ui/LoadRedirect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useIsLoggedIn } from "@/lib/helpers";

interface PrivateRouteProps {
  children: ReactNode;
  message?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, message }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useIsLoggedIn({ message: "", dispatch: dispatch });
  const state = useSelector((state: RootState) => state.user);

  console.log(state?.user?.roles);

  const logoutMessage = message || "You must be logged in to access this page.";

  console.log(isLoggedIn);

  if (!isLoggedIn || state.user === null || state.access_token === null) {
    return <LoadRedirect text={logoutMessage} goto="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
