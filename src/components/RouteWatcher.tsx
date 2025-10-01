"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface RouteWatcherProps {
  children: React.ReactNode;
}

export const RouteWatcher: React.FC<RouteWatcherProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // Only track non-auth routes as previous routes
    if (!isAuthRoute) {
      sessionStorage.setItem("previous_route", pathname);
    }
  }, [pathname]);

  return <>{children}</>;
};
