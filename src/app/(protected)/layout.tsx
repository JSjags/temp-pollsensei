"use client";
import React from "react";
import { usePathname } from "next/navigation";
import PrivateRoute from "@/components/protected/PrivateRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { NavigationWrapper } from "@/components/navbar/NavigationWrapper";
import FeatureLimitation from "@/components/feature-limitation/feature-limitation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebarRoutes = ["/blog"];
  const shouldHideSidebar = hideSidebarRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  return (
    <PrivateRoute>
      <FeatureLimitation />
      <div className="w-full pb-16 md:pb-0 bg-[#F7F8FB]">
        <SidebarProvider>
          <div className="flex flex-1 gap-0 md:pr-2">
            {!shouldHideSidebar && <AppSidebar />}

            <main
              className={`flex-1 mt-2 rounded-md ${
                shouldHideSidebar ? "ml-0" : ""
              }`}
            >
              <div className="flex justify-between sticky top-0 z-[100]">
                <NavigationWrapper />
              </div>
              <div>{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </PrivateRoute>
  );
}
