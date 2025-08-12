"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { redirectUtils } from "@/utils/redirectUtils";

interface RouteWatcherProps {
  children: React.ReactNode;
}

export const RouteWatcher: React.FC<RouteWatcherProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("previous_route");

    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (isAuthRoute && previousRoute) {
      if (redirectUtils.shouldStoreRoute(previousRoute)) {
        redirectUtils.storeRedirectRoute(previousRoute);
      }
    }

    if (!isAuthRoute) {
      sessionStorage.setItem("previous_route", pathname);
    }
  }, [pathname]);

  return <>{children}</>;
};
